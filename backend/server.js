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
  "https://soleora-clothing-brand-git-clean-main-trade-rank-media.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
  res.status(200).json({
    ok: true,
    message: "SOLEORA Server is running successfully",
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.message === "Not allowed by CORS" ? 403 : 500).json({
    ok: false,
    message:
      err.message === "Not allowed by CORS"
        ? "Origin not allowed"
        : "Internal server error",
  });
});

export default app;
