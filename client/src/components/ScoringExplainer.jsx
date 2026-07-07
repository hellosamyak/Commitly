import { Info } from "lucide-react";

const rules = [
  "Base: 1 point for every 20 productive minutes.",
  "Quality multiplier: 0.7 to 1.3 based on rating 1 to 5.",
  "Difficulty multiplier: easy 0.95, medium 1.0, hard 1.1.",
  "Planned session bonus: +0.5 before rounding.",
  "Sessions under 10 min count only if marked as micro-session.",
  "Diminishing returns begin after the 3rd session in a day."
];

export default function ScoringExplainer() {
  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <Info size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold">How Scoring Works</h2>
      </div>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {rule}
          </li>
        ))}
      </ul>
    </section>
  );
}
