"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { buildPrompt, buildContextPreview, type FocusMode } from "./aiContext";
import { streamOllama, pingOllama } from "./ollamaClient";
import type { DevData } from "../../types";
import type { Roadmap } from "../roadmap/roadmaptypes";

type Status = "idle" | "checking" | "loading" | "streaming" | "done" | "offline" | "error";

const FOCUS_OPTIONS: { value: FocusMode; label: string; description: string }[] = [
  { value: "general",  label: "✦ Análisis general",      description: "Estado completo del proyecto" },
  { value: "blocked",  label: "🚨 Bloqueados",            description: "Diagnóstico y desbloqueo" },
  { value: "roadmap",  label: "🗺 Progreso del roadmap",  description: "Fases, velocidad y riesgos" },
  { value: "ideas",    label: "💡 Ideas pendientes",      description: "¿Cuáles convertir a task?" },
  { value: "risks",    label: "⚠️ Riesgos técnicos",     description: "Deuda, señales y mitigación" },
  { value: "notes",    label: "📝 Análisis de notas",     description: "Qué revelan tus sticky notes" },
];

const MAX_WORDS = 400;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface ProjectContextWidgetProps {
  value: string;
  onSave: (v: string) => void;
}

function ProjectContextWidget({ value, onSave }: ProjectContextWidgetProps) {
  const hasContext = value.trim().length > 0;
  const [open, setOpen] = useState(!hasContext);
  const [draft, setDraft] = useState(value);
  const words = wordCount(draft);
  const overLimit = words > MAX_WORDS;

  // Guard: onSave should always be a function, but protect against stale props
  const handleSave = typeof onSave === "function" ? onSave : () => {};

  useEffect(() => { setDraft(value); }, [value]);

  const save = () => {
    if (overLimit) return;
    handleSave(draft.trim());
    if (draft.trim()) setOpen(false);
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden shrink-0">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/40">CONTEXTO DEL PROYECTO</span>
          {hasContext ? (
            <span className="text-xs bg-emerald-400/15 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              ✓ definido
            </span>
          ) : (
            <span className="text-xs bg-amber-400/15 text-amber-400 px-1.5 py-0.5 rounded font-mono">
              sin contexto
            </span>
          )}
        </div>
        <span className="text-white/20 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Collapsed preview */}
      {!open && hasContext && (
        <div className="px-4 pb-3">
          <p className="text-xs text-white/30 leading-relaxed line-clamp-2">{value}</p>
        </div>
      )}

      {/* Editor */}
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/8">
          <p className="text-xs text-white/25 pt-3">
            Describe tu proyecto: stack, objetivo, estado actual, contexto relevante.
            El AI usará esto en todos los análisis.
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ej: Aplicación SaaS de gestión de eventos para organizadores independientes. Stack: Next.js 15, Supabase, Stripe. Actualmente en fase MVP, lanzamiento previsto en 6 semanas. El mayor riesgo es la integración de pagos..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/25 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono ${overLimit ? "text-red-400" : "text-white/25"}`}>
              {words}/{MAX_WORDS} palabras
            </span>
            <div className="flex gap-2">
              {hasContext && (
                <button
                  onClick={() => { handleSave(""); setDraft(""); }}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors px-2 py-1"
                >
                  Borrar
                </button>
              )}
              <button
                onClick={save}
                disabled={overLimit || !draft.trim()}
                className="px-3 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-30"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: DevData;
  roadmaps: Roadmap[];
  onSetContext: (ctx: string) => void;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="text-white/90 font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="text-amber-400/80 font-mono text-xs bg-white/5 px-1 rounded">{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const k = key++;
    if (!line.trim()) { elements.push(<div key={k} className="h-2" />); continue; }

    if (line.startsWith("### "))
      { elements.push(<p key={k} className="text-xs font-mono text-white/35 uppercase tracking-wider mt-5 mb-1">{line.slice(4)}</p>); continue; }
    if (line.startsWith("## "))
      { elements.push(<p key={k} className="text-sm font-semibold text-white/80 mt-4 mb-1">{line.slice(3)}</p>); continue; }
    if (line.startsWith("# "))
      { elements.push(<p key={k} className="text-base font-bold text-white mt-4 mb-1">{line.slice(2)}</p>); continue; }

    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      elements.push(
        <div key={k} className="flex gap-3 items-start py-0.5">
          <span className="text-xs font-mono text-white/25 shrink-0 w-4 mt-0.5">{numMatch[1]}.</span>
          <p className="text-sm text-white/72 leading-relaxed">{renderInline(numMatch[2])}</p>
        </div>
      );
      continue;
    }

    if (line.match(/^[-*]\s/)) {
      elements.push(
        <div key={k} className="flex gap-3 items-start py-0.5">
          <span className="text-white/20 shrink-0 mt-1.5 text-xs">·</span>
          <p className="text-sm text-white/65 leading-relaxed">{renderInline(line.replace(/^[-*]\s/, ""))}</p>
        </div>
      );
      continue;
    }

    elements.push(<p key={k} className="text-sm text-white/65 leading-relaxed">{renderInline(line)}</p>);
  }
  return elements;
}

export function AIPanel({ data, roadmaps, onSetContext }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<FocusMode>("general");
  const [promptPreview, setPromptPreview] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "streaming" && outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output, status]);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setOutput("");
    setStatus("checking");

    const online = await pingOllama();
    if (!online) { setStatus("offline"); return; }
    setStatus("loading");

    try {
      const prompt = buildPrompt(data, roadmaps, mode);
      setStatus("streaming");
      let full = "";
      for await (const chunk of streamOllama(prompt, ctrl.signal)) {
        if (ctrl.signal.aborted) break;
        full += chunk;
        setOutput(full);
      }
      setStatus("done");
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") return;
      setStatus("error");
    }
  }, [data, roadmaps, mode]);

  const stop = () => { abortRef.current?.abort(); setStatus("done"); };
  const isRunning = status === "streaming" || status === "loading" || status === "checking";
  const selected = FOCUS_OPTIONS.find((o) => o.value === mode)!;

  return (
    <div className="space-y-4 h-full flex flex-col">

      {/* Project context widget */}
      <ProjectContextWidget
        value={data.projectContext ?? ""}
        onSave={onSetContext}
      />

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-1.5 shrink-0">
        {FOCUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => { setMode(o.value); setOutput(""); setStatus("idle"); }}
            disabled={isRunning}
            className={`px-3 py-2.5 rounded-xl text-left transition-colors border disabled:opacity-40 ${
              mode === o.value
                ? "border-white/25 bg-white/8 text-white"
                : "border-white/8 text-white/35 hover:text-white/60 hover:border-white/15"
            }`}
          >
            <p className="text-xs font-medium">{o.label}</p>
            <p className="text-xs text-white/25 mt-0.5 leading-tight">{o.description}</p>
          </button>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-xs text-white/30 font-mono flex-1">
          Modo: <span className="text-white/50">{selected.label}</span>
        </p>
        <button
          onClick={() => setPromptPreview((v) => !v)}
          className="text-xs text-white/20 hover:text-white/40 transition-colors font-mono border border-white/8 rounded-lg px-2.5 py-1.5"
        >
          {promptPreview ? "▲" : "▼"} prompt
        </button>
        {isRunning ? (
          <button onClick={stop} className="px-4 py-1.5 text-sm bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors">
            ⏹ Detener
          </button>
        ) : (
          <button onClick={run} className="px-4 py-1.5 text-sm bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors">
            {output ? "↺ Re-analizar" : "✦ Analizar"}
          </button>
        )}
      </div>

      {promptPreview && (
        <pre className="bg-white/3 border border-white/8 rounded-xl p-4 text-xs text-white/35 font-mono overflow-auto max-h-52 whitespace-pre-wrap shrink-0">
          {buildContextPreview(data, roadmaps, mode)}
        </pre>
      )}

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto min-h-0">
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
            <span className="text-3xl opacity-20">✦</span>
            <p className="text-sm text-white/30">
              {data.projectContext
                ? <>Contexto listo · Selecciona un modo y presiona <strong className="text-white/50">Analizar</strong></>
                : <>Agrega contexto del proyecto arriba para mejores resultados</>}
            </p>
            <p className="text-xs text-white/15 font-mono">mistral:7b-instruct · localhost:11434</p>
          </div>
        )}

        {status === "checking" && (
          <div className="flex items-center gap-3 p-4">
            <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay:`${i*150}ms`}}/>)}</div>
            <span className="text-sm text-white/40">Conectando con Ollama...</span>
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center gap-3 p-4">
            <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-pulse" style={{animationDelay:`${i*150}ms`}}/>)}</div>
            <span className="text-sm text-white/40">Cargando modelo...</span>
          </div>
        )}

        {status === "offline" && (
          <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl">⊘</span>
              <div>
                <p className="text-sm font-semibold text-red-400">Ollama no encontrado</p>
                <p className="text-xs text-white/40 font-mono">localhost:11434 no responde</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-white/40 font-mono">
              <p>Verifica que Ollama esté corriendo:</p>
              <code className="block bg-white/5 rounded px-3 py-2 text-white/60">ollama serve</code>
              <p className="mt-2">Y que tengas el modelo:</p>
              <code className="block bg-white/5 rounded px-3 py-2 text-white/60">ollama pull mistral:7b-instruct</code>
            </div>
            <button onClick={run} className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1.5 transition-colors">Reintentar</button>
          </div>
        )}

        {status === "error" && (
          <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-4 space-y-2">
            <p className="text-sm text-red-400">Error al procesar la respuesta</p>
            <button onClick={run} className="text-xs text-white/40 hover:text-white/70 transition-colors">Reintentar</button>
          </div>
        )}

        {(status === "streaming" || status === "done") && output && (
          <div className="space-y-0.5">
            {renderMarkdown(output)}
            {status === "streaming" && (
              <span className="inline-block w-1.5 h-4 bg-white/40 rounded-sm animate-pulse ml-1 align-middle" />
            )}
            {status === "done" && (
              <p className="text-xs text-white/15 font-mono mt-4 pt-3 border-t border-white/5">
                {selected.label} · mistral:7b-instruct · {new Date().toLocaleTimeString("es-MX")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}