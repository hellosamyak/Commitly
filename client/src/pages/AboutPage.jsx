import { GitBranch, ShieldCheck, Sparkles } from "lucide-react";
import ScoringExplainer from "../components/ScoringExplainer";
import PageHeader from "../components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="About Commitly"
        description="A transparent productivity tracker inspired by contribution graphs — consistency over perfection."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <div className="flex items-start gap-3">
            <ShieldCheck className="shrink-0 text-brand-600" size={22} />
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Our philosophy</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Commitly rewards consistency, not perfection. Scoring combines time, self-rated quality, difficulty,
                and planning intent — with guardrails to reduce inflated logging.
              </p>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="flex items-start gap-3">
            <GitBranch className="shrink-0 text-brand-600" size={22} />
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">GitHub-inspired UX</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Your daily effort maps to contribution levels (0–4), making progress visible at a glance — the same
                motivational pattern developers know from commit graphs.
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="card flex items-start gap-3 bg-brand-50/50 dark:bg-brand-950/30">
        <Sparkles className="shrink-0 text-brand-600" size={20} />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Coming soon: recovery streaks, intent vs outcome tracking, and category identity modes for exam seasons.
        </p>
      </div>

      <ScoringExplainer />
    </div>
  );
}
