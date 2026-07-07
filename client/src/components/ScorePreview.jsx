import { useEffect, useMemo, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { api } from "../api";
import { computeSessionScore, contributionLevel } from "../utils/scoring";

export default function ScorePreview({ form, todayScore = 0 }) {
  const [forecast, setForecast] = useState(null);

  const localScore = useMemo(() => computeSessionScore(form), [form]);

  useEffect(() => {
    if (!form.durationMinutes || localScore === 0) {
      setForecast(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await api.forecast({
          category: form.category,
          durationMinutes: form.durationMinutes,
          qualityRating: form.qualityRating,
          difficulty: form.difficulty,
          isPlanned: form.isPlanned,
          isMicroSession: form.isMicroSession
        });
        setForecast(data);
      } catch {
        setForecast(null);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form, localScore]);

  const projectedLevel = forecast?.projectedLevel ?? contributionLevel(todayScore + localScore);

  return (
    <div className="rounded-xl border border-dashed border-brand-300/70 bg-brand-50/50 p-4 dark:border-brand-800 dark:bg-brand-950/40">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-200">
        <Calculator size={16} />
        Live score preview
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <PreviewStat label="This session" value={localScore === 0 ? "—" : `+${localScore} pts`} />
        <PreviewStat
          label="Today after save"
          value={forecast ? `${forecast.projectedTotal} pts` : `${todayScore + localScore} pts`}
        />
        <PreviewStat label="Heatmap level" value={`L${projectedLevel}`} icon={TrendingUp} />
      </div>
      {localScore === 0 && form.durationMinutes < 10 && !form.isMicroSession ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Sessions under 10 min need &quot;micro session&quot; checked to count.
        </p>
      ) : null}
    </div>
  );
}

function PreviewStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg bg-white/80 px-3 py-2 dark:bg-slate-900/80">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 text-lg font-bold text-slate-900 dark:text-white">
        {Icon ? <Icon size={16} className="text-brand-600" /> : null}
        {value}
      </p>
    </div>
  );
}
