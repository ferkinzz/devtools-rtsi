"use client";

import { useState } from "react";
import type { Decision } from "../types";
import { TAG_COLORS } from "../types";

interface Props {
  decisions: Decision[];
  onAdd: (d: Omit<Decision, "id" | "createdAt">) => void;
  onUpdate: (id: string, u: Partial<Decision>) => void;
  onDelete: (id: string) => void;
}

function TagBadge({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag] ?? "#6B7280";
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded font-mono"
      style={{ backgroundColor: color + "22", color }}
    >
      {tag}
    </span>
  );
}

function parseTags(input: string): string[] {
  return input.match(/#\w+/g)?.map((t) => t.toLowerCase()) ?? [];
}

const EMPTY_FORM = {
  title: "",
  context: "",
  decision: "",
  alternatives: "",
  consequences: "",
  tags: "",
};

export function DecisionLog({ decisions, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.decision.trim()) return;
    onAdd({
      title: form.title.trim(),
      context: form.context.trim(),
      decision: form.decision.trim(),
      alternatives: form.alternatives.trim() || undefined,
      consequences: form.consequences.trim() || undefined,
      tags: parseTags(form.tags),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30 font-mono">{decisions.length} decisiones</span>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          + Decisión
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Nueva decisión técnica</p>
          {[
            { key: "title", placeholder: "Título de la decisión *", required: true },
            { key: "context", placeholder: "Contexto / Problema..." },
            { key: "decision", placeholder: "Decisión tomada *", required: true },
            { key: "alternatives", placeholder: "Alternativas consideradas..." },
            { key: "consequences", placeholder: "Consecuencias esperadas..." },
          ].map(({ key, placeholder }) => (
            <textarea
              key={key}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              rows={key === "title" ? 1 : 2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
            />
          ))}
          <input
            type="text"
            placeholder="#backend #arquitectura"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {decisions.length === 0 && (
        <p className="text-white/20 text-sm text-center py-8">Sin decisiones registradas</p>
      )}

      <div className="space-y-2">
        {decisions.map((d) => (
          <div key={d.id} className="group border border-white/10 bg-white/5 rounded-xl overflow-hidden">
            <div
              className="flex items-start gap-3 px-4 py-3 cursor-pointer"
              onClick={() => setExpanded(expanded === d.id ? null : d.id)}
            >
              <span className="text-white/20 mt-0.5 text-xs font-mono shrink-0">ADR</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80">{d.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {d.tags.map((t) => <TagBadge key={t} tag={t} />)}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white/20 font-mono">
                  {new Date(d.createdAt).toLocaleDateString("es-MX")}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(d.id); }}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <span className="text-white/20 text-xs">{expanded === d.id ? "▲" : "▼"}</span>
            </div>

            {expanded === d.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                {d.context && (
                  <div>
                    <p className="text-xs text-white/30 uppercase font-mono mb-1">Contexto</p>
                    <p className="text-sm text-white/60">{d.context}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/30 uppercase font-mono mb-1">Decisión</p>
                  <p className="text-sm text-white/80">{d.decision}</p>
                </div>
                {d.alternatives && (
                  <div>
                    <p className="text-xs text-white/30 uppercase font-mono mb-1">Alternativas</p>
                    <p className="text-sm text-white/50">{d.alternatives}</p>
                  </div>
                )}
                {d.consequences && (
                  <div>
                    <p className="text-xs text-white/30 uppercase font-mono mb-1">Consecuencias</p>
                    <p className="text-sm text-white/50">{d.consequences}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
