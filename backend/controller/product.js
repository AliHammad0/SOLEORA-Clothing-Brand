import Product from "../model/product.js";

// Create Product Controller

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


// New Arrivals Controller
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

// Limited Time Offers - Special Prices Controller
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

// Get Single Product Controller
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
    return res.status(500).json({
      ok: false,
      message: error.message,
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
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// Delete Product Controller
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
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};



///Search Product Controller
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

// Atomically reserve one item when adding to cart
export const reserveProductStock = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        stock: { $gte: 1 },
      },
      {
        $inc: { stock: -1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      const existingProduct = await Product.findById(id);

      if (!existingProduct) {
        return res.status(404).json({
          ok: false,
          message: "Product not found",
        });
      }

      return res.status(409).json({
        ok: false,
        message: "Product is out of stock",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Stock reserved successfully",
      product,
      availableStock: product.stock,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to reserve stock",
    });
  }
};

