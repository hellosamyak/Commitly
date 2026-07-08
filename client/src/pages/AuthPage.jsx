import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Lock, Mail, User } from "lucide-react";
import { api, getGoogleAuthUrl } from "../api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function AuthPage() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (isSignup ? "Create your account" : "Welcome back"), [isSignup]);

  if (loading) return <LoadingSpinner label="Loading..." />;
  if (user) return <Navigate to="/dashboard" replace />;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function switchMode(nextMode) {
    setError("");
    setSearchParams({ mode: nextMode });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = isSignup ? await api.signup(form) : await api.login(form);
      setUser(result.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 py-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <section className="space-y-5">
        <p className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:border-brand-900 dark:bg-brand-950/70 dark:text-brand-300">
          Commitly account
        </p>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Keep your productivity graph under your own login.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Sign up with email and password, then log focus sessions, build streaks, and keep Google sign-in as an optional shortcut later.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-sm font-semibold dark:bg-slate-900">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded-md px-3 py-2 transition ${!isSignup ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300" : "text-slate-600 dark:text-slate-300"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 transition ${isSignup ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300" : "text-slate-600 dark:text-slate-300"}`}
          >
            Sign up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {isSignup ? "Start tracking your sessions in a minute." : "Use the email and password you signed up with."}
        </p>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
              <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                <User size={18} className="text-slate-400" />
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={updateField}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </span>
            </label>
          )}

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
              <Mail size={18} className="text-slate-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </span>
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
              <Lock size={18} className="text-slate-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="At least 8 characters"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </span>
          </label>

          <button type="submit" className="btn-primary w-full justify-center py-3" disabled={submitting}>
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          or
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <a href={getGoogleAuthUrl()} className="btn-ghost w-full justify-center border border-slate-200 py-3 dark:border-slate-700">
          Continue with Google
        </a>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignup ? "Already have an account?" : "New to Commitly?"} {" "}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? "signin" : "signup")}
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>

        <p className="mt-4 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-200">Back to home</Link>
        </p>
      </section>
    </div>
  );
}
