import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./styles/index.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { Login } from "./pages/Login.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { DriverDashboard } from "./pages/DriverDashboard.jsx";
import { ConductorDashboard } from "./pages/ConductorDashboard.jsx";
import { ParentDashboard } from "./pages/ParentDashboard.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { AttendancePage } from "./pages/AttendancePage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { AdminManagementPage } from "./pages/AdminManagementPage.jsx";

function RoleHome() {
  const { user } = useAuth();
  const map = {
    admin: <AdminDashboard />,
    driver: <DriverDashboard />,
    conductor: <ConductorDashboard />,
    parent: <ParentDashboard />,
    student: <StudentDashboard />
  };
  return map[user?.role] || <Navigate to="/login" replace />;
}

function Protected({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <div className="grid min-h-screen place-items-center text-slate-600">Loading BusBeacon...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protected>
                <AppLayout />
              </Protected>
            }
          >
            <Route index element={<RoleHome />} />
            <Route path="manage" element={<AdminManagementPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
