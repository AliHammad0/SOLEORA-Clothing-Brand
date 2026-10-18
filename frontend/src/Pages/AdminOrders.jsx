
import React from "react";
import { ShoppingBag } from "lucide-react";

export default function AdminOrders() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders
        </p>
      </div>

      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <ShoppingBag size={42} className="mx-auto mb-4 text-gray-400" />

        <h2 className="text-xl font-semibold">Orders Management</h2>

        <p className="mx-auto mt-2 max-w-md text-gray-500">
          Orders API is not connected yet. Connect your existing
          backend orders endpoint to display real customer orders.
        </p>
      </div>
    </div>
  );
}
