
import mongoose from "mongoose";

const stockReservationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["active", "released", "restored"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "StockReservation",
  stockReservationSchema
);
