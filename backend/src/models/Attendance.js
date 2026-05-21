import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop", required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["boarded", "absent", "missed"], default: "boarded" }
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, trip: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
