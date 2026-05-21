import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, trim: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    activeTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    capacity: { type: Number, default: 40 },
    status: { type: String, enum: ["inactive", "active", "maintenance"], default: "inactive" }
  },
  { timestamps: true }
);

export const Bus = mongoose.model("Bus", busSchema);
