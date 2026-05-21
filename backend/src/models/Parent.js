import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
  },
  { timestamps: true }
);

export const Parent = mongoose.model("Parent", parentSchema);
