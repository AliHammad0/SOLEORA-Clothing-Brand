
import express from "express";
import * as Product from "../controller/product.js";

const productRoutes = express.Router();

productRoutes.route("/create").post(Product.createProduct);

productRoutes.route("/all").get(Product.getAllProducts);

// New Arrivals
productRoutes.route("/new").get(Product.getNewArrivals);
productRoutes.route("/special").get(Product.getSpecialPrices);

// Single Product
productRoutes.route("/:id").get(Product.getSingleProduct);
productRoutes.route("/:id").put(Product.updateProduct);
productRoutes.route("/:id").delete(Product.deleteProduct);

export default productRoutes;
