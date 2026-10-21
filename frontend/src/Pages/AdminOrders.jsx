import React, { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw, Trash2 } from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("authToken");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Admin login token nahi mila. Dobara login karein.");
      }

      const response = await fetch(`${API_URL}/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Orders load nahi ho sake.");
      }

      setOrders(
        Array.isArray(data) ? data : data.orders || data.data || []
      );
    } catch (err) {
      setError(err.message || "Orders load karne mein error aaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      await fetchOrders();
    } catch (err) {
      setError(err.message || "Status update nahi hua.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteOrder = async (order) => {
    if (order.status !== "cancelled") {
      setError("Sirf cancelled orders delete ho sakte hain.");
      return;
    }

    const confirmed = window.confirm(
      `Order #${order._id.slice(-8).toUpperCase()} permanently delete karna hai? Yeh action undo nahi ho sakta.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(order._id);
      setError("");

      const response = await fetch(`${API_URL}/orders/${order._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order delete nahi hua.");
      }

      setOrders((previous) =>
        previous.filter((item) => item._id !== order._id)
      );
    } catch (err) {
      setError(err.message || "Order delete nahi hua.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customer orders manage karein
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center">
          Orders load ho rahe hain...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <ShoppingBag
            size={42}
            className="mx-auto mb-4 text-gray-400"
          />
          <h2 className="text-xl font-semibold">Abhi koi order nahi</h2>
          <p className="mt-2 text-gray-500">
            Customer orders yahan show honge.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-4 shadow-sm md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.customer?.name ||
                      order.customer?.fullName ||
                      "Customer"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customer?.phone || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customer?.email || ""}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xl font-bold">
                    Rs. {Number(order.total || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.paymentMethod || "Cash on Delivery"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>

              <div className="my-4 border-t" />

              <div className="space-y-2">
                {(order.items || []).map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {item.title || item.product?.title || "Product"} ×{" "}
                      {item.quantity || 1}
                      {item.size ? ` | Size: ${item.size}` : ""}
                    </span>
                    <span className="whitespace-nowrap font-medium">
                      Rs.{" "}
                      {Number(
                        item.price || item.specialPrice || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <strong>Address:</strong>{" "}
                {typeof order.shippingAddress === "string"
                  ? order.shippingAddress
                  : [
                      order.shippingAddress?.address,
                      order.shippingAddress?.city,
                      order.shippingAddress?.province,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-gray-600">
                  Status: <strong>{order.status || "pending"}</strong>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={order.status || "pending"}
                    disabled={
                      updatingId === order._id ||
                      deletingId === order._id
                    }
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {order.status === "cancelled" && (
                    <button
                      onClick={() => deleteOrder(order)}
                      disabled={
                        deletingId === order._id ||
                        updatingId === order._id
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {deletingId === order._id
                        ? "Deleting..."
                        : "Delete Permanently"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
