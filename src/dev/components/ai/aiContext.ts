import type { DevData, Task } from "../../types";
import type { Roadmap } from "../roadmap/roadmaptypes";
import { computeProgress } from "../roadmap/roadmaptypes";

export type FocusMode = "general" | "blocked" | "roadmap" | "ideas" | "risks" | "notes";

// ─── 1. EXTRACTORES Y RENDERIZADORES ────────────────────────────────────────

function getDaysDiff(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

// NUEVO: Renderiza el contexto estratégico
function renderProjectContext(context?: string): string {
  if (!context || !context.trim()) {
    return `=== CONTEXTO ESTRATÉGICO ===
(No definido por el usuario).
*Asume que es un proyecto de software estándar. Prioriza funcionalidad y estabilidad.*`;
  }
  return `=== CONTEXTO ESTRATÉGICO (VISION) ===
"${context.trim()}"

INSTRUCCIÓN CLAVE: Evalúa todo el trabajo basándote en si nos acerca a esta visión. 
Si una tarea no aporta a este contexto, sugiérela como candidata a eliminar.`;
}

function renderRoadmapTree(roadmaps: Roadmap[]): string {
  if (!roadmaps.length) return "No hay roadmaps definidos.";

  return roadmaps.map((r) => {
    const activeItems = r.items.filter(i => i.status === "in_progress" || i.status === "blocked" || i.status === "at_risk");
    
    // Si no hay nada activo en nivel 1, mostramos todo para dar contexto
    const itemsToShow = activeItems.length > 0 ? activeItems : r.items;

    const l1Nodes = itemsToShow.map((l1) => {
      const l2Nodes = l1.children.map((l2) => {
        // Mostramos hijos si el padre está activo o el hijo tiene actividad
        const showL3 = l1.status === "in_progress" || l2.status === "in_progress" || l2.status === "blocked";
        
        const l3Nodes = showL3
          ? l2.children.map(l3 => {
              const icon = l3.status === "done" ? "✓" : l3.status === "in_progress" ? "▶" : l3.status === "blocked" ? "⛔" : "○";
              return `      ${icon} [${l3.status.toUpperCase()}] "${l3.title}"`;
            }).join("\n")
          : `      (Resumen: ${l2.children.filter(c=>c.status==='done').length}/${l2.children.length} completados)`;

        return `    ├── [${l2.title}] (${l2.status})\n${l3Nodes}`;
      }).join("\n");

      return `  ├── [Fase: ${l1.title}] (${l1.status})\n${l2Nodes}`;
    }).join("\n\n");

    return `ROADMAP: "${r.name}" (${computeProgress(r.items.flatMap(i=>i.children.flatMap(j=>j.children.map(k=>k.status))))}%)\n${l1Nodes}`;
  }).join("\n\n");
}

function renderTasksList(tasks: Task[]): string {
  if (!tasks.length) return "Tablero vacío.";
  
  const inProgress = tasks.filter(t => t.status === "in_progress");
  const blocked = tasks.filter(t => t.status === "blocked");
  const pending = tasks.filter(t => t.status === "pending");

  let out = "";
  if (inProgress.length) {
    out += `\n🚀 EN PROGRESO:\n${inProgress.map(t => `  - "${t.title}" [${t.priority}] (hace ${getDaysDiff(t.updatedAt)}d)`).join("\n")}`;
  }
  if (blocked.length) {
    out += `\n⛔ BLOQUEADAS:\n${blocked.map(t => `  - "${t.title}"`).join("\n")}`;
  }
  if (pending.length) {
    out += `\n📋 PENDIENTES (Siguientes):\n${pending.slice(0, 5).map(t => `  - "${t.title}" [${t.priority}]`).join("\n")}`;
  }
  return out;
}

// ─── 2. CONSTRUCTOR MAESTRO DEL PROMPT ──────────────────────────────────────

const SYSTEM_PERSONA = `
Eres un Technical Project Manager Senior y Agile Coach.
Tu análisis debe ser CRÍTICO y DIRECTO.
`;

function buildFullPrompt(data: DevData, roadmaps: Roadmap[], instructions: string): string {
  return `${SYSTEM_PERSONA}

${renderProjectContext(data.projectContext)}

${instructions}

=== DATOS REALES ===

${renderRoadmapTree(roadmaps)}

=== ESTADO DEL TABLERO ===
${renderTasksList(data.tasks || [])}

=== NOTAS RECIENTES ===
${(data.notes || []).slice(0, 3).map(n => `- "${n.content}"`).join("\n")}
`;
}

// ─── 3. MODOS CON INTELIGENCIA CONTEXTUAL ───────────────────────────────────

function promptGeneral(data: DevData, roadmaps: Roadmap[]): string {
  return buildFullPrompt(data, roadmaps, `
OBJETIVO: Alineación con la Visión
1. Lee el "Contexto Estratégico". ¿Las tareas "En Progreso" ayudan DIRECTAMENTE a esa visión hoy?
2. Si estamos perdiendo el tiempo en tareas secundarias (fuera del contexto principal), señálalo agresivamente.
3. Diagnostica la velocidad actual del roadmap.
`);
}

function promptRoadmap(data: DevData, roadmaps: Roadmap[]): string {
  return buildFullPrompt(data, roadmaps, `
OBJETIVO: Priorización Estratégica
1. Basado en la Visión del Proyecto, ¿el orden de los items en el Roadmap es lógico?
2. ¿Falta alguna fase crítica en el Roadmap para cumplir el objetivo del "Project Context"?
3. Identifica cuellos de botella entre Roadmap y Tablero de tareas.
`);
}

function promptIdeas(data: DevData, roadmaps: Roadmap[]): string {
  const ideas = data.tasks?.filter(t => t.type === "idea") || [];
  const ideasText = ideas.map(i => `- "${i.title}"`).join("\n");

  return buildFullPrompt(data, roadmaps, `
OBJETIVO: Filtro de Ideas
Aquí están las ideas en borrador:
${ideasText}

1. RECHAZAR: ¿Qué ideas NO encajan con el "Contexto Estratégico" y deberían borrarse?
2. ACEPTAR: ¿Qué idea es crucial para la fase actual del roadmap y debería pasarse a tarea hoy?
`);
}

// ─── PUBLIC API ─────────────────────────────────────────────────────────────

export function buildPrompt(data: DevData, roadmaps: Roadmap[], mode: FocusMode): string {
  switch (mode) {
    case "roadmap": return promptRoadmap(data, roadmaps);
    case "ideas":   return promptIdeas(data, roadmaps);
    case "general": 
    case "blocked":
    case "risks":
    case "notes":   
    default:        return promptGeneral(data, roadmaps);
  }
}

export function buildContextPreview(data: DevData, roadmaps: Roadmap[], mode: FocusMode): string {
  return buildPrompt(data, roadmaps, mode);
}