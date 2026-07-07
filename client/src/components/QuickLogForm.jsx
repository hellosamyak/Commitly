import { useState } from "react";
import { PenLine } from "lucide-react";
import QuickLogTemplates from "./QuickLogTemplates";
import ScorePreview from "./ScorePreview";

const DEFAULT_FORM = {
  category: "focus",
  durationMinutes: 25,
  qualityRating: 3,
  difficulty: "medium",
  isPlanned: false,
  isMicroSession: false,
  notes: ""
};

const fieldClass = "input-field";

export default function QuickLogForm({ onSubmit, todayScore = 0 }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      setForm(DEFAULT_FORM);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <PenLine size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold">Session Details</h2>
      </div>

      <ScorePreview form={form} todayScore={todayScore} />

      <div className="mt-4">
        <QuickLogTemplates onApply={(patch) => setForm((prev) => ({ ...prev, ...patch }))} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Category
          <select className={fieldClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
            <option value="study">Study</option>
            <option value="focus">Focus</option>
            <option value="reading">Reading</option>
            <option value="work">Work</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Duration (minutes)
          <input
            className={fieldClass}
            type="number"
            min={1}
            value={form.durationMinutes}
            onChange={(e) => update("durationMinutes", Number(e.target.value))}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Quality (1-5)
          <input
            className={fieldClass}
            type="number"
            min={1}
            max={5}
            value={form.qualityRating}
            onChange={(e) => update("qualityRating", Number(e.target.value))}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Difficulty
          <select className={fieldClass} value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={form.isPlanned} onChange={(e) => update("isPlanned", e.target.checked)} />
          Planned session
        </label>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isMicroSession}
            onChange={(e) => update("isMicroSession", e.target.checked)}
          />
          Intentional micro session (&lt;10 min)
        </label>

        <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
          Notes
          <textarea className={fieldClass} value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} />
        </label>

        <button type="submit" disabled={saving} className="btn-primary sm:col-span-2">
          {saving ? "Saving..." : "Log Session"}
        </button>
      </form>
    </section>
  );
}
