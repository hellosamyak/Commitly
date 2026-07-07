import { Grid3x3 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LEVEL_COLORS_LIGHT = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const LEVEL_COLORS_DARK = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export default function HeatmapGrid({ days, onDayClick }) {
  const { theme } = useTheme();
  const palette = theme === "dark" ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Grid3x3 size={18} className="text-brand-600" />
          <h2 className="text-lg font-semibold">Contribution Heatmap</h2>
        </div>
        {onDayClick ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">Click a day for details</p>
        ) : null}
      </div>

      {days.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No contributions yet. Log your first productive session.</p>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-flow-col grid-rows-7 gap-1">
            {days.map((day) => (
              <button
                key={day.score_date}
                type="button"
                onClick={() => onDayClick?.(day)}
                className={`h-3 w-3 rounded-sm transition ${
                  onDayClick ? "cursor-pointer hover:ring-2 hover:ring-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500" : ""
                }`}
                title={`${day.score_date}: ${day.total_score ?? 0} points (Level ${day.contribution_level ?? 0})`}
                style={{ backgroundColor: palette[day.contribution_level || 0] }}
                aria-label={`${day.score_date}, ${day.total_score} points`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span>Less</span>
        {palette.map((color) => (
          <span key={color} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
