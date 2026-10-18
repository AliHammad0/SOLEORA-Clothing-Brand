
import React from "react";
import { Users } from "lucide-react";

export default function AdminCustomers() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your customers
        </p>
      </div>

      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <Users size={42} className="mx-auto mb-4 text-gray-400" />

        <h2 className="text-xl font-semibold">Customer Management</h2>

        <p className="mx-auto mt-2 max-w-md text-gray-500">
          Customers API is not connected yet. Connect your verified
          backend endpoint to display real customer information.
        </p>
      </div>
    </div>
  );
}
