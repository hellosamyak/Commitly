import { PieChart } from "lucide-react";
import { getCategoryStyle } from "../utils/categories";

export default function CategoryChart({ breakdown = [] }) {
  const totalMinutes = breakdown.reduce((sum, row) => sum + row.minutes, 0);

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <PieChart size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold">Category mix (7 days)</h2>
      </div>

      {breakdown.length === 0 || totalMinutes === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Log sessions to see your category breakdown.</p>
      ) : (
        <div className="space-y-4">
          {breakdown.map((row) => {
            const style = getCategoryStyle(row.category);
            const pct = Math.round((row.minutes / totalMinutes) * 100);
            return (
              <div key={row.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium capitalize">{style.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {row.minutes}m · {row.count} sessions · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${style.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
