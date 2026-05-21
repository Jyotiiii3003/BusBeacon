import { Attendance } from "../models/Attendance.js";
import { Bus } from "../models/Bus.js";
import { Route } from "../models/Route.js";
import { Student } from "../models/Student.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (req, res) => {
  const [users, buses, routes, students, activeTrips, attendance] = await Promise.all([
    User.countDocuments(),
    Bus.countDocuments(),
    Route.countDocuments(),
    Student.countDocuments(),
    Trip.countDocuments({ active: true }),
    Attendance.countDocuments()
  ]);
  res.json({ users, buses, routes, students, activeTrips, attendance });
});

export const myAssignments = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const payload = {};
  if (role === "driver") {
    payload.bus = await Bus.findOne({ driver: req.user._id }).populate({
      path: "route",
      populate: "stops"
    });
  }
  if (role === "conductor") {
    payload.bus = await Bus.findOne({ conductor: req.user._id }).populate({
      path: "route",
      populate: "stops"
    });
  }
  if (role === "student") {
    payload.student = await Student.findOne({ user: req.user._id })
      .populate("user parent assignedBus assignedStop")
      .populate({ path: "assignedRoute", populate: "stops" });
  }
  if (role === "parent") {
    payload.children = await Student.find({ parent: req.user._id })
      .populate("user assignedBus assignedStop")
      .populate({ path: "assignedRoute", populate: "stops" });
  }
  res.json(payload);
});
