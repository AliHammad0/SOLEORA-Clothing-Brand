import express from "express";
import * as Product from "../controller/product.js";
import { verifyAdmin } from "../middleware/auth.js";

const productRoutes = express.Router();

// Create Product - Admin Only
productRoutes.route("/create").post(verifyAdmin, Product.createProduct);

// Get All Products - Public
productRoutes.route("/all").get(Product.getAllProducts);

// New Arrivals - Public
productRoutes.route("/new").get(Product.getNewArrivals);

// Special Prices - Public
productRoutes.route("/special").get(Product.getSpecialPrices);

// Search Products - Public
productRoutes.route("/search").get(Product.searchProducts);

// Release reservation - must be before generic /:id routes
productRoutes
  .route("/reservations/:reservationId/release")
  .post(Product.releaseProductStock);

// Reserve stock when adding to cart
productRoutes
  .route("/:id/reserve")
  .post(Product.reserveProductStock);

// Update Product - Admin Only
productRoutes.route("/:id").put(Product.updateProduct);

// Delete Product - Admin Only
productRoutes.route("/:id").delete(verifyAdmin, Product.deleteProduct);

// Get Single Product - Public (keep last)
productRoutes.route("/:id").get(Product.getSingleProduct);

export default productRoutes;