"use client";

import { useState, useMemo } from "react";
import type { Task, Priority, TaskStatus } from "../types";
import { TAG_COLORS } from "../types";

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; dot: string }> = {
  high: { label: "Alta", color: "text-red-400", dot: "bg-red-400" },
  medium: { label: "Media", color: "text-amber-400", dot: "bg-amber-400" },
  low: { label: "Baja", color: "text-emerald-400", dot: "bg-emerald-400" },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: string }> = {
  pending: { label: "Pendiente", icon: "○" },
  in_progress: { label: "En progreso", icon: "◐" },
  done: { label: "Hecho", icon: "●" },
  blocked: { label: "Bloqueado", icon: "⊘" },
};

interface Props {
  tasks: Task[];
  onAdd: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => void;
}

type Filter = "all" | "pending" | "in_progress" | "done" | "blocked";
type TypeFilter = "all" | "task" | "idea";

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

export function TaskBoard({ tasks, onAdd, onUpdate, onDelete, onConvert }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    tags: "",
    type: "task" as "task" | "idea",
  });

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(q);
        const inTags = t.tags.some((tag) => tag.includes(q));
        if (!inTitle && !inTags) return false;
      }
      return true;
    });
  }, [tasks, filter, typeFilter, search]);

  const pending = tasks.filter((t) => t.type === "task" && t.status !== "done").length;
  const done = tasks.filter((t) => t.type === "task" && t.status === "done").length;
  const total = tasks.filter((t) => t.type === "task").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function handleSubmit() {
    if (!form.title.trim()) return;
    onAdd({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: "pending",
      priority: form.priority,
      tags: parseTags(form.tags),
      type: form.type,
    });
    setForm({ title: "", description: "", priority: "medium", tags: "", type: "task" });
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-mono text-white/40">
          {done}/{total} tasks · {pending} pendientes
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 w-40"
        />
        <div className="flex gap-1">
          {(["all", "pending", "in_progress", "done", "blocked"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                filter === f
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f === "all" ? "Todos" : STATUS_CONFIG[f as TaskStatus]?.label ?? f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {(["all", "task", "idea"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                typeFilter === t
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "all" ? "Todos" : t === "task" ? "Tasks" : "Ideas"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-2 px-3 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setForm((f) => ({ ...f, type: "task" }))}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                form.type === "task" ? "bg-white/15 text-white" : "text-white/40"
              }`}
            >
              Task
            </button>
            <button
              onClick={() => setForm((f) => ({ ...f, type: "idea" }))}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                form.type === "idea" ? "bg-white/15 text-white" : "text-white/40"
              }`}
            >
              💡 Idea
            </button>
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Título..."
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
          />
          <input
            type="text"
            placeholder="Descripción (opcional)..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="#backend #ui #bug"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
            />
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value as Priority }))
              }
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Media</option>
              <option value="low">🟢 Baja</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-white/20 text-sm text-center py-8">Sin items</p>
        )}
        {filtered.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onConvert={onConvert}
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onUpdate,
  onDelete,
  onConvert,
}: {
  task: Task;
  onUpdate: (id: string, u: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];

  const cycleStatus = () => {
    const order: TaskStatus[] = ["pending", "in_progress", "done", "blocked"];
    const idx = order.indexOf(task.status);
    const next = order[(idx + 1) % order.length];
    onUpdate(task.id, {
      status: next,
      completedAt: next === "done" ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div
      className={`group border rounded-xl transition-all ${
        task.status === "done"
          ? "border-white/5 bg-white/2 opacity-50"
          : task.status === "blocked"
          ? "border-red-500/20 bg-red-500/5"
          : "border-white/10 bg-white/5 hover:bg-white/8"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={cycleStatus}
          className={`text-base w-5 shrink-0 ${
            task.status === "done" ? "text-emerald-400" : "text-white/30 hover:text-white/60"
          } transition-colors`}
          title={s.label}
        >
          {s.icon}
        </button>

        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />

        <span
          className={`flex-1 text-sm cursor-pointer ${
            task.status === "done" ? "line-through text-white/30" : "text-white/80"
          }`}
          onClick={() => setExpanded((v) => !v)}
        >
          {task.type === "idea" && <span className="mr-1.5 opacity-60">💡</span>}
          {task.title}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.type === "idea" && (
            <button
              onClick={() => onConvert(task.id)}
              className="text-xs text-amber-400/70 hover:text-amber-400 px-2 py-0.5 rounded transition-colors"
              title="Convertir a task"
            >
              → task
            </button>
          )}
          <select
            value={task.priority}
            onChange={(e) => onUpdate(task.id, { priority: e.target.value as Priority })}
            className={`text-xs bg-transparent border-none focus:outline-none ${p.color} cursor-pointer`}
          >
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-white/20 hover:text-red-400 px-1 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-white/5 pt-2">
          {task.description && (
            <p className="text-xs text-white/40">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <p className="text-xs text-white/20 font-mono">
            {new Date(task.createdAt).toLocaleDateString("es-MX")}
            {task.completedAt &&
              ` · completado ${new Date(task.completedAt).toLocaleDateString("es-MX")}`}
          </p>
        </div>
      )}
    </div>
  );
}
