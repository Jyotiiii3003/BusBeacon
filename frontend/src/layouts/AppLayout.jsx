import { Bell, Bus, ClipboardList, Home, LogOut, MapPinned, Menu, Moon, Settings, Sun } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { RoleBadge } from "../components/RoleBadge.jsx";

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  const nav = [
    { to: "/", label: "Dashboard", icon: Home },
    ...(user?.role === "admin" ? [{ to: "/manage", label: "Manage", icon: Settings }] : []),
    ...(user?.role === "admin" ? [{ to: "/simulator", label: "Simulator", icon: MapPinned }] : []),
    { to: "/attendance", label: "Attendance", icon: ClipboardList },
    { to: "/notifications", label: "Notifications", icon: Bell }
  ];

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 text-slate-950"><Bus size={22} /></div>
          <div>
            <p className="text-lg font-bold">BusBeacon</p>
            <p className="text-xs text-slate-500">School transport control</p>
          </div>
        </Link>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between gap-4">
            <button className="rounded-lg border border-slate-200 p-2 lg:hidden dark:border-slate-800" onClick={() => setOpen(true)}><Menu size={20} /></button>
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <div className="flex items-center gap-2"><span className="font-semibold">{user?.name}</span><RoleBadge role={user?.role} /></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={toggleDark} aria-label="Toggle dark mode">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
