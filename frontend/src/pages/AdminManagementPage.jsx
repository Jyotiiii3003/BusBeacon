import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { DataTable } from "../components/DataTable";
import { useAuth } from "../context/AuthContext.jsx";

const resources = [
  { key: "users", label: "Users" },
  { key: "stops", label: "Stops" },
  { key: "routes", label: "Routes" },
  { key: "buses", label: "Buses" },
  { key: "students", label: "Students" }
];

const emptyForms = {
  users: { name: "", email: "", password: "", role: "parent", phone: "" },
  stops: { stopName: "", latitude: "", longitude: "", radius: 150 },
  routes: { routeName: "", description: "", stops: [] },
  buses: { busNumber: "", driver: "", conductor: "", route: "", capacity: 40, status: "inactive" },
  students: {
    user: "",
    parent: "",
    assignedBus: "",
    assignedRoute: "",
    assignedStop: "",
    qrCode: "",
    grade: "",
    section: ""
  }
};

function idOf(value) {
  return typeof value === "object" && value !== null ? value._id : value || "";
}

function labelOf(value, fallback = "Unassigned") {
  return typeof value === "object" && value !== null ? value.name || value.routeName || value.stopName || value.busNumber : fallback;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";
}

export function AdminManagementPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("users");
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForms.users);

  const users = records.users || [];
  const stops = records.stops || [];
  const routes = records.routes || [];
  const buses = records.buses || [];

  const roleUsers = useMemo(() => ({
    drivers: users.filter((item) => item.role === "driver"),
    conductors: users.filter((item) => item.role === "conductor"),
    parents: users.filter((item) => item.role === "parent"),
    students: users.filter((item) => item.role === "student")
  }), [users]);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setEditingId("");
    setForm(emptyForms[active]);
    setMessage("");
  }, [active]);

  async function loadAll() {
    setLoading(true);
    try {
      const result = await Promise.all(resources.map((item) => api.get(`/${item.key}`)));
      setRecords(Object.fromEntries(resources.map((item, index) => [item.key, result[index].data])));
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function normalizePayload() {
    const payload = { ...form };
    if (active === "users" && editingId && !payload.password) delete payload.password;
    if (active === "stops") {
      payload.latitude = Number(payload.latitude);
      payload.longitude = Number(payload.longitude);
      payload.radius = Number(payload.radius || 150);
    }
    if (active === "buses") payload.capacity = Number(payload.capacity || 40);
    if (active === "students" && !payload.qrCode) payload.qrCode = `BUSBEACON-STUDENT-${Date.now()}`;
    Object.keys(payload).forEach((key) => payload[key] === "" && delete payload[key]);
    return payload;
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await api.put(`/${active}/${editingId}`, normalizePayload());
        setMessage("Record updated.");
      } else {
        await api.post(`/${active}`, normalizePayload());
        setMessage("Record created.");
      }
      setEditingId("");
      setForm(emptyForms[active]);
      await loadAll();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.delete(`/${active}/${id}`);
      setMessage("Record deleted.");
      await loadAll();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  }

  function edit(record) {
    setEditingId(record._id);
    if (active === "users") {
      setForm({ name: record.name || "", email: record.email || "", password: "", role: record.role || "parent", phone: record.phone || "" });
    }
    if (active === "stops") {
      setForm({ stopName: record.stopName || "", latitude: record.latitude || "", longitude: record.longitude || "", radius: record.radius || 150 });
    }
    if (active === "routes") {
      setForm({ routeName: record.routeName || "", description: record.description || "", stops: (record.stops || []).map(idOf) });
    }
    if (active === "buses") {
      setForm({
        busNumber: record.busNumber || "",
        driver: idOf(record.driver),
        conductor: idOf(record.conductor),
        route: idOf(record.route),
        capacity: record.capacity || 40,
        status: record.status || "inactive"
      });
    }
    if (active === "students") {
      setForm({
        user: idOf(record.user),
        parent: idOf(record.parent),
        assignedBus: idOf(record.assignedBus),
        assignedRoute: idOf(record.assignedRoute),
        assignedStop: idOf(record.assignedStop),
        qrCode: record.qrCode || "",
        grade: record.grade || "",
        section: record.section || ""
      });
    }
  }

  const rows = records[active] || [];
  const columns = [
    ...columnsFor(active),
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => edit(row)} aria-label="Edit record">
            <Edit2 size={15} />
          </button>
          <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950" onClick={() => remove(row._id)} aria-label="Delete record">
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  if (user?.role !== "admin") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Admin access required</h1>
        <p className="mt-2 text-slate-500">Management screens are only available to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <p className="text-slate-500">Create and maintain the operational data used by BusBeacon.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {resources.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${active === item.key ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">{editingId ? "Edit" : "Add"} {resources.find((item) => item.key === active)?.label.slice(0, -1)}</h2>
            {editingId && (
              <button type="button" className="rounded-lg border border-slate-200 p-2 dark:border-slate-700" onClick={() => { setEditingId(""); setForm(emptyForms[active]); }}>
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {renderFields(active, form, update, { stops, routes, buses, roleUsers })}
          </div>
          {message && <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{message}</p>}
          <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950">
            <Plus size={17} /> {editingId ? "Save Changes" : "Create Record"}
          </button>
        </form>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{resources.find((item) => item.key === active)?.label}</h2>
            <span className="text-sm text-slate-500">{loading ? "Loading..." : `${rows.length} records`}</span>
          </div>
          <DataTable columns={columns} rows={rows} />
        </div>
      </section>
    </div>
  );
}

function Select({ value, onChange, children, multiple = false }) {
  return (
    <select
      className={inputClass()}
      value={value}
      multiple={multiple}
      onChange={(event) => {
        if (multiple) {
          onChange(Array.from(event.target.selectedOptions).map((option) => option.value));
        } else {
          onChange(event.target.value);
        }
      }}
    >
      {children}
    </select>
  );
}

function renderFields(active, form, update, options) {
  if (active === "users") {
    return (
      <>
        <Field label="Name"><input className={inputClass()} value={form.name} onChange={(e) => update("name", e.target.value)} required /></Field>
        <Field label="Email"><input className={inputClass()} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></Field>
        <Field label="Password"><input className={inputClass()} type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Required for new users" /></Field>
        <Field label="Role"><Select value={form.role} onChange={(value) => update("role", value)}>{["admin", "driver", "conductor", "parent", "student"].map((role) => <option key={role} value={role}>{role}</option>)}</Select></Field>
        <Field label="Phone"><input className={inputClass()} value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
      </>
    );
  }
  if (active === "stops") {
    return (
      <>
        <Field label="Stop Name"><input className={inputClass()} value={form.stopName} onChange={(e) => update("stopName", e.target.value)} required /></Field>
        <Field label="Latitude"><input className={inputClass()} type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} required /></Field>
        <Field label="Longitude"><input className={inputClass()} type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} required /></Field>
        <Field label="Radius meters"><input className={inputClass()} type="number" value={form.radius} onChange={(e) => update("radius", e.target.value)} /></Field>
      </>
    );
  }
  if (active === "routes") {
    return (
      <>
        <Field label="Route Name"><input className={inputClass()} value={form.routeName} onChange={(e) => update("routeName", e.target.value)} required /></Field>
        <Field label="Description"><input className={inputClass()} value={form.description} onChange={(e) => update("description", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label="Stops"><Select multiple value={form.stops} onChange={(value) => update("stops", value)}>{options.stops.map((stop) => <option key={stop._id} value={stop._id}>{stop.stopName}</option>)}</Select></Field>
        </div>
      </>
    );
  }
  if (active === "buses") {
    return (
      <>
        <Field label="Bus Number"><input className={inputClass()} value={form.busNumber} onChange={(e) => update("busNumber", e.target.value)} required /></Field>
        <Field label="Driver"><Select value={form.driver} onChange={(value) => update("driver", value)}><option value="">Unassigned</option>{options.roleUsers.drivers.map((driver) => <option key={driver._id} value={driver._id}>{driver.name}</option>)}</Select></Field>
        <Field label="Conductor"><Select value={form.conductor} onChange={(value) => update("conductor", value)}><option value="">Unassigned</option>{options.roleUsers.conductors.map((conductor) => <option key={conductor._id} value={conductor._id}>{conductor.name}</option>)}</Select></Field>
        <Field label="Route"><Select value={form.route} onChange={(value) => update("route", value)}><option value="">Unassigned</option>{options.routes.map((route) => <option key={route._id} value={route._id}>{route.routeName}</option>)}</Select></Field>
        <Field label="Capacity"><input className={inputClass()} type="number" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} /></Field>
        <Field label="Status"><Select value={form.status} onChange={(value) => update("status", value)}>{["inactive", "active", "maintenance"].map((status) => <option key={status} value={status}>{status}</option>)}</Select></Field>
      </>
    );
  }
  return (
    <>
      <Field label="Student User"><Select value={form.user} onChange={(value) => update("user", value)}><option value="">Select student user</option>{options.roleUsers.students.map((student) => <option key={student._id} value={student._id}>{student.name}</option>)}</Select></Field>
      <Field label="Parent"><Select value={form.parent} onChange={(value) => update("parent", value)}><option value="">Select parent</option>{options.roleUsers.parents.map((parent) => <option key={parent._id} value={parent._id}>{parent.name}</option>)}</Select></Field>
      <Field label="Assigned Bus"><Select value={form.assignedBus} onChange={(value) => update("assignedBus", value)}><option value="">Select bus</option>{options.buses.map((bus) => <option key={bus._id} value={bus._id}>{bus.busNumber}</option>)}</Select></Field>
      <Field label="Assigned Route"><Select value={form.assignedRoute} onChange={(value) => update("assignedRoute", value)}><option value="">Select route</option>{options.routes.map((route) => <option key={route._id} value={route._id}>{route.routeName}</option>)}</Select></Field>
      <Field label="Assigned Stop"><Select value={form.assignedStop} onChange={(value) => update("assignedStop", value)}><option value="">Select stop</option>{options.stops.map((stop) => <option key={stop._id} value={stop._id}>{stop.stopName}</option>)}</Select></Field>
      <Field label="QR Code"><input className={inputClass()} value={form.qrCode} onChange={(e) => update("qrCode", e.target.value)} placeholder="Auto-generated if blank" /></Field>
      <Field label="Grade"><input className={inputClass()} value={form.grade} onChange={(e) => update("grade", e.target.value)} /></Field>
      <Field label="Section"><input className={inputClass()} value={form.section} onChange={(e) => update("section", e.target.value)} /></Field>
    </>
  );
}

function columnsFor(active) {
  const base = {
    users: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "phone", label: "Phone" }
    ],
    stops: [
      { key: "stopName", label: "Stop" },
      { key: "latitude", label: "Lat" },
      { key: "longitude", label: "Lng" },
      { key: "radius", label: "Radius" }
    ],
    routes: [
      { key: "routeName", label: "Route" },
      { key: "stops", label: "Stops", render: (row) => (row.stops || []).map((stop) => stop.stopName).join(", ") || "None" }
    ],
    buses: [
      { key: "busNumber", label: "Bus" },
      { key: "driver", label: "Driver", render: (row) => labelOf(row.driver) },
      { key: "conductor", label: "Conductor", render: (row) => labelOf(row.conductor) },
      { key: "route", label: "Route", render: (row) => labelOf(row.route) },
      { key: "status", label: "Status" }
    ],
    students: [
      { key: "user", label: "Student", render: (row) => labelOf(row.user) },
      { key: "parent", label: "Parent", render: (row) => labelOf(row.parent) },
      { key: "assignedBus", label: "Bus", render: (row) => labelOf(row.assignedBus) },
      { key: "assignedStop", label: "Stop", render: (row) => labelOf(row.assignedStop) },
      { key: "qrCode", label: "QR" }
    ]
  };
  return base[active];
}
