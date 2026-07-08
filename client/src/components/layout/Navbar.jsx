import { Link, NavLink, useLocation } from "react-router-dom";
import { Grid3x3, LogOut, Moon, Plus, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getGoogleAuthUrl } from "../../api";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

const appLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/log", label: "Log" },
  { to: "/history", label: "History" },
  { to: "/insights", label: "Insights" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentSection =
    appLinks.find((link) => location.pathname.startsWith(link.to))?.label || "Workspace";

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-emerald-700 text-white shadow-md shadow-brand-600/25">
            <Grid3x3 size={18} />
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-tight">Commitly</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Productivity graph
            </p>
          </div>
        </Link>

        {user ? (
          <div className="hidden min-w-0 flex-1 items-center md:flex">
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
              <span className="truncate font-medium">{currentSection}</span>
            </div>
          </div>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">
            {publicLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost h-10 w-10 px-0"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/log" className="btn-primary hidden sm:inline-flex">
                <Plus size={16} />
                New log
              </Link>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-slate-200 dark:border-slate-700"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                  {(user.displayName || user.email || "?")[0].toUpperCase()}
                </span>
              )}
              <div className="hidden lg:block">
                <p className="max-w-[140px] truncate text-sm font-medium">
                  {user.displayName || "User"}
                </p>
                <p className="max-w-[140px] truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-ghost h-10 w-10 px-0 sm:w-auto sm:px-3"
                title="Sign out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <a href={getGoogleAuthUrl()} className="btn-primary text-sm">
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

