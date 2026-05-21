export function RoleBadge({ role }) {
  const colors = {
    admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200",
    driver: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
    conductor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
    parent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    student: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[role]}`}>{role}</span>;
}
