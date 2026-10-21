import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          return;
        }

        const response = await fetch(`${API_URL}/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok !== true) {
          throw new Error(
            data.message || "Unable to load your orders."
          );
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return styles[String(status || "").toLowerCase()] ||
      "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-sm text-gray-500">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="mt-4 text-sm text-red-600">{error}</p>

        <Link
          to="/login"
          className="mt-6 bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-black sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          My Orders
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Track your SOLEORA purchases and order status.
        </p>

        {orders.length === 0 ? (
          <section className="mt-10 bg-white px-5 py-16 text-center shadow-sm">
            <div className="text-5xl">🛍️</div>

            <h2 className="mt-5 text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your future purchases will appear here.
            </p>

            <Link
              to="/"
              className="mt-7 inline-block bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </section>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => {
              const orderItems = Array.isArray(order.items)
                ? order.items
                : [];

              return (
                <section
                  key={order._id}
                  className="border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order Number
                      </p>

                      <h2 className="mt-1 break-all font-semibold">
                        {order.orderNumber || order._id}
                      </h2>

                      <p className="mt-2 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-PK",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-block px-3 py-2 text-xs font-semibold capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                      <span className="text-sm font-semibold">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 py-5">
                    {orderItems.map((item, index) => {
                      const product =
                        item.product && typeof item.product === "object"
                          ? item.product
                          : {};

                      const title =
                        item.title ||
                        product.title ||
                        item.name ||
                        "SOLEORA Product";

                      const image =
                        item.image ||
                        item.images?.[0] ||
                        product.images?.[0] ||
                        product.image ||
                        "";

                      const quantity = Number(item.quantity || 1);

                      const unitPrice = Number(
                        item.price ??
                          item.specialPrice ??
                          product.specialPrice ??
                          product.discountPrice ??
                          product.price ??
                          product.originalPrice ??
                          0
                      );

                      return (
                        <div
                          key={item._id || `${order._id}-${index}`}
                          className="flex gap-4"
                        >
                          <div className="h-20 w-16 shrink-0 overflow-hidden bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-2xl">
                                👕
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                              {title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Quantity: {quantity}
                            </p>

                            {item.size && (
                              <p className="mt-1 text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                            )}

                            {item.color && (
                              <p className="mt-1 text-xs text-gray-500">
                                Color: {item.color}
                              </p>
                            )}

                            <p className="mt-2 text-sm font-semibold">
                              {formatPrice(unitPrice * quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">Shipping</span>
                      <span>{formatPrice(order.shippingFee)}</span>
                    </div>

                    <div className="flex justify-between gap-3 border-t border-gray-200 pt-3 font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>

                    <p className="pt-2 text-xs text-gray-500">
                      Payment: Cash on Delivery
                    </p>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;