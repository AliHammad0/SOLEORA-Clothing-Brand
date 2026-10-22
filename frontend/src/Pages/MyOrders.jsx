
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const GUEST_ORDERS_KEY = "soleora-orders";

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

const getGuestOrders = () => {
  try {
    const savedOrders = JSON.parse(
      localStorage.getItem(GUEST_ORDERS_KEY) || "[]"
    );
    return Array.isArray(savedOrders) ? savedOrders : [];
  } catch {
    return [];
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const syncGuestOrderStatuses = useCallback(async (guestOrders) => {
    let successCount = 0;
    let failureCount = 0;

    const updatedOrders = await Promise.all(
      guestOrders.map(async (order) => {
        const email = String(
          order.customer?.email ||
            order.email ||
            order.customerEmail ||
            ""
        )
          .trim()
          .toLowerCase();

        const orderNumber = String(order.orderNumber || "").trim();

        if (!email || !orderNumber) {
          failureCount += 1;
          return order;
        }

        const params = new URLSearchParams({ orderNumber, email });

        try {
          const response = await fetch(
            `${API_URL}/orders/guest-status?${params.toString()}`
          );

          const data = await response.json().catch(() => ({}));

          if (!response.ok || data.ok !== true || !data.order) {
            failureCount += 1;
            throw new Error(
              data.message || `Order ${orderNumber} could not be refreshed.`
            );
          }

          successCount += 1;

          return {
            ...order,
            status: data.order.status || order.status,
            updatedAt: data.order.updatedAt || order.updatedAt,
          };
        } catch (err) {
          console.error("Guest order refresh failed:", err);
          return order;
        }
      })
    );

    localStorage.setItem(
      GUEST_ORDERS_KEY,
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);

    if (guestOrders.length === 0) {
      setNotice("No guest orders were found in this browser.");
    } else if (successCount > 0 && failureCount === 0) {
      setNotice("Order status refreshed successfully.");
    } else if (successCount > 0) {
      setNotice(
        `Updated ${successCount} order(s). ${failureCount} order(s) could not be verified. Check that their email is saved.`
      );
    } else {
      setNotice(
        "Could not refresh guest orders. Check that the backend route is deployed and each saved order includes its email."
      );
    }
  }, []);

  const fetchOrders = useCallback(
    async (manualRefresh = false) => {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setNotice("");

      const token = localStorage.getItem("token");

      try {
        if (!token) {
          const guestOrders = getGuestOrders();
          setOrders(guestOrders);
          await syncGuestOrderStatuses(guestOrders);
          return;
        }

        const response = await fetch(`${API_URL}/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok !== true) {
          throw new Error(data.message || "Unable to load your orders.");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setNotice(
          manualRefresh ? "Your orders have been refreshed." : ""
        );
      } catch (err) {
        console.error("My Orders refresh failed:", err);
        setError(err.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [syncGuestOrderStatuses]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      styles[String(status || "pending").toLowerCase()] ||
      "bg-gray-100 text-gray-700"
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-sm text-gray-500">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-black sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Track your SOLEORA purchases and order status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {notice && (
          <div className="mt-6 border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            {notice}
          </div>
        )}

        {!error && orders.length === 0 ? (
          <section className="mt-10 bg-white px-5 py-16 text-center shadow-sm">
            <div className="text-5xl">🛍️</div>
            <h2 className="mt-5 text-xl font-semibold">No orders yet</h2>
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
          orders.length > 0 && (
            <div className="mt-8 space-y-6">
              {orders.map((order, index) => {
                const orderItems = Array.isArray(order.items)
                  ? order.items
                  : [];

                const orderId =
                  order._id || order.orderNumber || `guest-${index}`;

                return (
                  <section
                    key={orderId}
                    className="border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs text-gray-500">Order Number</p>
                        <h2 className="mt-1 break-all font-semibold">
                          {order.orderNumber || order._id || "Order confirmed"}
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
                      {orderItems.map((item, itemIndex) => {
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
                            key={item._id || `${orderId}-${itemIndex}`}
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
                              <p className="text-sm font-medium">{title}</p>
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
                        Payment:{" "}
                        {order.paymentMethod || "Cash on Delivery (COD)"}
                      </p>
                    </div>
                  </section>
                );
              })}
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default MyOrders;
