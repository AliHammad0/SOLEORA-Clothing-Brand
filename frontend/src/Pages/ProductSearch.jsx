
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/search";

const ProductSearch = () => {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const keyword = input.trim();

    if (!keyword) {
      setProducts([]);
      setLoading(false);
      setError("");
      setSearched(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      setSearched(true);

      try {
        const response = await fetch(
          `${API_URL}?q=${encodeURIComponent(keyword)}`
        );

        const result = await response.json();

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || "Unable to search products.");
        }

        const list = Array.isArray(result)
          ? result
          : result.products ||
            result.data?.products ||
            result.data ||
            [];

        if (!cancelled) {
          setProducts(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (!cancelled) {
          setProducts([]);
          setError(
            err.message || "Something went wrong. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [input]);

  const getImage = (product) => {
    if (typeof product.image === "string") return product.image;
    if (Array.isArray(product.image)) return product.image[0] || "";
    if (Array.isArray(product.images)) return product.images[0] || "";
    if (typeof product.imageUrl === "string") return product.imageUrl;
    return "";
  };

  const getPrice = (product) =>
    product.specialPrice ??
    product.discountPrice ??
    product.price ??
    product.originalPrice ??
    0;

  const getOriginalPrice = (product) =>
    product.originalPrice ?? product.price ?? null;

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const getProductId = (product) =>
    product._id || product.id;

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#171717]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-[#f1eee7]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            SOLEORA COLLECTION
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Find Your Style.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Discover your favourite products, brands and styles.
          </p>

          {/* Live Search */}
          <div className="relative mt-7 max-w-2xl">
            <div className="flex items-center border border-gray-300 bg-white px-3 shadow-sm transition focus-within:border-black sm:px-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 shrink-0 text-gray-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search products, brands, categories..."
                aria-label="Search products"
                autoComplete="off"
                className="h-14 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none sm:text-base"
              />

              {loading && (
                <span className="mr-2 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              )}

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  aria-label="Clear search"
                  className="px-2 py-2 text-sm text-gray-500 transition hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Results update automatically as you type.
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        {!input.trim() && (
          <div className="py-14 text-center sm:py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold">
              What are you looking for?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start typing to discover products.
            </p>
          </div>
        )}

        {input.trim() && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Search Results
                </p>

                <h2 className="mt-2 text-lg font-semibold sm:text-xl">
                  {loading
                    ? "Finding products..."
                    : `Results for "${input.trim()}"`}
                </h2>
              </div>

              {!loading && !error && (
                <p className="text-sm text-gray-500">
                  {products.length} product
                  {products.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="mt-4 h-3 w-1/3 bg-gray-200" />
                    <div className="mt-3 h-4 w-3/4 bg-gray-200" />
                    <div className="mt-3 h-4 w-1/2 bg-gray-200" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="border border-red-200 bg-white px-5 py-12 text-center">
                <h3 className="text-lg font-semibold">
                  Search unavailable
                </h3>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => setInput((value) => `${value} ` .trim())}
                  className="mt-5 bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty Results */}
            {!loading &&
              !error &&
              searched &&
              products.length === 0 && (
                <div className="bg-white px-5 py-14 text-center sm:py-20">
                  <h3 className="text-xl font-semibold">
                    No products found
                  </h3>

                  <p className="mt-3 text-sm text-gray-500">
                    Try a different product name, brand or category.
                  </p>

                  <button
                    type="button"
                    onClick={() => setInput("")}
                    className="mt-6 bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Clear Search
                  </button>
                </div>
              )}

            {/* Product Cards */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
                {products.map((product, index) => {
                  const image = getImage(product);
                  const price = getPrice(product);
                  const originalPrice = getOriginalPrice(product);
                  const discounted =
                    originalPrice !== null &&
                    Number(originalPrice) > Number(price);
                  const id = getProductId(product);
                  const title =
                    product.title || product.name || "SOLEORA Product";

                  return (
                    <Link
                      key={id || product.slug || `${title}-${index}`}
                      to={id ? `/product/${id}` : "/"}
                      className="group min-w-0"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#eeece7]">
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image available
                          </div>
                        )}

                        {discounted && (
                          <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white sm:left-3 sm:top-3">
                            Sale
                          </span>
                        )}

                        {product.isNewArrival && (
                          <span className="absolute right-2 top-2 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider sm:right-3 sm:top-3">
                            New
                          </span>
                        )}
                      </div>

                      <div className="pt-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                          {product.brand || product.category || "SOLEORA"}
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-5 transition group-hover:underline sm:text-base">
                          {title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(price)}
                          </span>

                          {discounted && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          {Number(product.stock ?? 0) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="bg-[#eae5dc] px-5 py-10 text-center sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            SOLEORA
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Find Your Sole Story.
          </h2>

          <Link
            to="/"
            className="mt-6 inline-block border border-black px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProductSearch;
