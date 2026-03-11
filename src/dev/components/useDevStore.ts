"use client";

import { useState, useEffect, useCallback } from "react";
import type { DevData, Task, StickyNote, Decision } from "../types";

const EMPTY_DATA: DevData = {
  tasks: [],
  notes: [],
  decisions: [],
  lastUpdated: new Date().toISOString(),
};

async function fetchData(): Promise<DevData> {
  const res = await fetch("/api/dev-data");
  if (!res.ok) return EMPTY_DATA;
  return res.json();
}

async function saveData(data: DevData): Promise<void> {
  await fetch("/api/dev-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function useDevStore() {
  const [data, setData] = useState<DevData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(
    (updater: (prev: DevData) => DevData) => {
      setData((prev) => {
        const next = updater(prev);
        next.lastUpdated = new Date().toISOString();
        saveData(next);
        return next;
      });
    },
    []
  );

  // --- Tasks ---
  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      persist((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    },
    [persist]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      persist((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        ),
      }));
    },
    [persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
      }));
    },
    [persist]
  );

  const convertIdeaToTask = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                type: "task" as const,
                status: "pending" as const,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }));
    },
    [persist]
  );

  // --- Notes ---
  const addNote = useCallback(
    (note: Omit<StickyNote, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newNote: StickyNote = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      persist((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));
    },
    [persist]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<StickyNote>) => {
      persist((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === id
            ? { ...n, ...updates, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    },
    [persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== id),
      }));
    },
    [persist]
  );

  // --- Decisions ---
  const addDecision = useCallback(
    (decision: Omit<Decision, "id" | "createdAt">) => {
      const newDecision: Decision = {
        ...decision,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist((prev) => ({
        ...prev,
        decisions: [newDecision, ...prev.decisions],
      }));
    },
    [persist]
  );

  const updateDecision = useCallback(
    (id: string, updates: Partial<Decision>) => {
      persist((prev) => ({
        ...prev,
        decisions: prev.decisions.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      }));
    },
    [persist]
  );

  const deleteDecision = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        decisions: prev.decisions.filter((d) => d.id !== id),
      }));
    },
    [persist]
  );

  const setProjectContext = useCallback(
    (context: string) => {
      persist((prev) => ({ ...prev, projectContext: context }));
    },
    [persist]
  );

  return {
    data,
    loading,
    tasks: data.tasks,
    notes: data.notes,
    decisions: data.decisions,
    projectContext: data.projectContext ?? "",
    addTask,
    updateTask,
    deleteTask,
    convertIdeaToTask,
    addNote,
    updateNote,
    deleteNote,
    addDecision,
    updateDecision,
    deleteDecision,
    setProjectContext,
  };
}