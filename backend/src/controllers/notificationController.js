import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );
  res.json(notification);
});

export const emergencyAlert = asyncHandler(async (req, res) => {
  const { recipient, message } = req.body;
  const notification = await createNotification({
    recipient,
    type: "emergency",
    message: message || "Emergency alert from BusBeacon",
    metadata: { from: req.user._id }
  });
  res.status(201).json(notification);
});
