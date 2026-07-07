const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body.errors?.join?.(" ") || body.error || "Request failed";
    throw new Error(detail);
  }
  return response.json();
}

export const api = {
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" });
    if (response.status === 401) return { authenticated: false };
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Request failed");
    }
    return response.json();
  },
  logout: () => request("/auth/logout", { method: "POST" }),
  getHeatmap: () => request("/scores/heatmap"),
  getToday: () => request("/scores/today"),
  getSessions: (date) => request(date ? `/sessions?date=${date}` : "/sessions"),
  getWeeklyInsights: () => request("/insights/weekly"),
  getCategoryBreakdown: (days = 7) => request(`/insights/categories?days=${days}`),
  previewSession: (payload) => request("/sessions/preview", { method: "POST", body: JSON.stringify(payload) }),
  forecast: (payload) => request("/insights/forecast", { method: "POST", body: JSON.stringify(payload) }),
  createSession: (payload) => request("/sessions", { method: "POST", body: JSON.stringify(payload) }),
  updateSession: (id, payload) => request(`/sessions/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteSession: (id) => request(`/sessions/${id}`, { method: "DELETE" })
};

export function getGoogleAuthUrl() {
  return `${API_BASE_URL}/auth/google`;
}
