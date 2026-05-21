import { Bus, MapPinned, Play, RefreshCw, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { LiveMap, MapLegend } from "../components/LiveMap";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext.jsx";

export function AdminSimulatorPage() {
  const { user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const selectedBus = useMemo(() => buses.find((bus) => bus._id === selectedBusId), [buses, selectedBusId]);
  const selectedTrip = useMemo(() => trips.find((trip) => trip._id === selectedTripId), [trips, selectedTripId]);
  const route = selectedTrip?.route || selectedBus?.route;
  const stops = route?.stops || [];
  const selectedStop = stops.find((stop) => stop._id === selectedStopId);
  const expectedStudents = students.filter((student) => student.assignedStop?._id === selectedStopId && student.assignedBus?._id === (selectedTrip?.bus?._id || selectedBusId));

  async function load() {
    setLoading(true);
    try {
      const [busRes, tripRes, studentRes] = await Promise.all([
        api.get("/buses"),
        api.get("/trips/active"),
        api.get("/students")
      ]);
      setBuses(busRes.data);
      setTrips(tripRes.data);
      setStudents(studentRes.data);
      const firstTrip = tripRes.data[0];
      const firstBus = firstTrip?.bus || busRes.data[0];
      setSelectedTripId((current) => current || firstTrip?._id || "");
      setSelectedBusId((current) => current || firstBus?._id || "");
      setSelectedStopId((current) => current || firstTrip?.route?.stops?.[0]?._id || firstBus?.route?.stops?.[0]?._id || "");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  async function startTrip() {
    if (!selectedBusId) return;
    setMessage("");
    try {
      const { data } = await api.post("/trips/start", { busId: selectedBusId });
      setMessage(`Started trip for bus ${data.bus?.busNumber || selectedBus?.busNumber}.`);
      await load();
      setSelectedTripId(data._id);
      setSelectedStopId(data.route?.stops?.[0]?._id || selectedStopId);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  }

  async function endTrip() {
    if (!selectedTripId) return;
    setMessage("");
    try {
      await api.post(`/trips/${selectedTripId}/end`);
      setMessage("Trip ended.");
      setSelectedTripId("");
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  }

  async function moveToStop() {
    if (!selectedTripId || !selectedStopId) return;
    setMessage("");
    try {
      const { data } = await api.post(`/trips/${selectedTripId}/simulate-location`, {
        stopId: selectedStopId,
        speed: 12,
        heading: 0,
        notifyParents: true
      });
      setMessage(`${data.message}. Parent notifications created: ${data.notificationsSent}.`);
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  }

  function selectTrip(id) {
    setSelectedTripId(id);
    const trip = trips.find((item) => item._id === id);
    if (trip) {
      setSelectedBusId(trip.bus?._id);
      setSelectedStopId(trip.route?.stops?.[0]?._id || "");
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Admin access required</h1>
        <p className="mt-2 text-slate-500">The simulator is only available to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trip Simulator</h1>
        <p className="text-slate-500">Move an active bus to a route stop for demos, QR attendance testing, and parent ETA checks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active Trips" value={trips.length} icon={Bus} tone="bg-emerald-500" />
        <StatCard label="Selected Stop" value={selectedStop?.stopName || "None"} icon={MapPinned} tone="bg-sky-500" />
        <StatCard label="Expected Students" value={expectedStudents.length} icon={RefreshCw} tone="bg-amber-500" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Bus</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={selectedBusId} onChange={(event) => setSelectedBusId(event.target.value)}>
              <option value="">Select bus</option>
              {buses.map((bus) => <option key={bus._id} value={bus._id}>{bus.busNumber} - {bus.route?.routeName || "No route"}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={startTrip} disabled={!selectedBusId} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
              <Play size={17} /> Start Trip
            </button>
            <button onClick={endTrip} disabled={!selectedTripId} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">
              <Square size={17} /> End Trip
            </button>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-semibold dark:border-slate-700">
              <RefreshCw size={17} /> Refresh
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Active Trip</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={selectedTripId} onChange={(event) => selectTrip(event.target.value)}>
              <option value="">Select active trip</option>
              {trips.map((trip) => <option key={trip._id} value={trip._id}>{trip.bus?.busNumber} - {trip.route?.routeName}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Move Bus To Stop</label>
            <select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={selectedStopId} onChange={(event) => setSelectedStopId(event.target.value)}>
              <option value="">Select stop</option>
              {stops.map((stop) => <option key={stop._id} value={stop._id}>{stop.stopName}</option>)}
            </select>
          </div>

          <button onClick={moveToStop} disabled={!selectedTripId || !selectedStopId} className="w-full rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">
            Move Bus To Selected Stop
          </button>

          {message && <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{message}</p>}

          <div className="rounded-lg bg-sky-50 p-3 text-sm text-sky-800 dark:bg-sky-500/20 dark:text-sky-100">
            After moving the bus to a stop, login as the assigned conductor and scan or paste a student QR assigned to that same stop.
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Simulated Live Map</h2>
            <MapLegend />
          </div>
          <LiveMap stops={stops} busLocation={selectedTrip?.liveLocation} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Students Expected At Selected Stop</h2>
        <DataTable
          columns={[
            { key: "user", label: "Student", render: (row) => row.user?.name },
            { key: "parent", label: "Parent", render: (row) => row.parent?.name },
            { key: "assignedBus", label: "Bus", render: (row) => row.assignedBus?.busNumber },
            { key: "qrCode", label: "QR", render: (row) => <span className="font-mono text-xs">{row.qrCode}</span> }
          ]}
          rows={expectedStudents}
          empty={loading ? "Loading..." : "No students assigned to this stop"}
        />
      </section>
    </div>
  );
}
