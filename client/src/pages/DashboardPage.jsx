import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Flame, PenLine, Target } from "lucide-react";
import DayDetailModal from "../components/DayDetailModal";
import HeatmapGrid from "../components/HeatmapGrid";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardPage() {
  const { heatmap, today, loading, error, load } = useDashboardData();
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    load();
  }, [load]);

  const activeDays = useMemo(() => {
    if (!heatmap.length) return 0;
    return heatmap.filter((d) => d.total_score > 0).length;
  }, [heatmap]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
        {error}
      </p>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your productivity at a glance — today's score, streak window, and contribution heatmap."
        action={
          <Link to="/log" className="btn-primary">
            <PenLine size={16} /> Log session
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={today?.total_score || 0} hint="points earned" icon={Target} />
        <StatCard label="Active days" value={activeDays} hint="in current heatmap view" icon={Flame} />
        <StatCard label="Heatmap level" value={`L${today?.contribution_level || 0}`} hint="today's intensity" icon={CalendarDays} />
      </div>

      <HeatmapGrid days={heatmap} onDayClick={setSelectedDay} />

      <div className="card flex flex-col gap-3 border-brand-200/60 bg-gradient-to-r from-brand-50/80 to-transparent sm:flex-row sm:items-center sm:justify-between dark:border-brand-900/50 dark:from-brand-950/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Tap any square on the heatmap to see sessions for that day.
        </p>
        <Link to="/log" className="btn-primary shrink-0">
          <PenLine size={16} /> Quick log
        </Link>
      </div>

      <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
    </div>
  );
}
