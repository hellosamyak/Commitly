import { useState } from "react";
import { Pencil, X } from "lucide-react";

const fieldClass = "input-field";

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SessionEditModal({ session, onClose, onSave }) {
  const [form, setForm] = useState({
    category: session.category,
    durationMinutes: session.duration_minutes,
    qualityRating: session.quality_rating,
    difficulty: session.difficulty,
    isPlanned: session.is_planned,
    isMicroSession: session.is_micro_session,
    notes: session.notes || "",
    startedAt: toDatetimeLocal(session.started_at)
  });
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(session.id, {
        ...form,
        startedAt: form.startedAt ? new Date(form.startedAt).toISOString() : session.started_at
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="card w-full max-w-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Pencil size={18} className="text-brand-600" /> Edit session
          </h3>
          <button type="button" onClick={onClose} className="btn-ghost p-2">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium sm:col-span-2">
            Started at
            <input
              className={fieldClass}
              type="datetime-local"
              value={form.startedAt}
              onChange={(e) => update("startedAt", e.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Category
            <select className={fieldClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="study">Study</option>
              <option value="focus">Focus</option>
              <option value="reading">Reading</option>
              <option value="work">Work</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Minutes
            <input
              className={fieldClass}
              type="number"
              min={1}
              value={form.durationMinutes}
              onChange={(e) => update("durationMinutes", Number(e.target.value))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Quality
            <input
              className={fieldClass}
              type="number"
              min={1}
              max={5}
              value={form.qualityRating}
              onChange={(e) => update("qualityRating", Number(e.target.value))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Difficulty
            <select className={fieldClass} value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.isPlanned} onChange={(e) => update("isPlanned", e.target.checked)} />
            Planned
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isMicroSession}
              onChange={(e) => update("isMicroSession", e.target.checked)}
            />
            Micro session
          </label>
          <label className="grid gap-1 text-sm font-medium sm:col-span-2">
            Notes
            <textarea className={fieldClass} rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>
          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
