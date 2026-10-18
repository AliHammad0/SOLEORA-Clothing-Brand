
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/all";

const GetAllProducts = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid-2");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const gender = {
    "/men": "Men",
    "/women": "Women",
    "/kids": "Kids",
  }[location.pathname];

  const pageTitle = {
    "/men": "Men's Collection",
    "/women": "Women's Collection",
    "/kids": "Kids' Collection",
  }[location.pathname];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const url = gender
        ? `${API_URL}?gender=${encodeURIComponent(gender)}`
        : API_URL;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  const getProductPrice = (product) => {
    const price = Number(product.price || 0);
    const specialPrice = Number(product.specialPrice || 0);
    const discount = Number(product.discount || 0);

    if (specialPrice > 0 && specialPrice < price) {
      return specialPrice;
    }

    if (discount > 0 && discount < 100) {
      return price - (price * discount) / 100;
    }

    return price;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = Number(product.price || 0);
      const specialPrice = Number(product.specialPrice || 0);
      const isNewArrival = Boolean(product.isNewArrival);
      const hasSpecialPrice =
        specialPrice > 0 && specialPrice < price;

      return !hasSpecialPrice && !isNewArrival;
    });
  }, [products]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];

    switch (sortBy) {
      case "title-asc":
        return items.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );

      case "title-desc":
        return items.sort((a, b) =>
          (b.title || "").localeCompare(a.title || "")
        );

      case "price-asc":
        return items.sort(
          (a, b) => getProductPrice(a) - getProductPrice(b)
        );

      case "price-desc":
        return items.sort(
          (a, b) => getProductPrice(b) - getProductPrice(a)
        );

      case "old-new":
        return items.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

      case "new-old":
        return items.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      case "best-selling":
        return items.sort(
          (a, b) => Number(b.sold || 0) - Number(a.sold || 0)
        );

      default:
        return items.sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) -
            Number(Boolean(a.isFeatured))
        );
    }
  }, [filteredProducts, sortBy]);

  const gridColumns =
    viewMode === "grid-2" ? 2 : viewMode === "grid-3" ? 3 : 4;

  const gridStyle = {
    gridTemplateColumns:
      viewMode === "list"
        ? "minmax(0, 1fr)"
        : `repeat(${gridColumns}, minmax(0, 1fr))`,
  };

  const iconButtonClass = (mode) =>
    `flex h-9 w-9 items-center justify-center rounded-sm transition ${
      viewMode === mode
        ? "bg-gray-200 text-black"
        : "text-gray-500 hover:bg-gray-100 hover:text-black"
    }`;

  const ViewIcons = () => (
    <div className="flex items-center gap-1">
      {[
        { mode: "grid-2", label: "Two columns" },
        { mode: "grid-3", label: "Three columns" },
        { mode: "grid-4", label: "Four columns" },
        { mode: "list", label: "List view" },
      ].map(({ mode, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setViewMode(mode)}
          aria-label={label}
          aria-pressed={viewMode === mode}
          title={label}
          className={iconButtonClass(mode)}
        >
          {mode === "list" ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="5" height="5" rx="0.5" />
              <path d="M12 5h9M12 8h9" />
              <rect x="3" y="15" width="5" height="5" rx="0.5" />
              <path d="M12 16h9M12 19h9" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              {Array.from(
                { length: Number(mode.split("-")[1]) ** 2 },
                (_, i) => {
                  const count = Number(mode.split("-")[1]);
                  const gap = 2;
                  const cell = (20 - gap * (count - 1)) / count;

                  return (
                    <rect
                      key={i}
                      x={2 + (i % count) * (cell + gap)}
                      y={2 + Math.floor(i / count) * (cell + gap)}
                      width={cell}
                      height={cell}
                      rx="0.5"
                    />
                  );
                }
              )}
            </svg>
          )}
        </button>
      ))}
    </div>
  );

  const ProductCard = ({ product }) => {
    const price = Number(product.price || 0);
    const discount = Number(product.discount || 0);
    const specialPrice = Number(product.specialPrice || 0);
    const finalPrice = getProductPrice(product);
    const onSale = finalPrice < price;

    const image = product.images?.[0];
    const isList = viewMode === "list";
    const productUrl = `/product/${product._id}`;

    return (
      <article
        className={`group min-w-0 ${
          isList
            ? "flex gap-3 border-b border-gray-200 pb-4 sm:gap-6 sm:pb-6"
            : ""
        }`}
      >
        <Link
          to={productUrl}
          aria-label={`View ${product.title}`}
          className={`relative block overflow-hidden bg-gray-50 ${
            isList
              ? "aspect-square w-28 shrink-0 sm:w-40 md:w-48"
              : "aspect-[3/4] w-full"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={product.title || "Product"}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs text-gray-400">
              No image
            </div>
          )}

          {onSale && (
            <span className="absolute left-2 top-2 rounded-sm bg-red-600 px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
              {discount > 0 ? `${discount}% OFF` : "SPECIAL PRICE"}
            </span>
          )}
        </Link>

        <div
          className={`min-w-0 ${
            isList ? "flex-1 py-1 sm:py-3" : "pt-3 sm:pt-4"
          }`}
        >
          <Link to={productUrl} className="block hover:underline">
            <h2 className="truncate text-xs font-semibold text-gray-900 sm:text-base">
              {product.title}
            </h2>
          </Link>

          {product.category && (
            <p className="mt-1 truncate text-[11px] text-gray-500 sm:text-sm">
              {product.category}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {onSale && (
              <span className="text-gray-400 line-through">
                Rs. {price.toLocaleString("en-PK")}
              </span>
            )}

            <span className="font-semibold text-gray-900">
              Rs.{" "}
              {finalPrice.toLocaleString("en-PK", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {isList && (
            <div className="mt-3 space-y-1 text-xs text-gray-500 sm:text-sm">
              {product.brand && <p>Brand: {product.brand}</p>}
              {product.stock != null && <p>Stock: {product.stock}</p>}

              <Link
                to={productUrl}
                className="mt-3 inline-block border border-black px-4 py-2 text-xs text-black hover:bg-black hover:text-white"
              >
                View Product
              </Link>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-white px-3 py-6 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        {gender && (
          <h1 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {pageTitle}
          </h1>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-5">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-black">
              {loading ? "..." : filteredProducts.length} items
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <ViewIcons />

            <div className="flex items-center gap-2">
              <label htmlFor="sort-products" className="text-sm text-gray-600">
                Sort by:
              </label>

              <select
                id="sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="max-w-[145px] border-0 bg-transparent py-2 pr-5 text-xs text-gray-900 outline-none focus:ring-0 sm:max-w-none sm:text-sm"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="title-asc">Alphabetically, A-Z</option>
                <option value="title-desc">Alphabetically, Z-A</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
                <option value="old-new">Date, old to new</option>
                <option value="new-old">Date, new to old</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid gap-3 sm:gap-5" style={gridStyle}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-3 h-4 w-3/4 bg-gray-100" />
                <div className="mt-2 h-4 w-1/2 bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-4 border border-black px-6 py-2 text-sm hover:bg-black hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No products found in this collection.
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div
            className="grid gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10"
            style={gridStyle}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default GetAllProducts;
