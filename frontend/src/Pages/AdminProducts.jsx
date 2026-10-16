
import React, { useEffect, useState } from "react";
import { Search, RefreshCw, Package } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/all";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
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
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
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
          to="/admin/create-product"
          className="rounded-lg bg-black px-4 py-3 text-white"
        >
          + Add Product
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 outline-none"
          />
        </div>

        <button
          onClick={getProducts}
          className="rounded-lg border bg-white px-4 py-3"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50">
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
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || product.image || ""}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                      />
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4">{product.brand || "-"}</td>
                  <td className="p-4">
                    {product.specialPrice
                      ? `Rs. ${product.specialPrice}`
                      : `Rs. ${product.price ?? "-"}`}
                  </td>
                  <td className="p-4">{product.stock ?? "-"}</td>
                  <td className="p-4">{product.gender || "-"}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1">
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
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
