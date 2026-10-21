
import express from "express";
import {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  deleteCancelledOrder,
} from "../controller/order.js";
import { verifyAdmin } from "../middleware/auth.js";

const orderRoutes = express.Router();

orderRoutes.post("/place", placeOrder);
orderRoutes.get("/all", verifyAdmin, getAllOrders);
orderRoutes.put("/:id/status", verifyAdmin, updateOrderStatus);
orderRoutes.delete("/:id", verifyAdmin, deleteCancelledOrder);

export default orderRoutes;
