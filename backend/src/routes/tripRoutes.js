import { Router } from "express";
import { activeTrips, endTrip, listTrips, startTrip } from "../controllers/tripController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

export const tripRoutes = Router();

tripRoutes.get("/", requireAuth, listTrips);
tripRoutes.get("/active", requireAuth, activeTrips);
tripRoutes.post("/start", requireAuth, allowRoles("driver", "admin"), startTrip);
tripRoutes.post("/:id/end", requireAuth, allowRoles("driver", "admin"), endTrip);
