export function StatCard({ label, value, icon: Icon, tone = "bg-sky-500" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{value ?? "--"}</p>
        </div>
        {Icon && (
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone} text-white`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
