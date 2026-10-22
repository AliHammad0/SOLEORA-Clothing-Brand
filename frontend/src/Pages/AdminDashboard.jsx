
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
} from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const getRegularPrice = (product) => {
  const candidates = [
    Number(product?.price),
    Number(product?.originalPrice),
    Number(product?.original_price),
  ];

  return (
    candidates.find(
      (value) => Number.isFinite(value) && value > 0
    ) ?? 0
  );
};

const getFinalPrice = (product) => {
  const regularPrice = getRegularPrice(product);

  const specialPrice = Number(
    product?.specialPrice ?? product?.discountPrice
  );

  if (
    Number.isFinite(specialPrice) &&
    specialPrice > 0 &&
    regularPrice > 0 &&
    specialPrice < regularPrice
  ) {
    return specialPrice;
  }

  const discount = Number(
    product?.discount ??
      product?.discountPercentage ??
      product?.discountPercent ??
      0
  );

  if (
    regularPrice > 0 &&
    Number.isFinite(discount) &&
    discount > 0 &&
    discount < 100
  ) {
    return Math.round(regularPrice * (1 - discount / 100));
  }

  return regularPrice;
};

const getDiscount = (product) => {
  const regularPrice = getRegularPrice(product);
  const finalPrice = getFinalPrice(product);

  if (
    regularPrice > 0 &&
    finalPrice > 0 &&
    finalPrice < regularPrice
  ) {
    return Math.round(
      ((regularPrice - finalPrice) / regularPrice) * 100
    );
  }

  return 0;
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images.filter(
      (image) => typeof image === "string" && image.trim()
    );
  }

  if (typeof images === "string" && images.trim()) {
    return images
      .split(/\n|,/)
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

const COLORS = {
  Black: "#000000",
  White: "#FFFFFF",
  "Off White": "#FAF9F6",
  Beige: "#F5F5DC",
  Brown: "#8B4513",
  Gray: "#808080",
  Grey: "#808080",
  Blue: "#0000FF",
  "Navy Blue": "#000080",
  Red: "#FF0000",
  Pink: "#FFC0CB",
  Purple: "#800080",
  Green: "#008000",
  "Olive Green": "#556B2F",
  Yellow: "#FFFF00",
  Orange: "#FFA500",
  Cream: "#FFFDD0",
  Maroon: "#800000",
  Burgundy: "#800020",
  Charcoal: "#36454F",
  "Sky Blue": "#87CEEB",
  "Light Blue": "#ADD8E6",
  "Dark Green": "#006400",
  "Forest Green": "#228B22",
  Lavender: "#E6E6FA",
  Peach: "#FFE5B4",
  Tan: "#D2B48C",
  Camel: "#C19A6B",
  Teal: "#008080",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products/all`);
      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || "Unable to load products."
        );
      }

      const productList = Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.data)
          ? data.data
          : [];

      setProducts(productList);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const activeProducts = products.filter(
    (product) => product.isActive !== false
  );

  const specialProducts = products.filter((product) => {
    const regularPrice = getRegularPrice(product);
    const finalPrice = getFinalPrice(product);

    return (
      regularPrice > 0 &&
      finalPrice > 0 &&
      finalPrice < regularPrice
    );
  });

  const filteredProducts = products.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const productValue = products.reduce(
    (total, product) =>
      total +
      getRegularPrice(product) * Number(product.stock || 0),
    0
  );

  const navigation = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: true,
    },
    {
      label: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
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
      value: `PKR ${productValue.toLocaleString("en-PK")}`,
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
            <h1 className="text-2xl font-black tracking-widest">
              SOLEORA
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 hover:bg-gray-100 lg:hidden"
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
            <p className="mt-1 text-xs text-gray-500">
              Product Management
            </p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <h2 className="text-lg font-bold sm:text-xl">
                Dashboard
              </h2>
              <p className="hidden text-xs text-gray-500 sm:block">
                Welcome to your store management panel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:px-4"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          <section>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Store overview
              </p>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                Welcome Back, Admin
              </h3>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-2 font-semibold underline"
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
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">
                        {stat.title}
                      </p>
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
                <h3 className="text-lg font-bold">
                  Products Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and edit your products.
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4 font-semibold">
                      Product
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Price
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Discount
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Stock
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Colors
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Gender
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-3 py-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    filteredProducts.map((product) => {
                      const regularPrice = getRegularPrice(product);
                      const finalPrice = getFinalPrice(product);
                      const discount = getDiscount(product);
                      const images = normalizeImages(product.images);
                      const colors = Array.isArray(product.colors)
                        ? product.colors
                        : [];

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  images[0] ||
                                  "https://placehold.co/60x70?text=Item"
                                }
                                alt={product.title || "Product"}
                                className="h-14 w-12 rounded-lg bg-gray-100 object-cover"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src =
                                    "https://placehold.co/60x70?text=Item";
                                }}
                              />

                              <div>
                                <p className="max-w-[200px] truncate font-semibold">
                                  {product.title || "Untitled Product"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {product.brand || "SOLEORA"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div className="font-semibold">
                              PKR{" "}
                              {regularPrice.toLocaleString("en-PK")}
                            </div>

                            {finalPrice > 0 &&
                              finalPrice < regularPrice && (
                                <div className="mt-1 text-xs text-red-600">
                                  Offer: PKR{" "}
                                  {finalPrice.toLocaleString("en-PK")}
                                </div>
                              )}
                          </td>

                          <td className="px-3 py-4">
                            {discount > 0 ? (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                {discount}% OFF
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-3 py-4">
                            {product.stock ?? 0}
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex max-w-36 flex-wrap gap-1">
                              {colors.slice(0, 3).map((colorName) => (
                                <span
                                  key={colorName}
                                  title={colorName}
                                  className="h-5 w-5 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      COLORS[colorName] || "#CCCCCC",
                                  }}
                                />
                              ))}

                              {colors.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{colors.length - 3}
                                </span>
                              )}

                              {colors.length === 0 && "—"}
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            {product.gender || "—"}
                          </td>

                          <td className="px-3 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.isActive !== false
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {product.isActive !== false
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td className="px-3 py-4">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                          </td>
                        </tr>
                      );
                    })}

                  {!loading &&
                    !error &&
                    filteredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-3 py-12 text-center text-gray-500"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}

                  {loading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-12 text-center text-gray-500"
                      >
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
