import { Router } from "express";
import { emergencyAlert, listNotifications, markRead } from "../controllers/notificationController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

export const notificationRoutes = Router();

notificationRoutes.get("/", requireAuth, listNotifications);
notificationRoutes.patch("/:id/read", requireAuth, markRead);
notificationRoutes.post("/emergency", requireAuth, allowRoles("driver", "conductor", "admin"), emergencyAlert);
