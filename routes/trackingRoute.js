//trackingRoute.js - শিপমেন্ট ট্র্যাকিং সম্পর্কিত রাউটস

import express from "express";
import Tracking from "../models/tracking_model.js";

const router = express.Router();

// ডিফল্ট স্টেজগুলো বাংলায় (ফ্রন্টএন্ডের সাথে মিল রেখে)
const defaultStages = [
  { name: "চায়না ওয়ারহাউসে গ্রহণ করা হয়েছে", emoji: "📦", done: false },
  { name: "এয়ারপোর্টের পথে", emoji: "🚚", done: false },
  { name: "বিমানে রওনা হয়েছে", emoji: "✈️", done: false },
  { name: "বাংলাদেশ এয়ারপোর্টে পৌঁছেছে", emoji: "🛬", done: false },
  { name: "কাস্টমস ক্লিয়ারেন্স চলছে", emoji: "🛃", done: false },
  { name: "ডেলিভারি প্রক্রিয়াধীন", emoji: "🏍️", done: false },
  { name: "ডেলিভারি সম্পন্ন", emoji: "🏠", done: false },
];

// ➤ নতুন শিপমেন্ট যোগ করা
router.post("/", async (req, res) => {
  try {
    const {
      trackingNumber,
      name,
      transport,
      totalCartoons,
      weight,
      cbm,
      recivedDate,
      stages,
    } = req.body;

    if (!trackingNumber || !name || !transport) {
      return res
        .status(400)
        .json({
          error: "ট্র্যাকিং নম্বর, নাম এবং পরিবহনের মাধ্যম প্রদান করা আবশ্যক।",
        });
    }

    const newStages =
      stages && stages.length > 0
        ? stages.map((s) => ({ ...s, done: false }))
        : defaultStages.map((s) => ({ ...s }));

    const newTracking = new Tracking({
      trackingNumber,
      name,
      transport,
      totalCartoons,
      weight,
      cbm,
      recivedDate,
      status: newStages[0].name,
      stages: newStages,
      lastUpdated: new Date(),
    });

    await newTracking.save();
    res.status(201).json(newTracking);
  } catch (err) {
    res
      .status(400)
      .json({ error: "শিপমেন্ট তৈরি করতে সমস্যা হয়েছে: " + err.message });
  }
});

// ➤ সব শিপমেন্ট দেখা
router.get("/", async (req, res) => {
  try {
    const shipments = await Tracking.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: "তথ্য লোড করতে সমস্যা হয়েছে।" });
  }
});

// ➤ ট্র্যাকিং নম্বর দিয়ে সার্চ করা
router.get("/:trackingNumber", async (req, res) => {
  try {
    const tracking = await Tracking.findOne({
      trackingNumber: req.params.trackingNumber,
    });
    if (!tracking)
      return res
        .status(404)
        .json({
          message: "দুঃখিত, এই ট্র্যাকিং নম্বরের কোনো তথ্য পাওয়া যায়নি।",
        });
    res.json(tracking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ একসাথে অনেকগুলো শিপমেন্ট আপডেট করা (Bulk Update)
router.put("/bulk-update", async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || ids.length === 0 || !status) {
      return res
        .status(400)
        .json({ error: "আইডি এবং নতুন স্ট্যাটাস প্রদান করা আবশ্যক।" });
    }

    const shipments = await Tracking.find({ _id: { $in: ids } });

    const updatePromises = shipments.map((shipment) => {
      const statusIndex = shipment.stages.findIndex((s) => s.name === status);

      const updatedStages = shipment.stages.map((stage, idx) => ({
        ...stage.toObject(),
        done: idx <= statusIndex, // স্ট্যাটাস পর্যন্ত সব ধাপ 'done: true' হবে
      }));

      return Tracking.findByIdAndUpdate(shipment._id, {
        status,
        stages: updatedStages,
        lastUpdated: new Date(),
      });
    });

    await Promise.all(updatePromises);

    res.json({
      message: "শিপমেন্টগুলো সফলভাবে আপডেট করা হয়েছে ✅",
      modifiedCount: shipments.length,
    });
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

// ➤ একটি নির্দিষ্ট শিপমেন্টের স্ট্যাটাস আপডেট করা
router.put("/:trackingNumber/update-status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "স্ট্যাটাস প্রয়োজন।" });

    const shipment = await Tracking.findOne({
      trackingNumber: req.params.trackingNumber,
    });
    if (!shipment)
      return res.status(404).json({ message: "শিপমেন্ট পাওয়া যায়নি।" });

    const statusIndex = shipment.stages.findIndex((s) => s.name === status);

    shipment.stages = shipment.stages.map((stage, idx) => ({
      ...stage.toObject(),
      done: idx <= statusIndex,
    }));

    shipment.status = status;
    shipment.lastUpdated = new Date();

    await shipment.save();
    res.json({ message: "স্ট্যাটাস সফলভাবে আপডেট হয়েছে ✅", shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
