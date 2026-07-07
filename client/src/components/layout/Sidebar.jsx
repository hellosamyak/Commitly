import { NavLink } from "react-router-dom";
import { BarChart3, BookOpen, History, LayoutDashboard, PenLine, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/log", label: "Log Session", icon: PenLine },
  { to: "/history", label: "History", icon: History },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/about", label: "About", icon: BookOpen }
];

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-72 shrink-0 rounded-lg border border-slate-200/80 bg-white/85 p-3 shadow-card backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 lg:block">
      <div className="mb-4 rounded-lg border border-brand-200/70 bg-gradient-to-br from-brand-50 to-white p-3 dark:border-brand-900/60 dark:from-brand-950/40 dark:to-slate-900">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-lg border border-white shadow-sm dark:border-slate-800"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-sm shadow-brand-700/20">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {user.displayName || "Workspace"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigate</p>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link group ${isActive ? "nav-link-active" : ""}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-white group-hover:text-brand-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-900 dark:group-hover:text-brand-300">
              <Icon size={17} />
            </span>
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
          <Sparkles size={14} />
          Focus cue
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
          Keep today moving with one clean log at a time.
        </p>
      </div>
    </aside>
  );
}
