import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import QuickLogForm from "../components/QuickLogForm";
import PageHeader from "../components/ui/PageHeader";
import { api } from "../api";
import { useDashboardData } from "../hooks/useDashboardData";

export default function LogPage() {
  const { today, load } = useDashboardData();
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogSession(form) {
    await api.createSession(form);
    setMessage("Session logged. Your contribution graph has been updated.");
    await load();
  }

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Log Session"
        description="Record a focused block. Live preview shows points and heatmap level before you save."
      />

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-200">
          <CheckCircle2 size={20} className="shrink-0" />
          {message}
        </div>
      )}

      <QuickLogForm onSubmit={handleLogSession} todayScore={today?.total_score || 0} />
    </div>
  );
}
