
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  clearCart,
} from "../redux/slices/cartSlice";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const PRODUCTS_API = `${API_URL}/products`;

const FREE_SHIPPING_LIMIT = 5000;
const SHIPPING_CHARGE = 250;

const getProductId = (item) => String(item._id ?? item.id ?? "");

const getPrice = (item) => {
  const price = Number(
    item.price ?? item.originalPrice ?? item.original_price ?? 0
  );
  const specialPrice = Number(item.specialPrice);
  const discountPrice = Number(item.discountPrice);

  if (specialPrice > 0 && price > 0 && specialPrice < price) {
    return specialPrice;
  }

  if (discountPrice > 0 && price > 0 && discountPrice < price) {
    return discountPrice;
  }

  if (price > 0) return price;
  if (specialPrice > 0) return specialPrice;
  if (discountPrice > 0) return discountPrice;

  return 0;
};

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

const getReservations = (item) => {
  const reservations = Array.isArray(item.reservations)
    ? item.reservations.filter(
        (reservation) => reservation?.reservationId
      )
    : [];

  if (reservations.length > 0) {
    return reservations.map((reservation) => ({
      reservationId: reservation.reservationId,
      quantity: Number(reservation.quantity || 0),
    }));
  }

  if (item.reservationId) {
    return [
      {
        reservationId: item.reservationId,
        quantity: Number(item.quantity || 1),
      },
    ];
  }

  return [];
};

const releaseReservation = async (reservationId) => {
  try {
    await fetch(
      `${PRODUCTS_API}/reservations/${encodeURIComponent(
        reservationId
      )}/release`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    // A stale reservation must not prevent trying to reserve current stock.
  }
};

const reserveCurrentQuantity = async (item) => {
  const productId = getProductId(item);
  const quantity = Number(item.quantity || 1);

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    throw new Error(
      `Invalid product or quantity for ${item.title || "a product"}.`
    );
  }

  // Release previous reservations before creating a fresh reservation.
  const previousReservations = getReservations(item);
  const uniqueReservationIds = [
    ...new Set(
      previousReservations.map((reservation) => reservation.reservationId)
    ),
  ];

  for (const reservationId of uniqueReservationIds) {
    await releaseReservation(reservationId);
  }

  // Reserve the complete current cart quantity on the backend.
  const response = await fetch(
    `${PRODUCTS_API}/${encodeURIComponent(productId)}/reserve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (
    !response.ok ||
    data.ok === false ||
    !data.reservationId
  ) {
    throw new Error(
      data.message ||
        `Could not reserve stock for ${
          item.title || "a product"
        }. Please check stock availability.`
    );
  }

  const reservedQuantity = Number(
    data.reservedQuantity ?? quantity
  );

  if (reservedQuantity !== quantity) {
    await releaseReservation(data.reservationId);

    throw new Error(
      `Stock reservation for ${
        item.title || "a product"
      } does not match the requested quantity. Please try again.`
    );
  }

  return {
    productId,
    quantity,
    size:
      typeof item.size === "object"
        ? item.size?.name || ""
        : item.size || "",
    color:
      typeof item.color === "object"
        ? item.color?.name || ""
        : item.color || "",
    reservations: [
      {
        reservationId: data.reservationId,
        quantity: reservedQuantity,
      },
    ],
  };
};

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + getPrice(item) * Number(item.quantity || 1),
    0
  );

  const shippingFee =
    subtotal === 0 || subtotal >= FREE_SHIPPING_LIMIT
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

    if (loading) return;

    setError("");
    setSuccess("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Refresh stock reservations for the latest cart quantities.
      const items = [];

      for (const item of cartItems) {
        const reservedItem = await reserveCurrentQuantity(item);
        items.push(reservedItem);
      }

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          items,
          paymentMethod: "COD",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok !== true) {
        throw new Error(
          data.message ||
            "Could not place your order. Please try again."
        );
      }

      setOrderNumber(data.order?.orderNumber || "");
      setSuccess("Your order has been placed successfully!");

      dispatch(clearCart());
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-semibold">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add products before proceeding to checkout.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block bg-black px-8 py-4 text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-black sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back to Cart
        </Link>

        <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
          {success ? "Order Confirmed!" : "Checkout"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {success
            ? "Thank you for shopping with SOLEORA."
            : "Complete your delivery details. No account or login required."}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success ? (
          <section className="mt-8 bg-white p-6 shadow-sm sm:p-10">
            <div className="text-4xl">✓</div>

            <h2 className="mt-4 text-2xl font-semibold">
              Order placed successfully!
            </h2>

            {orderNumber && (
              <p className="mt-3 text-gray-600">
                Order number: <strong>{orderNumber}</strong>
              </p>
            )}

            <p className="mt-3 text-sm text-gray-500">
              Payment method: Cash on Delivery (COD)
            </p>

            {localStorage.getItem("token") ? (
              <Link
                to="/my-orders"
                className="mt-7 inline-block bg-black px-7 py-3 text-white hover:bg-gray-800"
              >
                View My Orders
              </Link>
            ) : (
              <p className="mt-5 text-sm text-gray-600">
                Guest order confirmed. Log in before your next order to
                track orders through your account.
              </p>
            )}

            <div>
              <Link
                to="/"
                className="mt-4 inline-block border border-black px-7 py-3 hover:bg-gray-100"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]"
          >
            <section className="bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold">
                Delivery Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="First Name"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Last Name"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Complete Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="House number, street, area"
                  />
                </div>

                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Postal Code (Optional)"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium"
                  >
                    Order Notes (Optional)
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Any delivery instructions?"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mt-8 border border-gray-200 p-5">
                <h3 className="font-semibold">Payment Method</h3>

                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black">
                    <span className="h-2.5 w-2.5 rounded-full bg-black" />
                  </span>

                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery (COD)
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(success)}
                className="mt-8 w-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Checking stock and placing order..."
                  : "Place Order — Cash on Delivery"}
              </button>
            </section>

            <aside className="h-fit bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-5">
                {cartItems.map((item, index) => (
                  <div
                    key={getProductId(item) || index}
                    className="flex gap-4"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        "https://placehold.co/100x120?text=SOLEORA"
                      }
                      alt={item.title || "SOLEORA Product"}
                      className="h-20 w-16 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {item.title || item.name || "SOLEORA Product"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {Number(item.quantity || 1)}
                      </p>

                      {item.size && (
                        <p className="mt-1 text-xs text-gray-500">
                          Size:{" "}
                          {typeof item.size === "object"
                            ? item.size.name
                            : item.size}
                        </p>
                      )}

                      {item.color && (
                        <p className="mt-1 text-xs text-gray-500">
                          Color:{" "}
                          {typeof item.color === "object"
                            ? item.color.name
                            : item.color}
                        </p>
                      )}

                      <p className="mt-2 text-sm font-semibold">
                        {formatPrice(
                          getPrice(item) *
                            Number(item.quantity || 1)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-4 border-t border-gray-200 pt-5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Shipping</span>
                  <span>
                    {shippingFee === 0
                      ? "FREE"
                      : formatPrice(shippingFee)}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {subtotal >= FREE_SHIPPING_LIMIT
                    ? "Free shipping unlocked!"
                    : `${formatPrice(
                        FREE_SHIPPING_LIMIT - subtotal
                      )} more for free shipping.`}
                </p>

                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </aside>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SOLEORA. All rights reserved.
        </p>
      </div>
    </main>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium"
    >
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={name}
      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
    />
  </div>
);

export default Checkout;
