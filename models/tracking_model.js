// models/tracking_model.js
import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
  name: String,
  emoji: String,
  done: { type: Boolean, default: false },
});

const trackingSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  transport: {
    type: String,
    enum: ["Air", "Sea"],
    required: true,
  },
  status: {
    type: String,
    default: "Received at China Warehouse", // ✅ নতুন ফিল্ড
  },
  stages: [stageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;
