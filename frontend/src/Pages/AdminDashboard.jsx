
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      setCheckingAuth(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.isAdmin !== true || user.isActive === false) {
        navigate("/", { replace: true });
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      setCheckingAuth(false);
    }
  }, [navigate]);

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
    if (authorized) {
      fetchProducts();
    }
  }, [authorized]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const activeProducts = products.filter(
    (product) => product.isActive !== false
  );

  const specialProducts = products.filter(
    (product) =>
      Number(product.specialPrice) > 0 &&
      Number(product.specialPrice) < Number(product.price)
  );

  const filteredProducts = products.filter((product) =>
    (product.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", icon: Users, href: "/admin/users" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Boxes,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Products",
      value: activeProducts.length,
      icon: Package,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Special Offers",
      value: specialProducts.length,
      icon: TrendingUp,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Product Value",
      value: `PKR ${products
        .reduce(
          (total, product) =>
            total +
            Number(product.price || 0) * Number(product.stock || 0),
          0
        )
        .toLocaleString("en-PK")}`,
      icon: CircleDollarSign,
      color: "bg-purple-50 text-purple-600",
    },
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
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-2 text-sm font-semibold text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
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
                  Products retrieved from your existing backend.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
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
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4 font-semibold">Product</th>
                    <th className="px-3 py-4 font-semibold">Price</th>
                    <th className="px-3 py-4 font-semibold">Stock</th>
                    <th className="px-3 py-4 font-semibold">Gender</th>
                    <th className="px-3 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images?.[0] ||
                                "https://placehold.co/60x70?text=Item"
                              }
                              alt={product.title || "Product"}
                              className="h-14 w-12 rounded-lg bg-gray-100 object-cover"
                            />
                            <div>
                              <p className="max-w-[220px] truncate font-semibold">
                                {product.title}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {product.brand || "SOLEORA"}
                              </p>
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
                                Offer: PKR{" "}
                                {Number(product.specialPrice).toLocaleString("en-PK")}
                              </div>
                            )}
                        </td>

                        <td className="px-3 py-4">{product.stock ?? 0}</td>
                        <td className="px-3 py-4">{product.gender || "—"}</td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.isActive !== false
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}

                  {!loading && !error && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-3 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td colSpan="5" className="px-3 py-12 text-center text-gray-500">
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
