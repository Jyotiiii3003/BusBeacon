import { Attendance } from "../models/Attendance.js";
import { Bus } from "../models/Bus.js";
import { Student } from "../models/Student.js";
import { Trip } from "../models/Trip.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { haversineDistanceMeters } from "../utils/haversine.js";
import { createNotification } from "../services/notificationService.js";

export const scanQr = asyncHandler(async (req, res) => {
  const { qrCode, busId } = req.body;
  const bus = await Bus.findById(busId).populate("route");
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  if (String(bus.conductor) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only assigned conductor can scan attendance" });
  }

  const trip = await Trip.findOne({ bus: bus._id, active: true }).populate("route");
  if (!trip) return res.status(409).json({ message: "No active trip for this bus" });
  if (!trip.liveLocation?.latitude || !trip.liveLocation?.longitude) {
    return res.status(409).json({ message: "Bus GPS is not active" });
  }

  const student = await Student.findOne({ qrCode })
    .populate("user parent assignedStop assignedRoute assignedBus");
  if (!student) return res.status(404).json({ message: "Student QR not recognized" });
  if (String(student.assignedRoute._id) !== String(trip.route._id)) {
    return res.status(409).json({ message: "Student is not assigned to this route" });
  }
  if (String(student.assignedBus?._id) !== String(bus._id)) {
    return res.status(409).json({ message: "Student is not assigned to this bus" });
  }

  const distance = haversineDistanceMeters(
    { latitude: trip.liveLocation.latitude, longitude: trip.liveLocation.longitude },
    { latitude: student.assignedStop.latitude, longitude: student.assignedStop.longitude }
  );
  const allowedRadius = student.assignedStop.radius || 150;
  if (distance > allowedRadius) {
    return res.status(409).json({
      message: `Bus is ${Math.round(distance)}m from assigned stop. Attendance allowed within ${allowedRadius}m.`
    });
  }

  const attendance = await Attendance.create({
    student: student._id,
    bus: bus._id,
    trip: trip._id,
    stop: student.assignedStop._id,
    status: "boarded"
  });

  await createNotification({
    recipient: student.parent._id,
    type: "boarded",
    message: `${student.user.name} boarded bus ${bus.busNumber}`,
    metadata: { studentId: student._id, tripId: trip._id }
  });

  res.status(201).json({ attendance, distanceMeters: Math.round(distance) });
});

export const listAttendance = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.student) filter.student = req.query.student;
  if (req.query.trip) filter.trip = req.query.trip;
  const records = await Attendance.find(filter)
    .populate({ path: "student", populate: "user parent assignedStop" })
    .populate("bus trip stop")
    .sort({ timestamp: -1 });
  res.json(records);
});

export const attendanceSummary = asyncHandler(async (req, res) => {
  const summary = await Attendance.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json(summary.reduce((acc, row) => ({ ...acc, [row._id]: row.count }), {}));
});
