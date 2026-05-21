import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["boarded", "near_stop", "reached_school", "absent", "emergency", "speed_warning", "system"],
      default: "system"
    },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
