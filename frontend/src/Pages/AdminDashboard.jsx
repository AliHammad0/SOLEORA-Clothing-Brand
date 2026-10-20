
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Boxes,
  CircleDollarSign,
  Pencil,
  Save,
  XCircle,
} from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    specialPrice: "",
    stock: "",
    brand: "",
    gender: "",
    description: "",
    isActive: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products/all`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEditing = (product) => {
    setEditingId(product._id);
    setSuccess("");
    setError("");

    setForm({
      title: product.title || "",
      price: product.price ?? "",
      specialPrice: product.specialPrice ?? "",
      stock: product.stock ?? 0,
      brand: product.brand || "",
      gender: product.gender || "",
      description: product.description || "",
      isActive: product.isActive !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setError("");
    setForm({
      title: "",
      price: "",
      specialPrice: "",
      stock: "",
      brand: "",
      gender: "",
      description: "",
      isActive: true,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand.trim(),
        gender: form.gender,
        description: form.description,
        isActive: form.isActive,
      };

      if (form.specialPrice !== "" && form.specialPrice !== null) {
        payload.specialPrice = Number(form.specialPrice);
      }

      const response = await fetch(
        `${API_URL}/products/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Product update failed.");
      }

      const updatedProduct = data.product;

      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingId ? updatedProduct : product
        )
      );

      setSuccess("Product updated successfully!");
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  const activeProducts = products.filter(
    (product) => product.isActive !== false
  );

  const specialProducts = products.filter(
    (product) =>
      Number(product.specialPrice) > 0 &&
      Number(product.specialPrice) < Number(product.price)
  );

  const filteredProducts = products.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const productValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", icon: Users, href: "/admin/users" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const stats = [
    { title: "Total Products", value: products.length, icon: Boxes, color: "bg-blue-50 text-blue-600" },
    { title: "Active Products", value: activeProducts.length, icon: Package, color: "bg-green-50 text-green-600" },
    { title: "Special Offers", value: specialProducts.length, icon: TrendingUp, color: "bg-red-50 text-red-600" },
    { title: "Product Value", value: `PKR ${productValue.toLocaleString("en-PK")}`, icon: CircleDollarSign, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <div>
            <h1 className="text-2xl font-black tracking-widest">SOLEORA</h1>
            <p className="mt-1 text-xs text-gray-500">Admin Dashboard</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <ExternalLink size={18} />
            View Store
          </a>

          <div className="mt-3 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold">SOLEORA Store</p>
            <p className="mt-1 text-xs text-gray-500">Product Management</p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="text-lg font-bold sm:text-xl">Dashboard</h2>
              <p className="hidden text-xs text-gray-500 sm:block">
                Welcome to your store management panel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:px-4"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          <section>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Store overview</p>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                Welcome Back, Admin
              </h3>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {editingId && (
              <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Edit Product</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update product details and save your changes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    aria-label="Cancel editing"
                  >
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={updateProduct} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Product Title</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Brand</label>
                      <input
                        name="brand"
                        value={form.brand}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Original Price (PKR)</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Special Price (PKR)</label>
                      <input
                        name="specialPrice"
                        type="number"
                        min="0"
                        value={form.specialPrice}
                        onChange={handleFormChange}
                        placeholder="Leave blank if no offer"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Stock</label>
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      >
                        <option value="">Select gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                        <input
                          name="isActive"
                          type="checkbox"
                          checked={form.isActive}
                          onChange={handleFormChange}
                          className="h-4 w-4 accent-black"
                        />
                        Product is active and visible
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                    >
                      <XCircle size={17} />
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <div className={`rounded-xl p-3 ${stat.color}`}>
                        <Icon size={21} />
                      </div>
                    </div>
                    <p className="mt-5 break-words text-2xl font-bold">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold">Products Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and edit products from your backend.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4 font-semibold">Product</th>
                    <th className="px-3 py-4 font-semibold">Price</th>
                    <th className="px-3 py-4 font-semibold">Stock</th>
                    <th className="px-3 py-4 font-semibold">Gender</th>
                    <th className="px-3 py-4 font-semibold">Status</th>
                    <th className="px-3 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || "https://placehold.co/60x70?text=Item"}
                            alt={product.title || "Product"}
                            className="h-14 w-12 rounded-lg bg-gray-100 object-cover"
                          />
                          <div>
                            <p className="max-w-[220px] truncate font-semibold">{product.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{product.brand || "SOLEORA"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <div className="font-semibold">
                          PKR {Number(product.price || 0).toLocaleString("en-PK")}
                        </div>
                        {Number(product.specialPrice) > 0 &&
                          Number(product.specialPrice) < Number(product.price) && (
                            <div className="mt-1 text-xs text-red-600">
                              Offer: PKR {Number(product.specialPrice).toLocaleString("en-PK")}
                            </div>
                          )}
                      </td>

                      <td className="px-3 py-4">{product.stock ?? 0}</td>
                      <td className="px-3 py-4">{product.gender || "—"}</td>

                      <td className="px-3 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive !== false
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && !error && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-3 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td colSpan="6" className="px-3 py-12 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Showing {filteredProducts.length} products.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
