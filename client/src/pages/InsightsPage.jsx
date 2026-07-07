import { useEffect, useState } from "react";
import CategoryChart from "../components/CategoryChart";
import InsightsPanel from "../components/InsightsPanel";
import PageHeader from "../components/ui/PageHeader";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { api } from "../api";
import { useDashboardData } from "../hooks/useDashboardData";

export default function InsightsPage() {
  const { insights, loading, error, load } = useDashboardData();
  const [breakdown, setBreakdown] = useState([]);
  const [breakdownLoading, setBreakdownLoading] = useState(true);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      setBreakdownLoading(true);
      try {
        const data = await api.getCategoryBreakdown(7);
        setBreakdown(data);
      } catch {
        setBreakdown([]);
      } finally {
        setBreakdownLoading(false);
      }
    })();
  }, [insights]);

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Insights"
        description="Weekly consistency, category mix, and momentum — built for honest habit tracking."
      />

      {loading ? <LoadingSpinner label="Loading insights..." /> : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <InsightsPanel insights={insights} />
          {breakdownLoading ? (
            <div className="card text-sm text-slate-500">Loading category breakdown...</div>
          ) : (
            <CategoryChart breakdown={breakdown} />
          )}
        </div>
      ) : null}
    </div>
  );
}
