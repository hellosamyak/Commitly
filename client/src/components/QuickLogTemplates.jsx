import { BookOpen, Brain, Briefcase, Timer } from "lucide-react";

const templates = [
  { label: "25m Focus", icon: Timer, patch: { category: "focus", durationMinutes: 25, qualityRating: 3 } },
  { label: "45m Study", icon: Brain, patch: { category: "study", durationMinutes: 45, qualityRating: 4 } },
  { label: "30m Reading", icon: BookOpen, patch: { category: "reading", durationMinutes: 30, qualityRating: 3 } },
  { label: "60m Work", icon: Briefcase, patch: { category: "work", durationMinutes: 60, qualityRating: 4, isPlanned: true } }
];

export default function QuickLogTemplates({ onApply }) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map(({ label, icon: Icon, patch }) => (
        <button
          key={label}
          type="button"
          onClick={() => onApply(patch)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-700 dark:hover:bg-brand-950/50 dark:hover:text-brand-300"
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
