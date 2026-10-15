
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

// Get Single Product - Public
productRoutes.route("/:id").get(Product.getSingleProduct);

// Update Product - Admin Only
productRoutes.route("/:id").put(verifyAdmin, Product.updateProduct);

// Delete Product - Admin Only
productRoutes.route("/:id").delete(verifyAdmin, Product.deleteProduct);

export default productRoutes;
