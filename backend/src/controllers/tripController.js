import { Bus } from "../models/Bus.js";
import { Trip } from "../models/Trip.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const startTrip = asyncHandler(async (req, res) => {
  const { busId } = req.body;
  const bus = await Bus.findById(busId).populate("route");
  if (!bus) return res.status(404).json({ message: "Bus not found" });
  if (String(bus.driver) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only assigned driver can start this trip" });
  }
  if (bus.activeTrip) return res.status(409).json({ message: "Bus already has an active trip" });
  const trip = await Trip.create({ bus: bus._id, driver: req.user._id, route: bus.route });
  bus.activeTrip = trip._id;
  bus.status = "active";
  await bus.save();
  res.status(201).json(await trip.populate("bus route driver"));
});

export const endTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (String(trip.driver) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only assigned driver can end this trip" });
  }
  trip.active = false;
  trip.endTime = new Date();
  await trip.save();
  await Bus.findByIdAndUpdate(trip.bus, { activeTrip: null, status: "inactive" });
  res.json(trip);
});

export const listTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find()
    .populate({ path: "bus", populate: "driver conductor route" })
    .populate({ path: "route", populate: "stops" })
    .populate("driver")
    .sort({ createdAt: -1 });
  res.json(trips);
});

export const activeTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ active: true })
    .populate({ path: "bus", populate: "driver conductor route" })
    .populate({ path: "route", populate: "stops" })
    .populate("driver");
  res.json(trips);
});
