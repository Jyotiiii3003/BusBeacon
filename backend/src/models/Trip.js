import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
    speed: Number,
    heading: Number,
    timestamp: Date
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    liveLocation: locationSchema,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);
