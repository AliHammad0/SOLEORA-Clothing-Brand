import StockReservation from "../model/stockReservation.js";
import Product from "../model/product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      price,
      specialPrice,
      discount,
      brand,
      category,
      images,
      stock,
      sizes,
      colors,
      gender,
      isFeatured,
      isNewArrival,
      isActive,
    } = req.body;

    if (
      !title ||
      !description ||
      price == null ||
      price === "" ||
      !category
    ) {
      return res.status(400).json({
        ok: false,
        message: "Please provide title, description, price and category",
      });
    }

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      specialPrice: specialPrice ?? null,
      discount: discount ?? 0,
      brand,
      category,
      images,
      stock,
      sizes,
      colors,
      gender,
      isFeatured: isFeatured ?? false,
      isNewArrival: isNewArrival ?? false,
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      ok: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "A product with this slug already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Get New Arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 8, 1),
      50
    );

    const products = await Product.find({
      isActive: true,
      isNewArrival: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Get Special Prices
export const getSpecialPrices = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 8, 1),
      50
    );

    const products = await Product.find({
      isActive: true,
      $expr: {
        $and: [
          { $gt: ["$specialPrice", 0] },
          { $lt: ["$specialPrice", "$price"] },
        ],
      },
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      ok: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "Invalid product ID",
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
};

// Search Products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({
        ok: true,
        products: [],
      });
    }

    const keyword = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await Product.find({
      isActive: true,
      $or: [
        { title: { $regex: `^${keyword}`, $options: "i" } },
        { brand: { $regex: `^${keyword}`, $options: "i" } },
        { category: { $regex: `^${keyword}`, $options: "i" } },
      ],
    }).limit(8);

    return res.status(200).json({
      ok: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Product search failed",
      error: error.message,
    });
  }
};

// Reserve Product Stock
export const reserveProductStock = async (req, res) => {
  let reservedProductId = null;
  let reservedQuantity = 0;

  try {
    const { id } = req.params;
    const quantity = Number(req.body?.quantity ?? 1);

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID",
      });
    }

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        ok: false,
        message: "Quantity must be a positive whole number",
      });
    }

    // Atomically decrement only if enough stock is available.
    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        stock: { $gte: quantity },
      },
      {
        $inc: { stock: -quantity },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(409).json({
        ok: false,
        message: "Product unavailable or insufficient stock",
      });
    }

    reservedProductId = product._id;
    reservedQuantity = quantity;

    const reservation = await StockReservation.create({
      product: product._id,
      quantity,
      status: "active",
    });

    if (!reservation?._id) {
      throw new Error("Reservation record was not created");
    }

    return res.status(200).json({
      ok: true,
      message: "Stock reserved successfully",
      product,
      reservationId: String(reservation._id),
      reservedQuantity: reservation.quantity,
      availableStock: product.stock,
    });
  } catch (error) {
    // Restore stock if reservation creation failed after deduction.
    if (reservedProductId && reservedQuantity > 0) {
      try {
        await Product.updateOne(
          { _id: reservedProductId },
          { $inc: { stock: reservedQuantity } }
        );
      } catch (restoreError) {
        console.error("Stock compensation failed:", restoreError);
      }
    }

    console.error("Stock reservation error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to reserve stock",
    });
  }
};

// Release Product Stock
export const releaseProductStock = async (req, res) => {
  try {
    const { reservationId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(reservationId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid reservation ID",
      });
    }

    // Only one request can release an active reservation.
    const reservation = await StockReservation.findOneAndUpdate(
      {
        _id: reservationId,
        status: "active",
      },
      {
        $set: { status: "released" },
      },
      {
        new: true,
      }
    );

    if (!reservation) {
      return res.status(200).json({
        ok: true,
        message: "Reservation already released or not found",
        restoredQuantity: 0,
      });
    }

    const product = await Product.findByIdAndUpdate(
      reservation.product,
      {
        $inc: { stock: reservation.quantity },
      },
      {
        new: true,
      }
    );

    if (!product) {
      // Allow retry if the product could not be found.
      await StockReservation.updateOne(
        {
          _id: reservation._id,
          status: "released",
        },
        {
          $set: { status: "active" },
        }
      );

      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Stock restored successfully",
      product,
      reservationId: String(reservation._id),
      restoredQuantity: reservation.quantity,
      availableStock: product.stock,
    });
  } catch (error) {
    console.error("Stock release error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to restore stock",
    });
  }
};