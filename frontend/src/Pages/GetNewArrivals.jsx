
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/new?limit=8";

const FALLBACK_IMAGE =
  "https://placehold.co/600x750?text=SOLEORA";

const GetNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState("");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Products load nahi huay");
        }

        setProducts(
          (data.products || []).filter(
            (product) =>
              product.isActive !== false &&
              product.active !== false &&
              product.isNewArrival === true
          )
        );
      } catch (err) {
        setError(err.message || "Backend se connection nahi ho saka");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const getOriginalPrice = (product) =>
    Number(product.originalPrice ?? product.price ?? 0);

  const getSpecialPrice = (product) =>
    Number(product.specialPrice ?? product.discountPrice ?? 0);

  const getFinalPrice = (product) => {
    const originalPrice = getOriginalPrice(product);
    const specialPrice = getSpecialPrice(product);
    const discount = Number(product.discount || 0);

    if (
      specialPrice > 0 &&
      originalPrice > 0 &&
      specialPrice < originalPrice
    ) {
      return specialPrice;
    }

    if (discount > 0 && discount < 100 && originalPrice > 0) {
      return originalPrice - (originalPrice * discount) / 100;
    }

    return originalPrice;
  };

  const getDiscountPercent = (product) => {
    const originalPrice = getOriginalPrice(product);
    const finalPrice = getFinalPrice(product);

    if (originalPrice > 0 && finalPrice < originalPrice) {
      return Math.round(
        ((originalPrice - finalPrice) / originalPrice) * 100
      );
    }

    return 0;
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString("en-PK", {
      maximumFractionDigits: 2,
    });

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) return;

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      const existingIndex = cart.findIndex(
        (item) =>
          String(item._id || item.productId) === String(product._id)
      );

      if (existingIndex !== -1) {
        const currentQuantity = Number(cart[existingIndex].quantity || 1);

        if (currentQuantity >= Number(product.stock)) {
          setAddedProduct(`${product._id}-limit`);
          return;
        }

        cart[existingIndex].quantity = currentQuantity + 1;
      } else {
        cart.push({
          ...product,
          productId: product._id,
          quantity: 1,
          price: getFinalPrice(product),
          originalPrice: getOriginalPrice(product),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setAddedProduct(product._id);
      window.setTimeout(() => setAddedProduct(""), 1800);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gray-500">
              Just Arrived
            </p>

            <h2 className="text-3xl font-bold uppercase tracking-wide text-black sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Discover our latest collection.
            </p>
          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            {products.length} Products
          </span>
        </div>

        {loading && (
          <p className="py-16 text-center text-gray-500">
            Loading new arrivals...
          </p>
        )}

        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 border border-black px-5 py-2 text-sm transition hover:bg-black hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            No new arrivals available right now.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => {
              const originalPrice = getOriginalPrice(product);
              const finalPrice = getFinalPrice(product);
              const discountPercent = getDiscountPercent(product);
              const hasDiscount =
                discountPercent > 0 && finalPrice < originalPrice;
              const outOfStock = Number(product.stock) <= 0;

              const image =
                product.images?.[0] ||
                product.imageUrls?.[0] ||
                product.image ||
                FALLBACK_IMAGE;

              const wasAdded = addedProduct === product._id;
              const reachedLimit = addedProduct === `${product._id}-limit`;

              return (
                <article key={product._id} className="group min-w-0">
                  <Link
                    to={`/product/${product._id}`}
                    className="block"
                    aria-label={`View ${product.title}`}
                  >
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={product.title || "SOLEORA Product"}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-2 top-2 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black shadow-sm sm:left-3 sm:top-3 sm:text-xs">
                        New Arrival
                      </span>

                      {hasDiscount && (
                        <span className="absolute bottom-2 left-2 rounded-sm bg-black px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white sm:bottom-3 sm:left-3 sm:text-xs">
                          -{discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="pt-3 sm:pt-4">
                    <p className="mb-1 truncate text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                      {product.category?.name ||
                        product.category ||
                        product.gender ||
                        "SOLEORA Collection"}
                    </p>

                    <Link to={`/product/${product._id}`}>
                      <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 transition hover:text-gray-500 sm:text-base">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-bold text-black sm:text-sm">
                        PKR {formatPrice(finalPrice)}
                      </span>

                      {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                          PKR {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={() => handleAddToCart(product)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 px-2 py-2.5 text-[11px] font-semibold transition sm:mt-4 sm:py-3 sm:text-sm ${
                        outOfStock
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : wasAdded
                          ? "bg-green-700 text-white"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {outOfStock ? (
                        "Out of Stock"
                      ) : wasAdded ? (
                        <>
                          <Check size={15} />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          {reachedLimit ? "Stock Limit Reached" : "Add to Cart"}
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default GetNewArrivals;
