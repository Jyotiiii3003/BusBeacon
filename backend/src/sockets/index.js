import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Bus } from "../models/Bus.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";
import { createNotification } from "../services/notificationService.js";
import { haversineDistanceMeters, estimateEtaMinutes } from "../utils/haversine.js";

export function registerSockets(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error("Invalid user"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("join:trip", ({ tripId }) => {
      if (tripId) socket.join(`trip:${tripId}`);
    });

    socket.on("driver:location", async (payload, ack) => {
      try {
        if (!["driver", "admin"].includes(socket.user.role)) throw new Error("Only drivers can publish location");
        const { tripId, latitude, longitude, speed = 0, heading = 0 } = payload;
        const trip = await Trip.findOne({ _id: tripId, active: true }).populate({
          path: "route",
          populate: "stops"
        });
        if (!trip) throw new Error("Active trip not found");
        if (String(trip.driver) !== String(socket.user._id) && socket.user.role !== "admin") {
          throw new Error("Driver is not assigned to this trip");
        }

        trip.liveLocation = { latitude, longitude, speed, heading, timestamp: new Date() };
        await trip.save();
        await Bus.findByIdAndUpdate(trip.bus, { activeTrip: trip._id, status: "active" });

        const stopsWithEta = trip.route.stops.map((stop) => {
          const distance = haversineDistanceMeters({ latitude, longitude }, stop);
          return {
            id: stop._id,
            stopName: stop.stopName,
            distanceMeters: Math.round(distance),
            etaMinutes: estimateEtaMinutes(distance, speed || 24)
          };
        });

        const event = { tripId, bus: trip.bus, location: trip.liveLocation, stopsWithEta };
        io.to(`trip:${tripId}`).emit("bus:location", event);
        io.emit("admin:bus-location", event);

        if (speed > 60) {
          await createNotification({
            recipient: trip.driver,
            type: "speed_warning",
            message: "Speed warning: bus is above 60 km/h",
            metadata: { tripId }
          });
        }
        ack?.({ ok: true });
      } catch (error) {
        ack?.({ ok: false, message: error.message });
      }
    });

    socket.on("sos", async ({ recipient, message }, ack) => {
      try {
        if (recipient) {
          await createNotification({
            recipient,
            type: "emergency",
            message: message || "SOS alert from bus staff",
            metadata: { from: socket.user._id }
          });
        }
        io.emit("emergency", { from: socket.user.name, message: message || "SOS alert from bus staff" });
        ack?.({ ok: true });
      } catch (error) {
        ack?.({ ok: false, message: error.message });
      }
    });
  });
}
