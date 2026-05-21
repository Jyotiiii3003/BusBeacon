import { Bell } from "lucide-react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";

export function NotificationsPage() {
  const notifications = useApi(() => api.get("/notifications").then((res) => res.data), []);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-slate-500">FCM-backed alerts are also stored here for audit history.</p>
      </div>
      <div className="space-y-3">
        {(notifications.data || []).map((item) => (
          <article key={item._id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200"><Bell size={18} /></div>
            <div>
              <p className="font-medium">{item.message}</p>
              <p className="text-sm text-slate-500">{item.type} · {new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </article>
        ))}
        {notifications.data?.length === 0 && <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">No notifications yet.</p>}
      </div>
    </div>
  );
}
