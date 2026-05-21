import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/tokens.js";
import { User } from "../models/User.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "parent", phone } = req.body;
  const user = await User.create({ name, email, password, role, phone });
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ user: publicUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const saveFcmToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (token && !req.user.fcmTokens.includes(token)) {
    req.user.fcmTokens.push(token);
    await req.user.save();
  }
  res.json({ message: "FCM token saved" });
});
