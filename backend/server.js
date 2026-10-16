
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import * as config from "./config/config.js";
import productRoutes from "./routes/product.js";
import userRouter from "./routes/users.js";

const app = express();

const allowedOrigins = [
  "https://soleora-clothing-brand.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan("dev"));

let connectionPromise;

const connectDB = async () => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(config.MONGO, {
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("SOLEORA Server is running successfully");
});

export default app;
