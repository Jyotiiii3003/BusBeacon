import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { useApi } from "../hooks/useApi";

export function AttendancePage() {
  const records = useApi(() => api.get("/attendance").then((res) => res.data), []);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-slate-500">Validated QR scans with active trip, bus GPS, route, and geofence checks.</p>
      </div>
      <DataTable
        columns={[
          { key: "student", label: "Student", render: (row) => row.student?.user?.name },
          { key: "bus", label: "Bus", render: (row) => row.bus?.busNumber },
          { key: "stop", label: "Stop", render: (row) => row.stop?.stopName },
          { key: "status", label: "Status" },
          { key: "timestamp", label: "Time", render: (row) => new Date(row.timestamp).toLocaleString() }
        ]}
        rows={records.data || []}
      />
    </div>
  );
}
