import { Bell, Clock, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getSocket } from "../api/socket";
import { LiveMap } from "../components/LiveMap";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi";

export function ParentDashboard() {
  const { token } = useAuth();
  const assignment = useApi(() => api.get("/dashboard/me").then((res) => res.data), []);
  const trips = useApi(() => api.get("/trips/active").then((res) => res.data), []);
  const [live, setLive] = useState(null);
  const child = assignment.data?.children?.[0];
  const trip = trips.data?.find((item) => item.bus?._id === child?.assignedBus?._id);

  useEffect(() => {
    if (!trip?._id || !token) return undefined;
    const socket = getSocket(token);
    socket.emit("join:trip", { tripId: trip._id });
    socket.on("bus:location", setLive);
    return () => socket.off("bus:location", setLive);
  }, [trip?._id, token]);

  const nearest = live?.stopsWithEta?.find((stop) => stop.id === child?.assignedStop?._id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <p className="text-slate-500">Track your child’s bus, ETA, attendance, and alerts in real time.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Child" value={child?.user?.name || "Not assigned"} icon={Bell} tone="bg-emerald-500" />
        <StatCard label="Assigned Stop" value={child?.assignedStop?.stopName || "--"} icon={MapPinned} tone="bg-sky-500" />
        <StatCard label="ETA" value={nearest ? `${nearest.etaMinutes} min` : "--"} icon={Clock} tone="bg-amber-500" />
      </div>
      <LiveMap stops={child?.assignedRoute?.stops || []} busLocation={live?.location || trip?.liveLocation} />
    </div>
  );
}
