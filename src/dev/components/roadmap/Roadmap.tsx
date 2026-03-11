"use client";

import { useState } from "react";
import {
  STATUS_META,
  LEVEL_NAME_PRESETS,
  DEFAULT_LEVEL_NAMES,
  isLocked,
  hoursUntilLock,
  l2Progress,
  l3Progress,
  computeProgress,
} from "./roadmaptypes";
import { useRoadmapStore } from "./useRoadmapStore";
import type {
  RoadmapL1,
  RoadmapL2,
  RoadmapL3,
  RoadmapStatus,
  RoadmapConfig,
} from "./roadmaptypes";

// ─── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({
  pct,
  size = "md",
}: {
  pct: number;
  size?: "sm" | "md";
}) {
  const color =
    pct === 100
      ? "bg-emerald-400"
      : pct >= 60
        ? "bg-blue-400"
        : pct >= 30
          ? "bg-amber-400"
          : "bg-white/20";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 rounded-full overflow-hidden bg-white/10 ${size === "sm" ? "h-1" : "h-1.5"
          }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-white/30 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Status selector ─────────────────────────────────────────────────────────
function StatusPill({
  status,
  onChange,
}: {
  status: RoadmapStatus;
  onChange: (s: RoadmapStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[status];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono transition-colors ${meta.bg} ${meta.color}`}
      >
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[160px]">
          {(Object.keys(STATUS_META) as RoadmapStatus[]).map((s) => {
            const m = STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${s === status ? m.color : "text-white/50"
                  }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Lock badge ──────────────────────────────────────────────────────────────
function LockBadge({ createdAt }: { createdAt: string }) {
  const locked = isLocked(createdAt);
  const hours = hoursUntilLock(createdAt);

  if (locked) {
    return (
      <span className="text-xs text-white/15 font-mono" title="Título bloqueado (>24h)">
        🔒
      </span>
    );
  }
  return (
    <span
      className="text-xs text-amber-400/50 font-mono"
      title={`Se bloquea en ${hours}h`}
    >
      🔓 {hours}h
    </span>
  );
}

// ─── Inline edit field ───────────────────────────────────────────────────────
function EditableField({
  value,
  locked,
  placeholder,
  multiline,
  onSave,
  className,
}: {
  value?: string;
  locked: boolean;
  placeholder: string;
  multiline?: boolean;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (locked || !editing) {
    return (
      <span
        onClick={() => !locked && setEditing(true)}
        className={`${className} ${locked ? "cursor-default" : "cursor-text hover:text-white transition-colors"
          } ${!value ? "text-white/20 italic" : ""}`}
      >
        {value || placeholder}
      </span>
    );
  }

  const save = () => {
    onSave(draft.trim());
    setEditing(false);
  };

  if (multiline) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
        rows={2}
        className={`${className} bg-white/5 border border-white/20 rounded px-2 py-1 resize-none focus:outline-none w-full`}
      />
    );
  }

  return (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") setEditing(false);
      }}
      className={`${className} bg-white/5 border border-white/20 rounded px-2 py-0.5 focus:outline-none`}
    />
  );
}

// ─── Closing note modal ───────────────────────────────────────────────────────
function ClosingNoteModal({
  title,
  existing,
  onSave,
  onClose,
}: {
  title: string;
  existing?: string;
  onSave: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(existing ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#141414] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div>
          <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">
            Nota de cierre
          </p>
          <p className="text-sm text-white/70">{title}</p>
        </div>
        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Qué salió bien? ¿Qué se puede mejorar? (opcional)"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(note.trim());
              onClose();
            }}
            className="px-4 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
          >
            Marcar como completado
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── L3 item ─────────────────────────────────────────────────────────────────
function L3Item({
  item,
  levelName,
  onUpdate,
  onDelete,
}: {
  item: RoadmapL3;
  levelName: string;
  onUpdate: (u: Partial<RoadmapL3>) => void;
  onDelete: () => void;
}) {
  const locked = isLocked(item.createdAt);
  const meta = STATUS_META[item.status];
  const [showClosing, setShowClosing] = useState(false);

  const handleStatusChange = (s: RoadmapStatus) => {
    if (s === "done" && item.status !== "done") {
      setShowClosing(true);
    } else {
      onUpdate({ status: s });
    }
  };

  return (
    <>
      {showClosing && (
        <ClosingNoteModal
          title={item.title}
          existing={item.closingNote}
          onSave={(note) => onUpdate({ status: "done", closingNote: note || undefined })}
          onClose={() => setShowClosing(false)}
        />
      )}
      <div
        className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors ${item.status === "done"
            ? "border-white/5 bg-white/2 opacity-60"
            : "border-white/5 hover:border-white/10 hover:bg-white/3"
          }`}
      >
        <div className="flex items-center gap-2 mt-0.5 shrink-0">
          <StatusPill status={item.status} onChange={handleStatusChange} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <EditableField
            value={item.title}
            locked={locked}
            placeholder={`${levelName} sin título`}
            onSave={(v) => onUpdate({ title: v })}
            className={`text-sm block w-full ${item.status === "done" ? "line-through text-white/30" : "text-white/80"
              }`}
          />
          <EditableField
            value={item.summary}
            locked={locked}
            placeholder="Resumen..."
            multiline
            onSave={(v) => onUpdate({ summary: v })}
            className="text-xs text-white/40 block w-full"
          />
          {item.closingNote && (
            <p className="text-xs text-emerald-400/60 italic">
              ✓ {item.closingNote}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LockBadge createdAt={item.createdAt} />
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-xs text-white/20 hover:text-red-400 transition-all"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}

// ─── L2 item ─────────────────────────────────────────────────────────────────
function L2Item({
  item,
  levelNames,
  onUpdate,
  onDelete,
  onAddL3,
  onUpdateL3,
  onDeleteL3,
}: {
  item: RoadmapL2;
  levelNames: [string, string, string];
  onUpdate: (u: Partial<RoadmapL2>) => void;
  onDelete: () => void;
  onAddL3: (title: string) => void;
  onUpdateL3: (l3Id: string, u: Partial<RoadmapL3>) => void;
  onDeleteL3: (l3Id: string) => void;
}) {
  const locked = isLocked(item.createdAt);
  const pct = l3Progress(item);
  const [collapsed, setCollapsed] = useState(false);
  const [addingL3, setAddingL3] = useState(false);
  const [l3Title, setL3Title] = useState("");
  const [showClosing, setShowClosing] = useState(false);

  const handleStatusChange = (s: RoadmapStatus) => {
    if (s === "done" && item.status !== "done") {
      setShowClosing(true);
    } else {
      onUpdate({ status: s });
    }
  };

  const submitL3 = () => {
    if (!l3Title.trim()) return;
    onAddL3(l3Title.trim());
    setL3Title("");
    setAddingL3(false);
  };

  return (
    <>
      {showClosing && (
        <ClosingNoteModal
          title={item.title}
          existing={item.closingNote}
          onSave={(note) => onUpdate({ status: "done", closingNote: note || undefined })}
          onClose={() => setShowClosing(false)}
        />
      )}
      <div className="border border-white/8 rounded-xl overflow-hidden">
        {/* L2 header */}
        <div className="bg-white/3 px-4 py-3 space-y-2">
          <div className="flex items-center gap-3 group">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="text-white/20 hover:text-white/50 transition-colors text-xs w-4"
            >
              {collapsed ? "▶" : "▼"}
            </button>
            <StatusPill status={item.status} onChange={handleStatusChange} />
            <div className="flex-1 min-w-0">
              <EditableField
                value={item.title}
                locked={locked}
                placeholder={`${levelNames[1]} sin título`}
                onSave={(v) => onUpdate({ title: v })}
                className="text-sm font-medium text-white/80 block"
              />
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <LockBadge createdAt={item.createdAt} />
              <button
                onClick={onDelete}
                className="text-xs text-white/20 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          {item.summary && (
            <EditableField
              value={item.summary}
              locked={locked}
              placeholder="Resumen..."
              multiline
              onSave={(v) => onUpdate({ summary: v })}
              className="text-xs text-white/40 block ml-7"
            />
          )}
          {!item.summary && !locked && (
            <EditableField
              value={item.summary}
              locked={false}
              placeholder="+ Agregar resumen..."
              multiline
              onSave={(v) => v && onUpdate({ summary: v })}
              className="text-xs text-white/20 block ml-7"
            />
          )}
          {item.children.length > 0 && (
            <div className="ml-7">
              <ProgressBar pct={pct} size="sm" />
            </div>
          )}
        </div>

        {/* L3 children */}
        {!collapsed && (
          <div className="px-3 py-2 space-y-1">
            {item.children.map((l3) => (
              <L3Item
                key={l3.id}
                item={l3}
                levelName={levelNames[2]}
                onUpdate={(u) => onUpdateL3(l3.id, u)}
                onDelete={() => onDeleteL3(l3.id)}
              />
            ))}

            {addingL3 ? (
              <div className="flex gap-2 px-3 py-2">
                <input
                  autoFocus
                  value={l3Title}
                  onChange={(e) => setL3Title(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitL3();
                    if (e.key === "Escape") setAddingL3(false);
                  }}
                  placeholder={`Nuevo ${levelNames[2]}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={submitL3}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/15 text-white/70 rounded-lg transition-colors"
                >
                  ↵
                </button>
                <button
                  onClick={() => setAddingL3(false)}
                  className="px-2 py-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingL3(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-white/20 hover:text-white/50 transition-colors w-full rounded-lg hover:bg-white/3"
              >
                <span>+</span>
                <span>Agregar {levelNames[2]}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── L1 item ─────────────────────────────────────────────────────────────────
function L1Item({
  item,
  roadmapId,
  levelNames,
  store,
}: {
  item: RoadmapL1;
  roadmapId: string;
  levelNames: [string, string, string];
  store: ReturnType<typeof useRoadmapStore>;
}) {
  const locked = isLocked(item.createdAt);
  const pct = l2Progress(item);
  const [collapsed, setCollapsed] = useState(false);
  const [addingL2, setAddingL2] = useState(false);
  const [l2Title, setL2Title] = useState("");
  const [showClosing, setShowClosing] = useState(false);

  const handleStatusChange = (s: RoadmapStatus) => {
    if (s === "done" && item.status !== "done") {
      setShowClosing(true);
    } else {
      store.updateL1(roadmapId, item.id, { status: s });
    }
  };

  const submitL2 = () => {
    if (!l2Title.trim()) return;
    store.addL2(roadmapId, item.id, l2Title.trim());
    setL2Title("");
    setAddingL2(false);
  };

  const allL3Statuses = item.children.flatMap((l2) =>
    l2.children.map((l3) => l3.status)
  );
  const totalItems = allL3Statuses.length;
  const doneItems = allL3Statuses.filter((s) => s === "done").length;

  return (
    <>
      {showClosing && (
        <ClosingNoteModal
          title={item.title}
          existing={item.closingNote}
          onSave={(note) =>
            store.updateL1(roadmapId, item.id, {
              status: "done",
              closingNote: note || undefined,
            })
          }
          onClose={() => setShowClosing(false)}
        />
      )}
      <div className="border border-white/12 rounded-2xl overflow-hidden">
        {/* L1 header */}
        <div
          className={`px-5 py-4 space-y-3 ${item.status === "done" ? "bg-emerald-400/5" : "bg-white/4"
            }`}
        >
          <div className="flex items-start gap-3 group">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="text-white/20 hover:text-white/50 transition-colors text-sm mt-0.5"
            >
              {collapsed ? "▶" : "▼"}
            </button>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <StatusPill status={item.status} onChange={handleStatusChange} />
                <EditableField
                  value={item.title}
                  locked={locked}
                  placeholder={`${levelNames[0]} sin título`}
                  onSave={(v) => store.updateL1(roadmapId, item.id, { title: v })}
                  className="text-base font-semibold text-white/90"
                />
              </div>
              <EditableField
                value={item.summary}
                locked={locked}
                placeholder="+ Resumen de esta fase..."
                multiline
                onSave={(v) => store.updateL1(roadmapId, item.id, { summary: v })}
                className="text-sm text-white/40 block"
              />
              {item.closingNote && (
                <p className="text-xs text-emerald-400/60 italic">
                  ✓ {item.closingNote}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <LockBadge createdAt={item.createdAt} />
              <button
                onClick={() => store.deleteL1(roadmapId, item.id)}
                className="text-xs text-white/20 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress */}
          {totalItems > 0 && (
            <div className="space-y-1">
              <ProgressBar pct={pct} />
              <p className="text-xs text-white/20 font-mono">
                {doneItems}/{totalItems} items completados ·{" "}
                {item.children.length} {levelNames[1].toLowerCase()}s
              </p>
            </div>
          )}
        </div>

        {/* L2 children */}
        {!collapsed && (
          <div className="px-4 py-3 space-y-3">
            {item.children.map((l2) => (
              <L2Item
                key={l2.id}
                item={l2}
                levelNames={levelNames}
                onUpdate={(u) => store.updateL2(roadmapId, item.id, l2.id, u)}
                onDelete={() => store.deleteL2(roadmapId, item.id, l2.id)}
                onAddL3={(title) =>
                  store.addL3(roadmapId, item.id, l2.id, title)
                }
                onUpdateL3={(l3Id, u) =>
                  store.updateL3(roadmapId, item.id, l2.id, l3Id, u)
                }
                onDeleteL3={(l3Id) =>
                  store.deleteL3(roadmapId, item.id, l2.id, l3Id)
                }
              />
            ))}

            {addingL2 ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={l2Title}
                  onChange={(e) => setL2Title(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitL2();
                    if (e.key === "Escape") setAddingL2(false);
                  }}
                  placeholder={`Nueva ${levelNames[1]}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={submitL2}
                  className="px-3 py-2 text-sm bg-white/10 hover:bg-white/15 text-white/70 rounded-lg transition-colors"
                >
                  ↵
                </button>
                <button
                  onClick={() => setAddingL2(false)}
                  className="px-2 py-2 text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingL2(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/25 hover:text-white/55 transition-colors w-full rounded-xl hover:bg-white/3 border border-dashed border-white/10 hover:border-white/20"
              >
                <span>+</span>
                <span>Agregar {levelNames[1]}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Create Roadmap form ──────────────────────────────────────────────────────
function CreateRoadmapForm({ onCreate }: { onCreate: (name: string, config: RoadmapConfig) => void }) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<number>(0);
  const [custom, setCustom] = useState<[string, string, string]>([...DEFAULT_LEVEL_NAMES]);
  const [useCustom, setUseCustom] = useState(false);

  const levelNames: [string, string, string] = useCustom ? custom : LEVEL_NAME_PRESETS[preset];

  return (
    <div className="max-w-md mx-auto mt-16 space-y-6">
      <div>
        <p className="text-xs text-white/30 font-mono uppercase tracking-wider mb-1">Nuevo roadmap</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del roadmap..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30"
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs text-white/40">Nombres de niveles</p>
        <div className="grid grid-cols-2 gap-2">
          {LEVEL_NAME_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => { setPreset(i); setUseCustom(false); }}
              className={`px-3 py-2 rounded-xl text-xs text-left transition-colors border ${!useCustom && preset === i
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/10 text-white/40 hover:text-white/60"
                }`}
            >
              {p.join(" → ")}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={`px-3 py-2 rounded-xl text-xs text-left transition-colors border ${useCustom
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-white/40 hover:text-white/60"
              }`}
          >
            Personalizado...
          </button>
        </div>

        {useCustom && (
          <div className="flex gap-2">
            {custom.map((v, i) => (
              <input
                key={i}
                value={v}
                onChange={(e) => {
                  const next = [...custom] as [string, string, string];
                  next[i] = e.target.value;
                  setCustom(next);
                }}
                placeholder={`Nivel ${i + 1}`}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
              />
            ))}
          </div>
        )}

        <p className="text-xs text-white/20 font-mono">
          {levelNames[0]} → {levelNames[1]} → {levelNames[2]}
        </p>
      </div>

      <button
        onClick={() => {
          if (!name.trim()) return;
          onCreate(name.trim(), { levelNames });
        }}
        disabled={!name.trim()}
        className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30"
      >
        Crear roadmap
      </button>
    </div>
  );
}

// ─── Main Roadmap component ───────────────────────────────────────────────────
export function Roadmap({ store }: { store: ReturnType<typeof useRoadmapStore> }) {
  const [addingL1, setAddingL1] = useState(false);
  const [l1Title, setL1Title] = useState("");

  if (store.loading) return null;

  const { active } = store;

  // Global progress
  const allStatuses = active?.items.flatMap((l1) =>
    l1.children.flatMap((l2) => l2.children.map((l3) => l3.status))
  ) ?? [];
  const globalPct = computeProgress(allStatuses);
  const totalDone = allStatuses.filter((s) => s === "done").length;

  const submitL1 = () => {
    if (!l1Title.trim() || !active) return;
    store.addL1(active.id, l1Title.trim());
    setL1Title("");
    setAddingL1(false);
  };

  return (
    <div className="space-y-6">
      {/* Roadmap selector + global progress */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {store.roadmaps.map((r) => (
              <button
                key={r.id}
                onClick={() => store.setActiveId(r.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${store.activeId === r.id
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70"
                  }`}
              >
                {r.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => store.setActiveId(null)}
            className="px-3 py-1.5 text-xs rounded-lg text-white/25 hover:text-white/50 border border-dashed border-white/10 hover:border-white/20 transition-colors ml-auto"
          >
            + Nuevo roadmap
          </button>
        </div>

        {active && allStatuses.length > 0 && (
          <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 font-mono">Progreso global · {active.name}</span>
              <span className="text-xs text-white/30 font-mono">
                {totalDone}/{allStatuses.length} completados
              </span>
            </div>
            <ProgressBar pct={globalPct} />
          </div>
        )}
      </div>

      {/* Content */}
      {!active ? (
        <CreateRoadmapForm onCreate={store.createRoadmap} />
      ) : (
        <div className="space-y-4">
          {active.items.length === 0 && (
            <p className="text-white/20 text-sm text-center py-8">
              Sin {active.config.levelNames[0].toLowerCase()}s — agrega el primero
            </p>
          )}

          {active.items.map((l1) => (
            <L1Item
              key={l1.id}
              item={l1}
              roadmapId={active.id}
              levelNames={active.config.levelNames}
              store={store}
            />
          ))}

          {addingL1 ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={l1Title}
                onChange={(e) => setL1Title(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitL1();
                  if (e.key === "Escape") setAddingL1(false);
                }}
                placeholder={`Nueva ${active.config.levelNames[0]}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
              <button
                onClick={submitL1}
                className="px-4 py-3 text-sm bg-white/10 hover:bg-white/15 text-white/70 rounded-xl transition-colors"
              >
                ↵
              </button>
              <button
                onClick={() => setAddingL1(false)}
                className="px-3 py-3 text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingL1(true)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-white/25 hover:text-white/55 transition-colors w-full rounded-2xl hover:bg-white/3 border border-dashed border-white/10 hover:border-white/20"
            >
              <span>+</span>
              <span>Agregar {active.config.levelNames[0]}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}