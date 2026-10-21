
import mongoose from "mongoose";
import Order from "../model/order.js";
import Product from "../model/product.js";
import StockReservation from "../model/stockReservation.js";

const SHIPPING_FEE = 250;
const FREE_SHIPPING_LIMIT = 5000;

// Place Order — Guest Checkout Allowed
export const placeOrder = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      postalCode,
      items,
      notes,
    } = req.body;

    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        ok: false,
        message: "Please complete all required delivery details",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Your cart is empty",
      });
    }

    if (items.length > 50) {
      return res.status(400).json({
        ok: false,
        message: "Too many products in one order",
      });
    }

    const orderItems = [];
    let subtotal = 0;
    const seenProducts = new Set();

    for (const item of items) {
      const productId = String(item.productId || "");
      const reservationId = String(item.reservationId || "");
      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(productId) ||
        !mongoose.isValidObjectId(reservationId) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        seenProducts.has(productId)
      ) {
        return res.status(400).json({
          ok: false,
          message: "Invalid or duplicate cart item",
        });
      }

      seenProducts.add(productId);

      const reservation = await StockReservation.findOne({
        _id: reservationId,
        product: productId,
        quantity,
        status: "active",
      });

      if (!reservation) {
        return res.status(409).json({
          ok: false,
          message: "A product reservation has expired or is invalid. Please update your cart.",
        });
      }

      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return res.status(409).json({
          ok: false,
          message: "A product is no longer available",
        });
      }

      const price =
        Number(product.specialPrice) > 0 &&
        Number(product.specialPrice) < Number(product.price)
          ? Number(product.specialPrice)
          : Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          ok: false,
          message: "Invalid product price",
        });
      }

      const lineTotal = price * quantity;

      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: Array.isArray(product.images)
          ? product.images[0] || ""
          : "",
        quantity,
        size: item.size || "",
        color: item.color || "",
        price,
        reservationId: reservation._id,
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    const shippingFee =
      subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    const total = Number((subtotal + shippingFee).toFixed(2));

    const orderNumber = `SOL-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await Order.create({
      orderNumber,
      customer: {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      shippingAddress: {
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode?.trim() || "",
        country: "Pakistan",
      },
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      paymentMethod: "COD",
      paymentStatus: "pending",
      status: "pending",
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    const reservationIds = orderItems.map(
      (item) => item.reservationId
    );

    const updatedReservations = await StockReservation.updateMany(
      {
        _id: { $in: reservationIds },
        status: "active",
      },
      {
        $set: { status: "released" },
      }
    );

    if (updatedReservations.modifiedCount !== reservationIds.length) {
      await Order.findByIdAndDelete(order._id);

      return res.status(409).json({
        ok: false,
        message: "Cart stock reservations changed. Please update your cart and try again.",
      });
    }

    return res.status(201).json({
      ok: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to place order. Please try again.",
    });
  }
};

// Get All Orders — Admin Dashboard
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "title images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to load orders",
    });
  }
};

// Update Order Status — Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({
        ok: false,
        message: "This order can no longer be updated",
      });
    }

    if (status === "cancelled") {
      for (const item of order.items) {
        if (!item.reservationId) continue;

        const reservation = await StockReservation.findOneAndUpdate(
          {
            _id: item.reservationId,
            status: "released",
          },
          {
            $set: { status: "active" },
          },
          { new: true }
        );

        if (reservation) {
          await Product.findByIdAndUpdate(reservation.product, {
            $inc: { stock: reservation.quantity },
          });

          await StockReservation.updateOne(
            { _id: reservation._id, status: "active" },
            { $set: { status: "released" } }
          );
        }
      }
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      ok: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to update order status",
    });
  }
};
