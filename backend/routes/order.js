
import express from "express";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteCancelledOrder,
  deleteMyCancelledOrder,
  getGuestOrderStatus,
} from "../controller/order.js";

import {
  verifyAdmin,
  verifyUser,
} from "../middleware/auth.js";

const orderRoutes = express.Router();

// Guest checkout aur logged-in checkout dono support honge.
const optionalUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return verifyUser(req, res, next);
  }

  next();
};

// Place order
orderRoutes.post("/place", optionalUser, placeOrder);

// Logged-in customer ke orders
orderRoutes.get("/my", verifyUser, getMyOrders);

// Guest order status
orderRoutes.get("/guest-status", getGuestOrderStatus);

// Customer sirf apna cancelled order delete kar sakta hai.
orderRoutes.delete(
  "/my/:id",
  verifyUser,
  deleteMyCancelledOrder
);

// Admin routes
orderRoutes.get("/all", verifyAdmin, getAllOrders);

orderRoutes.put(
  "/:id/status",
  verifyAdmin,
  updateOrderStatus
);

orderRoutes.delete(
  "/:id",
  verifyAdmin,
  deleteCancelledOrder
);

export default orderRoutes;
