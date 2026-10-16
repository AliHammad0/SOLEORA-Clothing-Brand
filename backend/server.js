import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import * as config from "./config/config.js";
import productRoutes from "./routes/product.js";
import userRouter from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

let connectionPromise;

const connectDB = async () => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(config.MONGO, { serverSelectionTimeoutMS: 10000 })
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
    res.status(500).json({
      ok: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("SOLEORA Server is running successfully");
});

export default app;