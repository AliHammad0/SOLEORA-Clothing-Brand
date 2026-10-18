
import mongoose from "mongoose";
import * as config from "./config.js";

const DBconfig = async () => {
  try {
    await mongoose.connect(config.MONGO);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default DBconfig;
