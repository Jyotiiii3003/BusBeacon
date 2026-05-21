import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    stopName: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, default: 150, min: 50, max: 500 }
  },
  { timestamps: true }
);

export const Stop = mongoose.model("Stop", stopSchema);
