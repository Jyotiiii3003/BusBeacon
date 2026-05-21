import { Router } from "express";
import { login, me, register, saveFcmToken } from "../controllers/authController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/fcm-token", requireAuth, saveFcmToken);
authRoutes.post("/staff", requireAuth, allowRoles("admin"), register);
