"use client";

import { useState } from "react";
import { useDevStore } from "./hooks/useDevStore";
import { useRoadmapStore } from "./components/roadmap/useRoadmapStore";
import { TaskBoard } from "./components/TaskBoard";
import { StickyNotes } from "./components/StickyNotes";
import { DecisionLog } from "./components/DecisionLog";
import { Roadmap } from "./components/roadmap/Roadmap";
import { AIPanel } from "./components/ai/AIPanel";
import { computeProgress } from "./components/roadmap/roadmaptypes";
import type { Roadmap as RoadmapType } from "./components/roadmap/roadmaptypes";

type Tab = "tasks" | "ideas" | "notes" | "decisions" | "roadmap" | "ai";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "tasks", label: "Tasks", icon: "✔" },
  { id: "ideas", label: "Ideas", icon: "💡" },
  { id: "notes", label: "Notas", icon: "📝" },
  { id: "decisions", label: "Decisiones", icon: "⚖" },
  { id: "roadmap", label: "Roadmap", icon: "🗺" },
  { id: "ai", label: "AI", icon: "✦" },
];

function roadmapProgress(r: RoadmapType): number {
  const statuses = r.items.flatMap((l1) =>
    l1.children.flatMap((l2) => l2.children.map((l3) => l3.status))
  );
  return computeProgress(statuses);
}

function RoadmapMiniBar({ roadmap }: { roadmap: RoadmapType }) {
  const pct = roadmapProgress(roadmap);
  const color =
    pct === 100
      ? "#34d399"
      : pct >= 60
      ? "#60a5fa"
      : pct >= 30
      ? "#fbbf24"
      : "rgba(255,255,255,0.15)";

  return (
    <div className="flex items-center gap-2 group" title={`${roadmap.name} · ${pct}%`}>
      <span className="text-xs text-white/25 font-mono hidden group-hover:inline transition-all">
        {roadmap.name}
      </span>
      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono" style={{ color, opacity: 0.7 }}>
        {pct}%
      </span>
    </div>
  );
}

export function DevPanel() {
  const [tab, setTab] = useState<Tab>("tasks");
  const store = useDevStore();
  const roadmapStore = useRoadmapStore();

  const tasks = store.tasks.filter((t) => t.type === "task");
  const ideas = store.tasks.filter((t) => t.type === "idea");
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const pendingIdeas = ideas.length;

  const roadmapsWithItems = roadmapStore.roadmaps.filter(
    (r) => r.items.length > 0
  );

  if (store.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans" style={{ backgroundColor: "#0a0a0a", colorScheme: "dark" }}>
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center gap-6">
        {/* Left: identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-mono text-white/60">DEV PANEL</span>
          <span className="text-xs text-white/20 font-mono">localhost</span>
        </div>

        {/* Center: roadmap bars */}
        {roadmapsWithItems.length > 0 && (
          <div className="flex items-center gap-4 flex-1">
            <div className="w-px h-4 bg-white/10 shrink-0" />
            {roadmapsWithItems.map((r) => (
              <RoadmapMiniBar key={r.id} roadmap={r} />
            ))}
          </div>
        )}

        {/* Right: stats + date */}
        <div className="flex items-center gap-4 text-xs text-white/30 font-mono ml-auto shrink-0">
          <span>{pendingTasks} tasks · {pendingIdeas} ideas</span>
          <span>
            {new Date().toLocaleDateString("es-MX", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/10 p-3 shrink-0">
          <nav className="space-y-1">
            {TABS.map((t) => {
              const badge =
                t.id === "tasks"
                  ? pendingTasks
                  : t.id === "ideas"
                  ? pendingIdeas
                  : t.id === "notes"
                  ? store.notes.length
                  : t.id === "decisions"
                  ? store.decisions.length
                  : t.id === "roadmap"
                  ? roadmapStore.roadmaps.length
                  : 0; // ai tab: no badge

              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    tab === t.id
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{t.icon}</span>
                    {t.label}
                  </span>
                  {badge > 0 && (
                    <span className="text-xs bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full font-mono">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick capture */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-xs text-white/20 px-3 mb-2 font-mono uppercase tracking-wider">
              Captura rápida
            </p>
            <QuickCapture onAdd={store.addTask} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "tasks" && (
            <TaskBoard
              tasks={store.tasks}
              onAdd={store.addTask}
              onUpdate={store.updateTask}
              onDelete={store.deleteTask}
              onConvert={store.convertIdeaToTask}
            />
          )}
          {tab === "ideas" && (
            <TaskBoard
              tasks={store.tasks}
              onAdd={(task) => store.addTask({ ...task, type: "idea" })}
              onUpdate={store.updateTask}
              onDelete={store.deleteTask}
              onConvert={store.convertIdeaToTask}
            />
          )}
          {tab === "notes" && (
            <StickyNotes
              notes={store.notes}
              onAdd={store.addNote}
              onUpdate={store.updateNote}
              onDelete={store.deleteNote}
            />
          )}
          {tab === "decisions" && (
            <DecisionLog
              decisions={store.decisions}
              onAdd={store.addDecision}
              onUpdate={store.updateDecision}
              onDelete={store.deleteDecision}
            />
          )}
          {tab === "roadmap" && <Roadmap store={roadmapStore} />}
          {tab === "ai" && (
            <AIPanel
              data={store.data}
              roadmaps={roadmapStore.roadmaps}
              onSetContext={store.setProjectContext}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function QuickCapture({
  onAdd,
}: {
  onAdd: (t: { title: string; type: "task" | "idea"; status: "pending"; priority: "medium"; tags: string[] }) => void;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const isIdea = trimmed.startsWith("!");
    const tags = trimmed.match(/#\w+/g)?.map((t) => t.toLowerCase()) ?? [];
    const title = trimmed.replace(/^!/, "").replace(/#\w+/g, "").trim();
    onAdd({ title, type: isIdea ? "idea" : "task", status: "pending", priority: "medium", tags });
    setValue("");
  };

  return (
    <div className="px-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="! idea, enter = task"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30"
      />
      <p className="text-xs text-white/15 mt-1.5 font-mono">! = idea · #tag</p>
    </div>
  );
}