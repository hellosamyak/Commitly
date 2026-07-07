export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="card group transition hover:border-brand-200/80 dark:hover:border-brand-800/60">
      {Icon ? <Icon className="text-brand-600" size={20} /> : null}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}
