import { useEffect, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { api } from "../api";
import { getCategoryStyle } from "../utils/categories";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function DayDetailModal({ day, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!day) return;
    (async () => {
      setLoading(true);
      try {
        const rows = await api.getSessions(day.score_date);
        setSessions(rows);
      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [day]);

  if (!day) return null;

  const dateLabel = new Date(day.score_date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center" onClick={onClose}>
      <div
        className="card max-h-[85vh] w-full max-w-lg overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Calendar size={14} /> Day detail
            </p>
            <h3 className="mt-1 text-lg font-bold">{dateLabel}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {day.total_score ?? 0} points · Level {day.contribution_level ?? 0}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost rounded-lg p-2" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading sessions..." />
        ) : sessions.length === 0 ? (
          <p className="text-sm text-slate-500">No sessions logged this day.</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => {
              const style = getCategoryStyle(s.category);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                      {style.label}
                    </span>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {s.duration_minutes} min · Q{s.quality_rating} · {s.difficulty}
                      {s.is_planned ? " · planned" : ""}
                    </p>
                    {s.notes ? <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{s.notes}</p> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
