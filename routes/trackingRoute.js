// routes/trackingRoute.js
import express from "express";
import Tracking from "../models/tracking_model.js";

const router = express.Router();

// Default stages (all done: false)
const defaultStages = [
  { name: "Received at China Warehouse", emoji: "📦", done: false },
  { name: "On the way to Airport", emoji: "🚚", done: false },
  { name: "Departed by Air", emoji: "✈️", done: false },
  { name: "Arrived in BD Airport", emoji: "🛬", done: false },
  { name: "Customs Clearance", emoji: "🛃", done: false },
  { name: "In Delivery Process", emoji: "🏍️", done: false },
  { name: "Delivered", emoji: "🏠", done: false },
];

// ➤ Add new shipment
router.post("/", async (req, res) => {
  try {
    const { trackingNumber, name, transport, stages } = req.body;

    if (!trackingNumber || !name || !transport) {
      return res
        .status(400)
        .json({ error: "Tracking number, name & transport are required." });
    }

    // Use stages if provided, else defaultStages
    const newStages =
      stages && stages.length > 0
        ? stages.map((s) => ({ ...s, done: false }))
        : defaultStages.map((s) => ({ ...s }));

    const newTracking = new Tracking({
      trackingNumber,
      name,
      transport,
      status: newStages[0].name, // প্রথম stage কে default status
      stages: newStages,
      lastUpdated: new Date(),
    });

    await newTracking.save();
    res.status(201).json(newTracking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ Get all shipments
router.get("/", async (req, res) => {
  try {
    const shipments = await Tracking.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get tracking by tracking number
router.get("/:trackingNumber", async (req, res) => {
  try {
    const tracking = await Tracking.findOne({
      trackingNumber: req.params.trackingNumber,
    });
    if (!tracking)
      return res.status(404).json({ message: "Tracking not found" });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Bulk update status + stages
router.put("/bulk-update", async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || ids.length === 0 || !status) {
      return res
        .status(400)
        .json({ error: "IDs array & new status are required" });
    }

    const shipments = await Tracking.find({ _id: { $in: ids } });

    const updatePromises = shipments.map((shipment) => {
      const statusIndex = shipment.stages.findIndex(
        (s) => s.name === status
      );

      const updatedStages = shipment.stages.map((stage, idx) => ({
        ...stage.toObject(),
        done: idx <= statusIndex, // status পর্যন্ত done true
      }));

      return Tracking.findByIdAndUpdate(shipment._id, {
        status,
        stages: updatedStages,
        lastUpdated: new Date(),
      });
    });

    await Promise.all(updatePromises);

    res.json({
      message: "Shipments updated successfully ✅",
      modifiedCount: shipments.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Update single shipment status & stages
router.put("/:trackingNumber/update-status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const shipment = await Tracking.findOne({ trackingNumber: req.params.trackingNumber });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    const statusIndex = shipment.stages.findIndex((s) => s.name === status);

    shipment.stages = shipment.stages.map((stage, idx) => ({
      ...stage.toObject(),
      done: idx <= statusIndex, // status পর্যন্ত done true
    }));

    shipment.status = status;
    shipment.lastUpdated = new Date();

    await shipment.save();
    res.json({ message: "Status and stages updated ✅", shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
