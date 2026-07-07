import { useEffect, useState } from "react";
import SessionHistory from "../components/SessionHistory";
import PageHeader from "../components/ui/PageHeader";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { api } from "../api";
import { useDashboardData } from "../hooks/useDashboardData";

export default function HistoryPage() {
  const { sessions, loading, error, load } = useDashboardData();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(id, payload) {
    await api.updateSession(id, payload);
    setNotice("Session updated. Scores recalculated.");
    await load();
  }

  async function handleDelete(id) {
    await api.deleteSession(id);
    setNotice("Session deleted. Scores recalculated.");
    await load();
  }

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader title="History" description="Review, edit, or delete sessions. Changes update your heatmap automatically." />

      {notice ? (
        <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-200">
          {notice}
        </p>
      ) : null}

      {loading ? <LoadingSpinner label="Loading sessions..." /> : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </p>
      ) : null}
      {!loading && !error ? (
        <SessionHistory sessions={sessions} onUpdate={handleUpdate} onDelete={handleDelete} />
      ) : null}
    </div>
  );
}
