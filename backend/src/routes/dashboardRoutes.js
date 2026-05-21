import { Router } from "express";
import { dashboard, myAssignments } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", requireAuth, dashboard);
dashboardRoutes.get("/me", requireAuth, myAssignments);
