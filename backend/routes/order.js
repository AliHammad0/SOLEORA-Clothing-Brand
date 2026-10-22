
import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteCancelledOrder,
  deleteMyOrder,
  getGuestOrderStatus,
} from "../controller/order.js";

import {
  verifyAdmin,
  verifyUser,
} from "../middleware/auth.js";

const orderRoutes = express.Router();

const optionalUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return verifyUser(req, res, next);
  }

  next();
};

orderRoutes.post("/place", optionalUser, placeOrder);

orderRoutes.get("/my", verifyUser, getMyOrders);

orderRoutes.get("/guest-status", getGuestOrderStatus);

// Customer: apne pending ya cancelled order ko delete kar sakta hai.
orderRoutes.delete("/my/:id", verifyUser, deleteMyOrder);

// Admin routes
orderRoutes.get("/all", verifyAdmin, getAllOrders);

orderRoutes.put("/:id/status", verifyAdmin, updateOrderStatus);

orderRoutes.delete("/:id", verifyAdmin, deleteCancelledOrder);

export default orderRoutes;
