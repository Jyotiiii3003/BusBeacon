import { Bus } from "../models/Bus.js";
import { Student } from "../models/Student.js";
import { Stop } from "../models/Stop.js";
import { Trip } from "../models/Trip.js";
import { createNotification } from "../services/notificationService.js";
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

export const simulateTripLocation = asyncHandler(async (req, res) => {
  const { stopId, latitude, longitude, speed = 18, heading = 0, notifyParents = true } = req.body;
  const trip = await Trip.findOne({ _id: req.params.id, active: true })
    .populate("bus")
    .populate({ path: "route", populate: "stops" })
    .populate("driver");

  if (!trip) return res.status(404).json({ message: "Active trip not found" });

  let location = { latitude: Number(latitude), longitude: Number(longitude) };
  let stop = null;

  if (stopId) {
    stop = await Stop.findById(stopId);
    if (!stop) return res.status(404).json({ message: "Stop not found" });
    const stopBelongsToRoute = trip.route.stops.some((item) => String(item._id) === String(stop._id));
    if (!stopBelongsToRoute) return res.status(409).json({ message: "Stop is not part of this trip route" });
    location = { latitude: stop.latitude, longitude: stop.longitude };
  }

  if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    return res.status(400).json({ message: "Provide a stop or valid latitude and longitude" });
  }

  trip.liveLocation = {
    latitude: location.latitude,
    longitude: location.longitude,
    speed: Number(speed),
    heading: Number(heading),
    timestamp: new Date()
  };
  await trip.save();

  let notificationsSent = 0;
  if (notifyParents && stop) {
    const students = await Student.find({
      assignedBus: trip.bus._id,
      assignedRoute: trip.route._id,
      assignedStop: stop._id
    }).populate("user parent");

    await Promise.all(students.map(async (student) => {
      notificationsSent += 1;
      await createNotification({
        recipient: student.parent._id,
        type: "near_stop",
        message: `Bus ${trip.bus.busNumber} is near ${stop.stopName} for ${student.user.name}`,
        metadata: { tripId: trip._id, stopId: stop._id, demoMode: true }
      });
    }));
  }

  res.json({
    trip: await trip.populate({ path: "route", populate: "stops" }),
    stop,
    notificationsSent,
    message: stop ? `Bus moved to ${stop.stopName}` : "Bus location updated"
  });
});
