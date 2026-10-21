
import express from "express";
import {
  placeOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  deleteCancelledOrder,
} from "../controller/order.js";

import { verifyAdmin, verifyUser } from "../middleware/auth.js";

const orderRoutes = express.Router();

// Customer orders
orderRoutes.get("/my-orders", verifyUser, getMyOrders);

// Place order — guest checkout allowed
orderRoutes.post("/place", (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return verifyUser(req, res, next);
  }

  next();
}, placeOrder);

// Admin orders
orderRoutes.get("/all", verifyAdmin, getAllOrders);
orderRoutes.put("/:id/status", verifyAdmin, updateOrderStatus);
orderRoutes.delete("/:id", verifyAdmin, deleteCancelledOrder);

export default orderRoutes;
