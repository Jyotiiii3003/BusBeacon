export function DataTable({ columns, rows = [], empty = "No records found" }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>{empty}</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row._id || row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
