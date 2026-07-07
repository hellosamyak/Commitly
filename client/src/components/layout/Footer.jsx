import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Commitly — Turn focus into visible momentum.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400">
            Scoring
          </Link>
          <a href="https://github.com" className="hover:text-brand-600 dark:hover:text-brand-400">
            GitHub-style habits
          </a>
        </div>
      </div>
    </footer>
  );
}
