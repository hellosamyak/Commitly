import { useCallback, useState } from "react";
import { api } from "../api";

export function useDashboardData() {
  const [heatmap, setHeatmap] = useState([]);
  const [today, setToday] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [heatmapData, todayData, sessionData, insightData] = await Promise.all([
        api.getHeatmap(),
        api.getToday(),
        api.getSessions(),
        api.getWeeklyInsights()
      ]);
      setHeatmap(heatmapData);
      setToday(todayData);
      setSessions(sessionData);
      setInsights(insightData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  return { heatmap, today, sessions, insights, loading, error, load, setInsights };
}
