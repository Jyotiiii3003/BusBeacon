import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { attendanceRoutes } from "./routes/attendanceRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { resourceRoutes } from "./routes/resourceRoutes.js";
import { tripRoutes } from "./routes/tripRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500 }));

app.get("/health", (req, res) => res.json({ ok: true, name: "BusBeacon API" }));
app.use("/api/auth", authRoutes);
app.use("/api", resourceRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(notFound);
app.use(errorHandler);
