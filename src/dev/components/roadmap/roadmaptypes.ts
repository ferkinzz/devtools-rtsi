//src/dev/components/roadmap/roadmaptypes.ts
export type RoadmapStatus =
  | "not_started"
  | "in_progress"
  | "done"
  | "at_risk"
  | "blocked";

export interface RoadmapConfig {
  levelNames: [string, string, string]; // e.g. ["Fase", "Semana", "Día"]
}

export interface RoadmapItem {
  id: string;
  title: string;
  summary?: string;
  status: RoadmapStatus;
  startDate?: string;
  endDate?: string;
  closingNote?: string;
  createdAt: string;
  // title/summary lock after 24h from createdAt
}

export type RoadmapL3 = RoadmapItem; // leaf node — no children

export interface RoadmapL2 extends RoadmapItem {
  children: RoadmapL3[];
}

export interface RoadmapL1 extends RoadmapItem {
  children: RoadmapL2[];
}

export interface Roadmap {
  id: string;
  name: string;
  config: RoadmapConfig;
  items: RoadmapL1[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_META: Record<
  RoadmapStatus,
  { label: string; icon: string; color: string; bg: string }
> = {
  not_started: {
    label: "Sin iniciar",
    icon: "○",
    color: "text-white/30",
    bg: "bg-white/5",
  },
  in_progress: {
    label: "En progreso",
    icon: "◐",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  done: {
    label: "Completado",
    icon: "●",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  at_risk: {
    label: "En riesgo",
    icon: "◈",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  blocked: {
    label: "Bloqueado",
    icon: "⊘",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
};

export const DEFAULT_LEVEL_NAMES: [string, string, string] = [
  "Fase",
  "Semana",
  "Día",
];

export const LEVEL_NAME_PRESETS: [string, string, string][] = [
  ["Fase", "Semana", "Día"],
  ["Trimestre", "Mes", "Semana"],
  ["Épica", "Sprint", "Tarea"],
  ["Release", "Milestone", "Ticket"],
];

// --- helpers ---

export function computeProgress(statuses: RoadmapStatus[]): number {
  if (statuses.length === 0) return 0;
  const done = statuses.filter((s) => s === "done").length;
  return Math.round((done / statuses.length) * 100);
}

export function l3Progress(item: RoadmapL2): number {
  return computeProgress(item.children.map((c) => c.status));
}

export function l2Progress(item: RoadmapL1): number {
  const all = item.children.flatMap((l2) => l2.children.map((l3) => l3.status));
  if (all.length === 0) return computeProgress([item.children.map((c) => c.status)].flat());
  return computeProgress(all);
}

export function isLocked(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > 24 * 60 * 60 * 1000;
}

export function hoursUntilLock(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const lockAt = created + 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((lockAt - Date.now()) / (60 * 60 * 1000)));
}

export function newItem(title: string): Omit<RoadmapItem, "children"> {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    status: "not_started",
    createdAt: now,
  };
}