import { Bus } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const demoUsers = [
  ["Admin", "admin@busbeacon.test"],
  ["Driver", "driver@busbeacon.test"],
  ["Conductor", "conductor@busbeacon.test"],
  ["Parent", "parent@busbeacon.test"],
  ["Student", "student@busbeacon.test"]
];

export function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("admin@busbeacon.test");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-950 px-4 py-8 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex flex-col justify-between rounded-lg bg-[url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-8">
        <div className="inline-flex w-fit items-center gap-3 rounded-lg bg-slate-950/80 px-4 py-3 backdrop-blur">
          <Bus className="text-amber-300" /> <span className="text-xl font-bold">BusBeacon</span>
        </div>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold sm:text-6xl">Smart school bus safety, live.</h1>
          <p className="mt-4 text-lg text-slate-100">OpenStreetMap tracking, secure conductor QR attendance, role dashboards, and instant parent notifications.</p>
        </div>
      </section>
      <section className="grid place-items-center px-0 py-8 lg:px-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Use seed accounts after running `npm run seed`.</p>
          <label className="mt-6 block text-sm font-medium">Email</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="mt-4 block text-sm font-medium">Password</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-200">{error}</p>}
          <button className="mt-6 w-full rounded-lg bg-amber-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-amber-300">Login</button>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {demoUsers.map(([label, demoEmail]) => (
              <button key={demoEmail} type="button" onClick={() => setEmail(demoEmail)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                {label}
              </button>
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}
