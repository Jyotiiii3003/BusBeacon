import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { useApi } from "../hooks/useApi";

export function ConductorDashboard() {
  const assignment = useApi(() => api.get("/dashboard/me").then((res) => res.data), []);
  const students = useApi(() => api.get("/students").then((res) => res.data), []);
  const [result, setResult] = useState("");
  const [manualQr, setManualQr] = useState("");
  const scannerRef = useRef(null);
  const bus = assignment.data?.bus;
  const expected = (students.data || []).filter((student) => student.assignedBus?._id === bus?._id);

  useEffect(() => () => scannerRef.current?.clear?.(), []);

  function startScanner() {
    if (scannerRef.current || !bus) return;
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 8, qrbox: { width: 240, height: 240 } }, false);
    scanner.render((decodedText) => submitQr(decodedText), () => {});
    scannerRef.current = scanner;
  }

  async function submitQr(qrCode = manualQr) {
    try {
      const { data } = await api.post("/attendance/scan", { qrCode, busId: bus._id });
      setResult(`Attendance marked at ${data.distanceMeters}m from assigned stop.`);
      setManualQr("");
    } catch (err) {
      setResult(err.response?.data?.message || "Attendance scan failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conductor Dashboard</h1>
        <p className="text-slate-500">Scan student QR codes after route, GPS, trip, and stop geofence validation.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned Bus" value={bus?.busNumber || "None"} icon={QrCode} tone="bg-cyan-500" />
        <StatCard label="Route" value={bus?.route?.routeName || "Unassigned"} icon={QrCode} tone="bg-sky-500" />
        <StatCard label="Expected Students" value={expected.length} icon={Users} tone="bg-emerald-500" />
      </div>
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Secure QR Scan</h2>
          <div id="qr-reader" className="mt-4 overflow-hidden rounded-lg" />
          <button onClick={startScanner} disabled={!bus} className="mt-4 w-full rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">Open Camera Scanner</button>
          <div className="mt-4 flex gap-2">
            <input value={manualQr} onChange={(e) => setManualQr(e.target.value)} placeholder="Paste QR value" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
            <button onClick={() => submitQr()} disabled={!manualQr || !bus} className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">Mark</button>
          </div>
          {result && <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{result}</p>}
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Expected Students</h2>
          <DataTable
            columns={[
              { key: "name", label: "Student", render: (row) => row.user?.name },
              { key: "stop", label: "Stop", render: (row) => row.assignedStop?.stopName },
              { key: "qrCode", label: "QR Code" }
            ]}
            rows={expected}
          />
        </div>
      </section>
    </div>
  );
}
