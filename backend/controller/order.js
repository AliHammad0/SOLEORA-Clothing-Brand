
import mongoose from "mongoose";
import Order from "../model/order.js";
import Product from "../model/product.js";
import StockReservation from "../model/stockReservation.js";

const SHIPPING_FEE = 250;
const FREE_SHIPPING_LIMIT = 5000;

const releaseAndRestoreReservation = async (reservationId, productId) => {
  const reservation = await StockReservation.findOneAndUpdate(
    {
      _id: reservationId,
      product: productId,
      status: "active",
    },
    {
      $set: { status: "released" },
    },
    { new: true }
  );

  if (!reservation) return;

  const result = await Product.updateOne(
    { _id: reservation.product },
    { $inc: { stock: reservation.quantity } }
  );

  if (result.modifiedCount !== 1) {
    await StockReservation.updateOne(
      { _id: reservation._id, status: "released" },
      { $set: { status: "active" } }
    );

    throw new Error("Could not restore reserved stock.");
  }
};

const createFreshReservation = async (productId, quantity) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
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
    const error = new Error(
      "Insufficient stock. Please reduce the quantity and try again."
    );
    error.statusCode = 409;
    throw error;
  }

  try {
    const reservation = await StockReservation.create({
      product: product._id,
      quantity,
      status: "active",
    });

    return reservation;
  } catch (error) {
    await Product.updateOne(
      { _id: product._id },
      { $inc: { stock: quantity } }
    );

    throw error;
  }
};

// Place Order — Guest Checkout Allowed
export const placeOrder = async (req, res) => {
  const rollbackReservationIds = new Set();

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
        message: "Please complete all required delivery details.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({
        ok: false,
        message: "Your cart is empty or contains too many products.",
      });
    }

    const seenProducts = new Set();
    const normalizedItems = [];

    // Validate cart before changing stock.
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
          message: "Invalid or duplicate cart item.",
        });
      }

      seenProducts.add(productId);

      const product = await Product.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return res.status(409).json({
          ok: false,
          message: "A product is no longer available.",
        });
      }

      // Updated price validation only.
      const regularPrice = Number(product.price);
      const specialPrice = product.specialPrice;

      const hasValidRegularPrice =
        Number.isFinite(regularPrice) && regularPrice > 0;

      const hasValidSpecialPrice =
        specialPrice !== null &&
        specialPrice !== undefined &&
        Number.isFinite(Number(specialPrice)) &&
        Number(specialPrice) > 0 &&
        hasValidRegularPrice &&
        Number(specialPrice) < regularPrice;

      const price = hasValidSpecialPrice
        ? Number(specialPrice)
        : regularPrice;

      if (
        !hasValidRegularPrice ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        return res.status(400).json({
          ok: false,
          message: `Invalid price for ${product.title}.`,
        });
      }

      normalizedItems.push({
        product,
        productId,
        quantity,
        price,
        size:
          typeof item.size === "string"
            ? item.size
            : item.size?.name || "",
        color:
          typeof item.color === "string"
            ? item.color
            : item.color?.name || "",
        suppliedReservations: Array.isArray(item.reservations)
          ? item.reservations
          : item.reservationId
            ? [
                {
                  reservationId: item.reservationId,
                  quantity,
                },
              ]
            : [],
      });
    }

    const orderItems = [];
    const allReservationIds = new Set();
    let subtotal = 0;

    for (const item of normalizedItems) {
      const {
        product,
        productId,
        quantity,
        suppliedReservations,
      } = item;

      const uniqueIds = [
        ...new Set(
          suppliedReservations
            .map((entry) => String(entry?.reservationId || ""))
            .filter((id) => mongoose.isValidObjectId(id))
        ),
      ];

      let validReservations = [];
      let reservedQuantity = 0;
      let reservationListIsValid =
        uniqueIds.length === suppliedReservations.length &&
        uniqueIds.length > 0;

      // Check whether the cart's existing reservations are still active.
      if (reservationListIsValid) {
        for (const entry of suppliedReservations) {
          const reservationId = String(entry.reservationId);
          const entryQuantity = Number(entry.quantity);

          if (
            !Number.isSafeInteger(entryQuantity) ||
            entryQuantity < 1 ||
            allReservationIds.has(reservationId)
          ) {
            reservationListIsValid = false;
            break;
          }

          const reservation = await StockReservation.findOne({
            _id: reservationId,
            product: productId,
            quantity: entryQuantity,
            status: "active",
          });

          if (!reservation) {
            reservationListIsValid = false;
            break;
          }

          validReservations.push(reservation);
          reservedQuantity += reservation.quantity;
        }

        if (reservedQuantity !== quantity) {
          reservationListIsValid = false;
        }
      }

      if (!reservationListIsValid) {
        // Release any matching active reservations before reserving again.
        for (const reservation of validReservations) {
          await releaseAndRestoreReservation(
            reservation._id,
            productId
          );
        }

        validReservations = [];

        // A missing/stale cart reservation should not block checkout.
        const freshReservation = await createFreshReservation(
          productId,
          quantity
        );

        validReservations = [freshReservation];
        rollbackReservationIds.add(String(freshReservation._id));
      } else {
        for (const reservation of validReservations) {
          rollbackReservationIds.add(String(reservation._id));
        }
      }

      const itemReservationIds = validReservations.map((reservation) =>
        String(reservation._id)
      );

      for (const reservationId of itemReservationIds) {
        if (allReservationIds.has(reservationId)) {
          throw new Error("A stock reservation cannot be reused.");
        }

        allReservationIds.add(reservationId);
      }

      subtotal += item.price * quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: Array.isArray(product.images)
          ? product.images[0] || ""
          : "",
        quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        reservationIds: itemReservationIds,
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    const shippingFee =
      subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    const total = Number((subtotal + shippingFee).toFixed(2));

    let customerUser = null;

    if (req.user?._id) {
      customerUser = req.user._id;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Please login again to place your order.",
      });
    }

    const orderNumber = `SOL-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

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

      // Restore stock for reservations finalized during this failed attempt.
      for (const reservationId of reservationIds) {
        const reservation = await StockReservation.findById(
          reservationId
        );

        if (reservation?.status === "released") {
          const product = await Product.findByIdAndUpdate(
            reservation.product,
            { $inc: { stock: reservation.quantity } },
            { new: true }
          );

          if (product) {
            await StockReservation.updateOne(
              { _id: reservationId, status: "released" },
              { $set: { status: "restored" } }
            );
          }
        }
      }

      rollbackReservationIds.clear();

      return res.status(409).json({
        ok: false,
        message: "Stock changed during checkout. Please try again.",
      });
    }

    rollbackReservationIds.clear();

    return res.status(201).json({
      ok: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);

    // If order creation fails, restore stock reserved for this attempt.
    for (const reservationId of rollbackReservationIds) {
      try {
        await releaseAndRestoreReservation(
          reservationId,
          (await StockReservation.findById(reservationId))?.product
        );
      } catch (restoreError) {
        console.error("Stock rollback error:", restoreError);
      }
    }

    return res.status(error.statusCode || 500).json({
      ok: false,
      message:
        error.statusCode === 409
          ? error.message
          : "Failed to place order. Please try again.",
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
              $set: { status: "restored" },
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
    const order = await Order.findById(req.params.id);

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

    await Order.findByIdAndDelete(order._id);

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
