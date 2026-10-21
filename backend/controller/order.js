
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

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({
        ok: false,
        message: "Your cart is empty or contains too many products",
      });
    }

    const orderItems = [];
    const allReservationIds = new Set();
    const seenProducts = new Set();
    let subtotal = 0;

    for (const item of items) {
      const productId = String(item.productId || "");
      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(productId) ||
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

      const reservations = Array.isArray(item.reservations)
        ? item.reservations
        : item.reservationId
          ? [{ reservationId: item.reservationId, quantity }]
          : [];

      if (!reservations.length) {
        return res.status(409).json({
          ok: false,
          message: "Product reservation missing. Please add the product again.",
        });
      }

      let reservedQuantity = 0;
      const itemReservationIds = [];

      for (const entry of reservations) {
        const reservationId = String(entry.reservationId || "");
        const reservationQuantity = Number(entry.quantity);

        if (
          !mongoose.isValidObjectId(reservationId) ||
          !Number.isSafeInteger(reservationQuantity) ||
          reservationQuantity < 1 ||
          allReservationIds.has(reservationId)
        ) {
          return res.status(400).json({
            ok: false,
            message: "Invalid stock reservation",
          });
        }

        const reservation = await StockReservation.findOne({
          _id: reservationId,
          product: productId,
          quantity: reservationQuantity,
          status: "active",
        });

        if (!reservation) {
          return res.status(409).json({
            ok: false,
            message:
              "A stock reservation has expired or is invalid. Please update your cart.",
          });
        }

        allReservationIds.add(reservationId);
        itemReservationIds.push(reservation._id);
        reservedQuantity += reservation.quantity;
      }

      if (reservedQuantity !== quantity) {
        return res.status(409).json({
          ok: false,
          message:
            "Cart quantity does not match reserved stock. Please update your cart.",
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

      const regularPrice = Number(product.price);
      const specialPrice = Number(product.specialPrice);

      const price =
        Number.isFinite(specialPrice) &&
        specialPrice > 0 &&
        specialPrice < regularPrice
          ? specialPrice
          : regularPrice;

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          ok: false,
          message: "Invalid product price",
        });
      }

      subtotal += price * quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: Array.isArray(product.images) ? product.images[0] || "" : "",
        quantity,
        size: typeof item.size === "string" ? item.size : "",
        color: typeof item.color === "string" ? item.color : "",
        price,
        reservationIds: itemReservationIds,
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    const shippingFee =
      subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    const total = Number((subtotal + shippingFee).toFixed(2));

    const orderNumber = `SOL-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // If the customer is logged in, link the order to their account.
    // Guest checkout remains available.
    let customerUser = null;

    if (req.user?._id) {
      customerUser = req.user._id;
    } else {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          ok: false,
          message: "Please login again to place your order",
        });
      }
    }

    const order = await Order.create({
      orderNumber,
      customer: {
        user: customerUser,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      },
      shippingAddress: {
        address: address.trim(),
        city: city.trim(),
        postalCode:
          typeof postalCode === "string" ? postalCode.trim() : "",
        country: "Pakistan",
      },
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      paymentMethod: "COD",
      paymentStatus: "pending",
      status: "pending",
      notes: typeof notes === "string" ? notes.trim().slice(0, 500) : "",
    });

    const reservationIds = [...allReservationIds];

    const finalized = await StockReservation.updateMany(
      {
        _id: { $in: reservationIds },
        status: "active",
      },
      {
        $set: { status: "released" },
      }
    );

    if (finalized.modifiedCount !== reservationIds.length) {
      await Order.findByIdAndDelete(order._id);

      return res.status(409).json({
        ok: false,
        message:
          "Stock reservations changed. Please refresh your cart and try again.",
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

// Get All Orders — Admin
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

// Get My Orders — Logged-in Customer
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.user": req.user._id,
    })
      .populate("items.product", "title images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to load your orders",
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
        const reservationIds = Array.isArray(item.reservationIds)
          ? item.reservationIds
          : item.reservationId
            ? [item.reservationId]
            : [];

        for (const reservationId of reservationIds) {
          const reservation = await StockReservation.findOneAndUpdate(
            {
              _id: reservationId,
              product: item.product,
              status: "released",
            },
            {
              $set: { status: "active" },
            },
            { new: true }
          );

          if (!reservation) continue;

          await Product.findByIdAndUpdate(reservation.product, {
            $inc: { stock: reservation.quantity },
          });

          await StockReservation.updateOne(
            {
              _id: reservation._id,
              status: "active",
            },
            {
              $set: { status: "released" },
            }
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

// Delete Cancelled Order — Admin
export const deleteCancelledOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    if (order.status !== "cancelled") {
      return res.status(400).json({
        ok: false,
        message: "Only cancelled orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      ok: true,
      message: "Cancelled order permanently deleted",
    });
  } catch (error) {
    console.error("Delete cancelled order error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to delete cancelled order",
    });
  }
};
