import { Activity, Bus, ClipboardList, Route, Users } from "lucide-react";
import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { LiveMap, MapLegend } from "../components/LiveMap";
import { StatCard } from "../components/StatCard";
import { useApi } from "../hooks/useApi";

export function AdminDashboard() {
  const stats = useApi(() => api.get("/dashboard").then((res) => res.data), []);
  const trips = useApi(() => api.get("/trips/active").then((res) => res.data), []);
  const buses = useApi(() => api.get("/buses").then((res) => res.data), []);
  const activeTrip = trips.data?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">Fleet operations, live routes, student records, and attendance oversight.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Users" value={stats.data?.users} icon={Users} tone="bg-indigo-500" />
        <StatCard label="Buses" value={stats.data?.buses} icon={Bus} tone="bg-amber-500" />
        <StatCard label="Routes" value={stats.data?.routes} icon={Route} tone="bg-sky-500" />
        <StatCard label="Students" value={stats.data?.students} icon={Users} tone="bg-emerald-500" />
        <StatCard label="Active Trips" value={stats.data?.activeTrips} icon={Activity} tone="bg-rose-500" />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Live Fleet Map</h2>
            <MapLegend />
          </div>
          <LiveMap stops={activeTrip?.route?.stops || []} busLocation={activeTrip?.liveLocation} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Active Trips</h2>
          <DataTable
            columns={[
              { key: "bus", label: "Bus", render: (row) => row.bus?.busNumber },
              { key: "route", label: "Route", render: (row) => row.route?.routeName },
              { key: "startTime", label: "Started", render: (row) => new Date(row.startTime).toLocaleTimeString() }
            ]}
            rows={trips.data || []}
          />
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Fleet Directory</h2>
        <DataTable
          columns={[
            { key: "busNumber", label: "Bus" },
            { key: "driver", label: "Driver", render: (row) => row.driver?.name || "Unassigned" },
            { key: "conductor", label: "Conductor", render: (row) => row.conductor?.name || "Unassigned" },
            { key: "route", label: "Route", render: (row) => row.route?.routeName || "Unassigned" },
            { key: "status", label: "Status" }
          ]}
          rows={buses.data || []}
        />
      </section>
    </div>
  );
}
