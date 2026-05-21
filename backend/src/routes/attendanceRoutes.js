import { Router } from "express";
import { attendanceSummary, listAttendance, scanQr } from "../controllers/attendanceController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

export const attendanceRoutes = Router();

attendanceRoutes.get("/", requireAuth, listAttendance);
attendanceRoutes.get("/summary", requireAuth, allowRoles("admin"), attendanceSummary);
attendanceRoutes.post("/scan", requireAuth, allowRoles("conductor", "admin"), scanQr);
