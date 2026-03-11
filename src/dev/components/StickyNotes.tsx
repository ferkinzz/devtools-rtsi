"use client";

import { useState } from "react";
import type { StickyNote } from "../types";
import { STICKY_COLORS } from "../types";

interface Props {
  notes: StickyNote[];
  onAdd: (note: Omit<StickyNote, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, updates: Partial<StickyNote>) => void;
  onDelete: (id: string) => void;
}

function NoteCard({
  note,
  onUpdate,
  onDelete,
}: {
  note: StickyNote;
  onUpdate: (id: string, u: Partial<StickyNote>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.content);

  const save = () => {
    onUpdate(note.id, { content: draft });
    setEditing(false);
  };

  return (
    <div
      className="group relative rounded-xl p-4 min-h-[120px] flex flex-col justify-between shadow-lg"
      style={{ backgroundColor: note.color }}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onUpdate(note.id, { pinned: !note.pinned })}
          className="text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 transition-colors"
          title={note.pinned ? "Desfijar" : "Fijar"}
        >
          {note.pinned ? "📌" : "📍"}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 transition-colors text-black/30 hover:text-black/60"
        >
          ✕
        </button>
      </div>

      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(note.content);
              setEditing(false);
            }
          }}
          className="flex-1 bg-transparent resize-none text-sm text-black/80 focus:outline-none w-full pr-10"
          rows={4}
        />
      ) : (
        <p
          className="flex-1 text-sm text-black/70 cursor-text whitespace-pre-wrap pr-10"
          onClick={() => setEditing(true)}
        >
          {note.content || (
            <span className="italic text-black/30">Click para editar...</span>
          )}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
        <div className="flex gap-1">
          {STICKY_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onUpdate(note.id, { color: c })}
              className="w-3 h-3 rounded-full border-2 transition-transform hover:scale-125"
              style={{
                backgroundColor: c,
                borderColor: note.color === c ? "rgba(0,0,0,0.4)" : "transparent",
              }}
            />
          ))}
        </div>
        <span className="text-xs text-black/30 font-mono">
          {new Date(note.updatedAt).toLocaleDateString("es-MX")}
        </span>
      </div>
    </div>
  );
}

export function StickyNotes({ notes, onAdd, onUpdate, onDelete }: Props) {
  const pinned = notes.filter((n) => n.pinned);
  const rest = notes.filter((n) => !n.pinned);
  const sorted = [...pinned, ...rest];

  const addNote = () => {
    const color = STICKY_COLORS[notes.length % STICKY_COLORS.length];
    onAdd({ content: "", color, pinned: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30 font-mono">{notes.length} notas</span>
        <button
          onClick={addNote}
          className="px-3 py-1.5 text-xs bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          + Nota
        </button>
      </div>

      {notes.length === 0 && (
        <p className="text-white/20 text-sm text-center py-8">Sin notas</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {sorted.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
