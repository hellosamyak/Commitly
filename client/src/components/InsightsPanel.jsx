import { BarChart3, Calendar, Target, TrendingUp } from "lucide-react";

export default function InsightsPanel({ insights, forecast }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold">Weekly Insights</h2>
      </div>

      {!insights ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No weekly insights yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat icon={TrendingUp} label="Weekly Score" value={insights.totalScore} />
          <Stat icon={Calendar} label="Active Days" value={`${insights.activeDays}/7`} />
          <Stat icon={Target} label="Consistency" value={`${insights.consistencyScore}%`} />
          <Stat icon={BarChart3} label="Top Category" value={insights.topCategory || "N/A"} />
        </div>
      )}

      {forecast && (
        <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Forecast: this session can raise today to <strong>Level {forecast.projectedLevel}</strong> with{" "}
          <strong>{forecast.projectedTotal}</strong> total points.
        </p>
      )}
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon size={16} />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
