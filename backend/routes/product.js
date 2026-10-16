
import express from "express";
import * as Product from "../controller/product.js";
import {
  verifyToken,
  verifyAdmin,
} from "../middleware/authMiddleware.js";

const productRoutes = express.Router();

// Public routes
productRoutes.get("/all", Product.getAllProducts);
productRoutes.get("/new", Product.getNewArrivals);
productRoutes.get("/special", Product.getSpecialPrices);
productRoutes.get("/:id", Product.getSingleProduct);

// Admin-only routes
productRoutes.post(
  "/create",
  verifyToken,
  verifyAdmin,
  Product.createProduct
);

productRoutes.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  Product.updateProduct
);

productRoutes.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  Product.deleteProduct
);

export default productRoutes;
