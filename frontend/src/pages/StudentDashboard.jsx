import { ClipboardCheck, MapPinned, Route } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getSocket } from "../api/socket";
import { LiveMap } from "../components/LiveMap";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../hooks/useApi";

export function StudentDashboard() {
  const { token } = useAuth();
  const assignment = useApi(() => api.get("/dashboard/me").then((res) => res.data), []);
  const trips = useApi(() => api.get("/trips/active").then((res) => res.data), []);
  const [live, setLive] = useState(null);
  const student = assignment.data?.student;
  const trip = trips.data?.find((item) => item.bus?._id === student?.assignedBus?._id);

  useEffect(() => {
    if (!trip?._id || !token) return undefined;
    const socket = getSocket(token);
    socket.emit("join:trip", { tripId: trip._id });
    socket.on("bus:location", setLive);
    return () => socket.off("bus:location", setLive);
  }, [trip?._id, token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-slate-500">View bus location, route, stop, and attendance history. Attendance is conductor-only.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Route" value={student?.assignedRoute?.routeName || "--"} icon={Route} tone="bg-sky-500" />
        <StatCard label="Stop" value={student?.assignedStop?.stopName || "--"} icon={MapPinned} tone="bg-emerald-500" />
        <StatCard label="Attendance" value="Conductor scan only" icon={ClipboardCheck} tone="bg-rose-500" />
      </div>
      <LiveMap stops={student?.assignedRoute?.stops || []} busLocation={live?.location || trip?.liveLocation} />
    </div>
  );
}
