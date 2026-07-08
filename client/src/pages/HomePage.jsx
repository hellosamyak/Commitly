import { Link, Navigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, BarChart3, Flame, Grid3x3, Sparkles, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getGoogleAuthUrl } from "../api";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LEVEL_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

function MockHeatmap() {
  const cells = Array.from({ length: 84 }, (_, i) => [0, 1, 2, 3, 4, 2, 1][(i * 3 + 2) % 5]);
  return (
    <div className="inline-grid grid-flow-col grid-rows-7 gap-1 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
      {cells.map((level, i) => (
        <span key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: LEVEL_COLORS[level] }} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("authError");

  if (loading) return <LoadingSpinner label="Loading..." />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="animate-fade-in space-y-10">
      <section className="card relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/80 dark:text-brand-300">
              <Sparkles size={14} /> GitHub-style productivity tracking
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Commit to focus.
              <span className="block text-brand-600 dark:text-brand-400">See momentum grow.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Log study, focus, reading, and work sessions. Commitly turns your effort into a contribution heatmap with
              transparent hybrid scoring you can trust.
            </p>

            {authError === "google" && (
              <div className="mt-5 flex max-w-xl items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                <p>
                  Google sign-in is not available right now. The OAuth client needs to be recreated and connected to
                  this deployment.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={getGoogleAuthUrl()} className="btn-primary px-5 py-3">
                Get started with Google <ArrowRight size={16} />
              </a>
              <Link to="/about" className="btn-ghost border border-slate-200 dark:border-slate-700">
                How scoring works
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <MockHeatmap />
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 lg:text-right">
              Preview: your consistency, visualized day by day
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={Grid3x3} title="Contribution heatmap" text="Visualize consistency like GitHub commits." />
        <FeatureCard icon={Flame} title="Hybrid scoring" text="Time, quality, difficulty, and planning shape your score." />
        <FeatureCard icon={BarChart3} title="Weekly insights" text="Track active days, top categories, and trends." />
        <FeatureCard icon={Target} title="Contribution forecast" text="See how your next session affects today's level." />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="card transition hover:-translate-y-0.5 hover:shadow-lg">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/50">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
    </article>
  );
}

