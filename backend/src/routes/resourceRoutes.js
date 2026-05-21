import { Router } from "express";
import { Attendance } from "../models/Attendance.js";
import { Bus } from "../models/Bus.js";
import { Parent } from "../models/Parent.js";
import { Route } from "../models/Route.js";
import { Stop } from "../models/Stop.js";
import { Student } from "../models/Student.js";
import { User } from "../models/User.js";
import { crudController } from "../controllers/crudController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function mountCrud(router, path, Model, populate = "") {
  const controller = crudController(Model, populate);
  router.get(path, requireAuth, asyncHandler(controller.list));
  router.get(`${path}/:id`, requireAuth, asyncHandler(controller.get));
  router.post(path, requireAuth, allowRoles("admin"), asyncHandler(controller.create));
  router.put(`${path}/:id`, requireAuth, allowRoles("admin"), asyncHandler(controller.update));
  router.delete(`${path}/:id`, requireAuth, allowRoles("admin"), asyncHandler(controller.remove));
}

export const resourceRoutes = Router();

mountCrud(resourceRoutes, "/buses", Bus, "driver conductor route activeTrip");
mountCrud(resourceRoutes, "/routes", Route, "stops");
mountCrud(resourceRoutes, "/stops", Stop);
mountCrud(resourceRoutes, "/students", Student, "user parent assignedBus assignedRoute assignedStop");
mountCrud(resourceRoutes, "/parents", Parent, "user children");
mountCrud(resourceRoutes, "/users", User);
mountCrud(resourceRoutes, "/attendance-records", Attendance, "student bus trip stop");
