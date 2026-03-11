//src/dev/types.ts

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in_progress" | "done" | "blocked";
export type ItemType = "task" | "idea";

export interface Tag {
  label: string;
  color?: string;
}

export interface Task {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  alternatives?: string;
  consequences?: string;
  tags: string[];
  createdAt: string;
}

export interface DevData {
  tasks: Task[];
  notes: StickyNote[];
  decisions: Decision[];
  projectContext?: string; // free-text AI context, max ~400 words
  lastUpdated: string;
}

export const STICKY_COLORS = [
  "#FEF08A", // yellow
  "#BBF7D0", // green
  "#BFDBFE", // blue
  "#FED7AA", // orange
  "#F9A8D4", // pink
  "#DDD6FE", // purple
];

export const TAG_COLORS: Record<string, string> = {
  "#backend": "#3B82F6",
  "#ui": "#8B5CF6",
  "#bug": "#EF4444",
  "#feature": "#10B981",
  "#refactor": "#F59E0B",
  "#docs": "#6B7280",
  "#perf": "#EC4899",
  "#api": "#06B6D4",
};