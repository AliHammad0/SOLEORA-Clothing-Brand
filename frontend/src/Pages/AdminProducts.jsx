
import React, { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, Package, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to access products.");
      }

      const response = await fetch(`${API_URL}/products/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const filteredProducts = products.filter((product) =>
    (product.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your SOLEORA products
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-3 text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={getProducts}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-3 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && (
        <p className="py-8 text-center text-gray-500">Loading products...</p>
      )}

      {error && (
        <div className="rounded-lg bg-white p-6 text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            type="button"
            onClick={getProducts}
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const image =
                  product.images?.[0] || product.image || "";

                const price =
                  product.specialPrice ??
                  product.discountPrice ??
                  product.originalPrice ??
                  product.price;

                return (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={product.title || "Product"}
                            className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            <Package size={20} />
                          </div>
                        )}

                        <span className="font-medium">
                          {product.title || "Untitled Product"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">{product.brand || "-"}</td>

                    <td className="p-4 font-medium">
                      {price != null ? `Rs. ${price}` : "-"}
                    </td>

                    <td className="p-4">{product.stock ?? "-"}</td>

                    <td className="p-4">{product.gender || "-"}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
