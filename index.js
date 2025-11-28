// index.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import trackingRoute from "./routes/trackingRoute.js";
import authRoute from "./routes/authRoute.js";
const app = express();


// CORS enable

dotenv.config();


app.use(cors());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // JSON body parse
app.use(express.urlencoded({ extended: true })); // Form data parse


app.use("/api/tracking", trackingRoute);
app.use("/api/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Failed", err));
