import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    assignedStop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop", required: true },
    qrCode: { type: String, required: true, unique: true },
    grade: String,
    section: String
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
