import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },
    description: String,
    stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }]
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);
