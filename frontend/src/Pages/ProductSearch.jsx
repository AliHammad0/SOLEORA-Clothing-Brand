
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/search";

const ProductSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const query = searchParams.get("q") || "";

  useEffect(() => {
    setInput(query);

    if (!query.trim()) {
      setProducts([]);
      setError("");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?q=${encodeURIComponent(query)}`
        );

        const result = await response.json();

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || "Search failed.");
        }

        const productList = Array.isArray(result)
          ? result
          : result.products ||
            result.data?.products ||
            result.data ||
            [];

        setProducts(Array.isArray(productList) ? productList : []);
      } catch (err) {
        setProducts([]);
        setError(err.message || "Products load nahi ho sake.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = input.trim();

    if (keyword) {
      setSearchParams({ q: keyword });
    } else {
      setSearchParams({});
    }
  };

  const getImage = (product) => {
    if (typeof product.image === "string") return product.image;
    if (Array.isArray(product.images)) return product.images[0] || "";
    if (Array.isArray(product.image)) return product.image[0] || "";
    return product.imageUrl || "";
  };

  const getPrice = (product) =>
    product.specialPrice ??
    product.discountPrice ??
    product.price ??
    product.originalPrice ??
    0;

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#171717]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            SOLEORA COLLECTION
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Find Your Style.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
            Search your favourite styles, brands and collections.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mx-auto mb-12 flex max-w-2xl gap-2 rounded-sm border border-gray-300 bg-white p-2 shadow-sm"
        >
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search shirts, shoes, brands..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
            aria-label="Search products"
          />

          <button
            type="submit"
            className="bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:px-8"
          >
            Search
          </button>
        </form>

        {!query && !loading && (
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold">What are you looking for?</h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter a product name, category or brand to get started.
            </p>
          </div>
        )}

        {query && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold sm:text-xl">
              Search results for "{query}"
            </h2>

            {!loading && !error && (
              <p className="text-sm text-gray-500">
                {products.length} product{products.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 bg-gray-200" />
                <div className="mt-3 h-4 w-1/3 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setSearchParams({ q: query })}
              className="mt-4 border border-black px-5 py-2 text-sm hover:bg-black hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && query && products.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="mt-3 text-sm text-gray-500">
              Try another keyword, brand or category.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => {
              const image = getImage(product);
              const price = getPrice(product);
              const originalPrice =
                product.originalPrice ?? product.price;
              const hasDiscount =
                originalPrice != null &&
                Number(originalPrice) > Number(price);

              return (
                <Link
                  key={product._id || product.id || product.slug || product.title}
                  to={`/product/${product._id || product.id}`}
                  className="group min-w-0"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#eeece7]">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title || product.name || "SOLEORA product"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white sm:left-3 sm:top-3">
                        Sale
                      </span>
                    )}

                    {product.isNewArrival && (
                      <span className="absolute right-2 top-2 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:right-3 sm:top-3">
                        New
                      </span>
                    )}
                  </div>

                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                      {product.brand || product.category || "SOLEORA"}
                    </p>

                    <h3 className="mt-1 line-clamp-2 text-sm font-medium sm:text-base">
                      {product.title || product.name || "Untitled Product"}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {formatPrice(price)}
                      </span>

                      {hasDiscount && (
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
      </section>
    </main>
  );
};

export default ProductSearch;
