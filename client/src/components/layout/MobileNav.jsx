import { NavLink } from "react-router-dom";
import { BarChart3, History, LayoutDashboard, PenLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/log", icon: PenLine, label: "Log" },
  { to: "/history", icon: History, label: "History" },
  { to: "/insights", icon: BarChart3, label: "Insights" }
];

export default function MobileNav() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
