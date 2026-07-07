export const CATEGORY_STYLES = {
  study: { bar: "bg-blue-500", badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", label: "Study" },
  focus: { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", label: "Focus" },
  reading: { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", label: "Reading" },
  work: { bar: "bg-violet-500", badge: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", label: "Work" },
  custom: { bar: "bg-slate-500", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", label: "Custom" }
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.custom;
}
