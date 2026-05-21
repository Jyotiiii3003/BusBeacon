import mongoose from "mongoose";
import QRCode from "qrcode";
import { connectDB } from "../config/db.js";
import { Attendance } from "../models/Attendance.js";
import { Bus } from "../models/Bus.js";
import { Notification } from "../models/Notification.js";
import { Parent } from "../models/Parent.js";
import { Route } from "../models/Route.js";
import { Stop } from "../models/Stop.js";
import { Student } from "../models/Student.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";

const password = "Password123!";

async function user(data) {
  return User.create({ password, ...data });
}

async function seed() {
  await connectDB();
  await Promise.all([
    Attendance.deleteMany({}),
    Notification.deleteMany({}),
    Trip.deleteMany({}),
    Bus.deleteMany({}),
    Student.deleteMany({}),
    Parent.deleteMany({}),
    Route.deleteMany({}),
    Stop.deleteMany({}),
    User.deleteMany({})
  ]);

  const admin = await user({ name: "Asha Admin", email: "admin@busbeacon.test", role: "admin", phone: "9000000001" });
  const driver = await user({ name: "Dev Driver", email: "driver@busbeacon.test", role: "driver", phone: "9000000002" });
  const conductor = await user({ name: "Chitra Conductor", email: "conductor@busbeacon.test", role: "conductor", phone: "9000000003" });
  const parentUser = await user({ name: "Priya Parent", email: "parent@busbeacon.test", role: "parent", phone: "9000000004" });
  const studentUser = await user({ name: "Sam Student", email: "student@busbeacon.test", role: "student", phone: "9000000005" });

  const stops = await Stop.insertMany([
    { stopName: "Green Park Gate", latitude: 28.5585, longitude: 77.2066, radius: 150 },
    { stopName: "Metro Colony", latitude: 28.5524, longitude: 77.2032, radius: 150 },
    { stopName: "Sunrise School", latitude: 28.5457, longitude: 77.1928, radius: 180 }
  ]);
  const route = await Route.create({ routeName: "Route A - Green Park", stops: stops.map((stop) => stop._id) });
  const bus = await Bus.create({ busNumber: "BB-101", driver: driver._id, conductor: conductor._id, route: route._id, capacity: 42 });
  const qrCode = `BUSBEACON-STUDENT-${studentUser._id}`;
  const qrDataUrl = await QRCode.toDataURL(qrCode);
  const student = await Student.create({
    user: studentUser._id,
    parent: parentUser._id,
    assignedBus: bus._id,
    assignedRoute: route._id,
    assignedStop: stops[0]._id,
    qrCode,
    grade: "5",
    section: "A"
  });
  await Parent.create({ user: parentUser._id, children: [student._id] });
  await Notification.create({
    recipient: parentUser._id,
    message: "Welcome to BusBeacon. Your child is assigned to BB-101.",
    type: "system"
  });

  console.log("Seed complete");
  console.table([
    ["Admin", admin.email, password],
    ["Driver", driver.email, password],
    ["Conductor", conductor.email, password],
    ["Parent", parentUser.email, password],
    ["Student", studentUser.email, password]
  ]);
  console.log("Sample QR value:", qrCode);
  console.log("Sample QR data URL:", qrDataUrl.slice(0, 80) + "...");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
