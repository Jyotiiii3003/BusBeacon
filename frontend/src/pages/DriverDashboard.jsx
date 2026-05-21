import { AlertTriangle, Navigation, Play, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getSocket } from "../api/socket";
import { LiveMap, MapLegend } from "../components/LiveMap";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi";

export function DriverDashboard() {
  const { token } = useAuth();
  const assignment = useApi(() => api.get("/dashboard/me").then((res) => res.data), []);
  const [trip, setTrip] = useState(null);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const bus = assignment.data?.bus;

  useEffect(() => {
    if (!trip?._id || !token) return undefined;
    const socket = getSocket(token);
    socket.emit("join:trip", { tripId: trip._id });
    const watchId = navigator.geolocation?.watchPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: Math.round((pos.coords.speed || 0) * 3.6),
          heading: pos.coords.heading || 0,
          timestamp: new Date()
        };
        setLocation(loc);
        socket.emit("driver:location", { tripId: trip._id, ...loc });
      },
      () => setMessage("Location permission is required for live tracking."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => navigator.geolocation?.clearWatch(watchId);
  }, [trip, token]);

  async function startTrip() {
    const { data } = await api.post("/trips/start", { busId: bus._id });
    setTrip(data);
    setMessage("Trip started. GPS tracking is active.");
  }

  async function endTrip() {
    if (!trip?._id) return;
    await api.post(`/trips/${trip._id}/end`);
    setTrip(null);
    setMessage("Trip ended.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <p className="text-slate-500">Start trips, share GPS, and monitor assigned route navigation.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned Bus" value={bus?.busNumber || "None"} icon={Navigation} tone="bg-amber-500" />
        <StatCard label="Route" value={bus?.route?.routeName || "Unassigned"} icon={Navigation} tone="bg-sky-500" />
        <StatCard label="Trip Status" value={trip ? "Active" : "Idle"} icon={Play} tone={trip ? "bg-emerald-500" : "bg-slate-500"} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={!bus || trip} onClick={startTrip} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"><Play size={18} /> Start Trip</button>
        <button disabled={!trip} onClick={endTrip} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950"><Square size={18} /> End Trip</button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"><AlertTriangle size={18} /> SOS</button>
      </div>
      {message && <p className="rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">{message}</p>}
      <div className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Route Navigation</h2><MapLegend /></div>
        <LiveMap stops={bus?.route?.stops || []} busLocation={location || trip?.liveLocation} />
      </div>
    </div>
  );
}
