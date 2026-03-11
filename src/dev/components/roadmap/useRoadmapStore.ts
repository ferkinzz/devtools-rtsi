"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Roadmap,
  RoadmapL1,
  RoadmapL2,
  RoadmapL3,
  RoadmapStatus,
  RoadmapConfig,
} from "./roadmaptypes";
import { newItem } from "./roadmaptypes";

// We store roadmaps in a separate key inside .dev/data.json
// by extending the DevData shape — the API just persists whatever JSON we send.
// We use a dedicated endpoint key: /api/dev-data?key=roadmaps (same file, different slice)

async function fetchRoadmaps(): Promise<Roadmap[]> {
  const res = await fetch("/api/dev-data");
  if (!res.ok) return [];
  const data = await res.json();
  return data.roadmaps ?? [];
}

async function saveRoadmaps(roadmaps: Roadmap[]) {
  // Fetch current data first so we don't overwrite tasks/notes/decisions
  const res = await fetch("/api/dev-data");
  const current = res.ok ? await res.json() : {};
  await fetch("/api/dev-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...current,
      roadmaps,
      lastUpdated: new Date().toISOString(),
    }),
  });
}

export function useRoadmapStore() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmaps().then((r) => {
      setRoadmaps(r);
      if (r.length > 0) setActiveId(r[0].id);
      setLoading(false);
    });
  }, []);

  const persist = useCallback((updater: (prev: Roadmap[]) => Roadmap[]) => {
    setRoadmaps((prev) => {
      const next = updater(prev);
      saveRoadmaps(next);
      return next;
    });
  }, []);

  const active = roadmaps.find((r) => r.id === activeId) ?? null;

  // --- Roadmap CRUD ---
  const createRoadmap = useCallback(
    (name: string, config: RoadmapConfig) => {
      const now = new Date().toISOString();
      const r: Roadmap = {
        id: crypto.randomUUID(),
        name,
        config,
        items: [],
        createdAt: now,
        updatedAt: now,
      };
      persist((prev) => [...prev, r]);
      setActiveId(r.id);
    },
    [persist]
  );

  const deleteRoadmap = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((r) => r.id !== id));
      setActiveId((prev) => (prev === id ? null : prev));
    },
    [persist]
  );

  const updateRoadmapMeta = useCallback(
    (id: string, updates: Partial<Pick<Roadmap, "name" | "config">>) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, ...updates, updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    [persist]
  );

  // --- L1 (top level) ---
  const addL1 = useCallback(
    (roadmapId: string, title: string) => {
      const item: RoadmapL1 = { ...newItem(title), children: [] } as RoadmapL1;
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? { ...r, items: [...r.items, item], updatedAt: new Date().toISOString() }
            : r
        )
      );
    },
    [persist]
  );

  const updateL1 = useCallback(
    (roadmapId: string, l1Id: string, updates: Partial<RoadmapL1>) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id ? { ...l1, ...updates } : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  const deleteL1 = useCallback(
    (roadmapId: string, l1Id: string) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.filter((l1) => l1.id !== l1Id),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  // --- L2 ---
  const addL2 = useCallback(
    (roadmapId: string, l1Id: string, title: string) => {
      const item: RoadmapL2 = { ...newItem(title), children: [] } as RoadmapL2;
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? { ...l1, children: [...l1.children, item] }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  const updateL2 = useCallback(
    (
      roadmapId: string,
      l1Id: string,
      l2Id: string,
      updates: Partial<RoadmapL2>
    ) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? {
                        ...l1,
                        children: l1.children.map((l2) =>
                          l2.id === l2Id ? { ...l2, ...updates } : l2
                        ),
                      }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  const deleteL2 = useCallback(
    (roadmapId: string, l1Id: string, l2Id: string) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? {
                        ...l1,
                        children: l1.children.filter((l2) => l2.id !== l2Id),
                      }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  // --- L3 ---
  const addL3 = useCallback(
    (roadmapId: string, l1Id: string, l2Id: string, title: string) => {
      const item: RoadmapL3 = newItem(title) as RoadmapL3;
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? {
                        ...l1,
                        children: l1.children.map((l2) =>
                          l2.id === l2Id
                            ? { ...l2, children: [...l2.children, item] }
                            : l2
                        ),
                      }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  const updateL3 = useCallback(
    (
      roadmapId: string,
      l1Id: string,
      l2Id: string,
      l3Id: string,
      updates: Partial<RoadmapL3>
    ) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? {
                        ...l1,
                        children: l1.children.map((l2) =>
                          l2.id === l2Id
                            ? {
                                ...l2,
                                children: l2.children.map((l3) =>
                                  l3.id === l3Id ? { ...l3, ...updates } : l3
                                ),
                              }
                            : l2
                        ),
                      }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  const deleteL3 = useCallback(
    (roadmapId: string, l1Id: string, l2Id: string, l3Id: string) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === roadmapId
            ? {
                ...r,
                items: r.items.map((l1) =>
                  l1.id === l1Id
                    ? {
                        ...l1,
                        children: l1.children.map((l2) =>
                          l2.id === l2Id
                            ? {
                                ...l2,
                                children: l2.children.filter(
                                  (l3) => l3.id !== l3Id
                                ),
                              }
                            : l2
                        ),
                      }
                    : l1
                ),
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
    },
    [persist]
  );

  return {
    roadmaps,
    active,
    activeId,
    setActiveId,
    loading,
    createRoadmap,
    deleteRoadmap,
    updateRoadmapMeta,
    addL1,
    updateL1,
    deleteL1,
    addL2,
    updateL2,
    deleteL2,
    addL3,
    updateL3,
    deleteL3,
  };
}