
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  clearCart,
} from "../redux/slices/cartSlice";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const FREE_SHIPPING_LIMIT = 5000;
const SHIPPING_CHARGE = 250;
const GUEST_ORDERS_KEY = "soleora-orders";

const getProductId = (item) =>
  item.productId ||
  item.product?._id ||
  item._id ||
  item.id ||
  "";

const getPrice = (item) =>
  Number(
    item.specialPrice ??
      item.product?.specialPrice ??
      item.price ??
      item.product?.price ??
      0
  );

const getImage = (item) =>
  item.images?.[0] ||
  item.image ||
  item.product?.images?.[0] ||
  "";

const getSize = (item) =>
  typeof item.size === "object"
    ? item.size?.name || ""
    : item.size || "";

const getColor = (item) =>
  typeof item.color === "object"
    ? item.color?.name || ""
    : item.color || "";

const saveGuestOrder = (
  order,
  cartItems,
  totals,
  customerEmail
) => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(GUEST_ORDERS_KEY) || "[]"
    );

    const existingOrders = Array.isArray(saved) ? saved : [];
    const orderNumber = order.orderNumber || order._id || "";

    const email = String(
      customerEmail ||
        order.customer?.email ||
        order.email ||
        ""
    )
      .trim()
      .toLowerCase();

    const guestOrder = {
      _id: order._id || orderNumber || `guest-${Date.now()}`,
      orderNumber,
      email,
      customer: {
        ...(order.customer || {}),
        email,
      },
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "COD",
      items: cartItems.map((item) => ({
        _id: getProductId(item),
        title: item.title || item.name || "SOLEORA Product",
        image: getImage(item),
        price: getPrice(item),
        quantity: Number(item.quantity || 1),
        size: getSize(item),
        color: getColor(item),
      })),
      subtotal: Number(order.subtotal ?? totals.subtotal),
      shippingFee: Number(
        order.shippingFee ??
          order.shipping ??
          totals.shippingFee
      ),
      total: Number(order.total ?? totals.total),
    };

    const isSameOrder = (savedOrder) =>
      Boolean(
        (orderNumber &&
          (savedOrder.orderNumber === orderNumber ||
            savedOrder._id === orderNumber)) ||
          (order._id && savedOrder._id === order._id)
      );

    const alreadySaved = existingOrders.some(isSameOrder);

    const updatedOrders = alreadySaved
      ? existingOrders.map((savedOrder) =>
          isSameOrder(savedOrder)
            ? { ...savedOrder, ...guestOrder }
            : savedOrder
        )
      : [guestOrder, ...existingOrders];

    localStorage.setItem(
      GUEST_ORDERS_KEY,
      JSON.stringify(updatedOrders)
    );
  } catch (error) {
    console.error("Unable to save guest order:", error);
  }
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + getPrice(item) * Number(item.quantity || 1),
    0
  );

  const shippingFee =
    subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0
      ? 0
      : SHIPPING_CHARGE;

  const total = subtotal + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    const email = form.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: getProductId(item),
      quantity: Number(item.quantity || 1),
      size: getSize(item),
      color: getColor(item),
      reservationIds: Array.isArray(item.reservationIds)
        ? item.reservationIds
        : item.reservationId
          ? [item.reservationId]
          : [],
    }));

    if (items.some((item) => !item.productId)) {
      setError(
        "A product in your cart is missing its ID. Please update your cart and try again."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          ...form,
          email,
          items,
          paymentMethod: "COD",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      const order = data.order || data.data?.order || data.data || {};

      if (!order.orderNumber && !order._id) {
        throw new Error(
          "Order response did not contain an order number. Please contact support before trying again."
        );
      }

      if (!token) {
        saveGuestOrder(
          order,
          cartItems,
          {
            subtotal,
            shippingFee,
            total,
          },
          email
        );
      }

      setPlacedOrder(order);
      dispatch(clearCart());
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mb-5 text-gray-600">
            Thank you for shopping with SOLEORA.
          </p>

          <p className="mb-2 text-sm text-gray-500">
            Order Number
          </p>

          <p className="mb-4 break-all font-semibold text-gray-900">
            {placedOrder.orderNumber || placedOrder._id}
          </p>

          <p className="mb-6 text-sm text-gray-600">
            Payment Method: Cash on Delivery
          </p>

          {!token && (
            <p className="mb-6 text-sm text-gray-600">
              Apna order check karne ke liye My Orders page par
              jao aur order number ke saath wahi email use karo
              jo checkout mein di thi.
            </p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/my-orders"
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-100"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Your Cart Is Empty
          </h1>

          <p className="mb-6 text-gray-600">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/"
            className="inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mb-8 text-gray-600">
          Complete your details to place your SOLEORA order.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-sm lg:col-span-2 sm:p-8"
          >
            <section>
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstname"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>

                  <input
                    id="firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>

                  <input
                    id="lastname"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="03XXXXXXXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Complete Address *
                  </label>

                  <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="House number, street, area"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Optional"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Order Notes
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    placeholder="Optional delivery instructions"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Payment Method
              </h2>

              <div className="rounded-lg border border-gray-300 p-4">
                <p className="font-medium text-gray-900">
                  Cash on Delivery (COD)
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Pay when your order is delivered.
                </p>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mb-6 space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={`${getProductId(item)}-${getSize(item)}-${getColor(item)}-${index}`}
                  className="flex gap-4"
                >
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {getImage(item) ? (
                      <img
                        src={getImage(item)}
                        alt={item.title || item.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.title || item.name || "SOLEORA Product"}
                    </h3>

                    {getSize(item) && (
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {getSize(item)}
                      </p>
                    )}

                    {getColor(item) && (
                      <p className="text-sm text-gray-500">
                        Color: {getColor(item)}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-600">
                      Qty: {Number(item.quantity || 1)}
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      Rs.{" "}
                      {(
                        getPrice(item) *
                        Number(item.quantity || 1)
                      ).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-5">
              <div className="flex justify-between gap-4 text-gray-600">
                <span>Subtotal</span>
                <span>
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-gray-600">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0
                    ? "Free"
                    : `Rs. ${shippingFee.toLocaleString("en-PK")}`}
                </span>
              </div>

              {subtotal < FREE_SHIPPING_LIMIT && (
                <p className="text-sm text-gray-500">
                  Shop for Rs.{" "}
                  {(
                    FREE_SHIPPING_LIMIT - subtotal
                  ).toLocaleString("en-PK")}{" "}
                  more to get free shipping.
                </p>
              )}

              <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-gray-500">
              Your order will be processed after you confirm your
              delivery details.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
