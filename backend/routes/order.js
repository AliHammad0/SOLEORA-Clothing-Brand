
import express from "express";
import {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controller/order.js";
import { verifyAdmin } from "../middleware/auth.js";

const orderRoutes = express.Router();

// Guest checkout — login required nahi
orderRoutes.post("/place", placeOrder);

// Admin only
orderRoutes.get("/all", verifyAdmin, getAllOrders);
orderRoutes.put("/:id/status", verifyAdmin, updateOrderStatus);

export default orderRoutes;
