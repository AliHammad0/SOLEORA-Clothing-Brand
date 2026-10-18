import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/new?limit=8";

const FALLBACK_IMAGE =
  "https://placehold.co/600x750/f5f3f0/252525?text=SOLEORA";

const CART_KEY = "cart";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });

const getOriginalPrice = (product) =>
  Number(product.originalPrice ?? product.price ?? 0);

const getSpecialPrice = (product) =>
  Number(product.specialPrice ?? product.discountPrice ?? 0);

const getProductPricing = (product) => {
  const originalPrice = getOriginalPrice(product);
  const specialPrice = getSpecialPrice(product);
  const discount = Number(product.discount || 0);

  let finalPrice = originalPrice;

  if (
    originalPrice > 0 &&
    specialPrice > 0 &&
    specialPrice < originalPrice
  ) {
    finalPrice = specialPrice;
  } else if (
    originalPrice > 0 &&
    discount > 0 &&
    discount < 100
  ) {
    finalPrice = originalPrice * (1 - discount / 100);
  }

  const discountPercent =
    originalPrice > 0 && finalPrice < originalPrice
      ? Math.round(
          ((originalPrice - finalPrice) / originalPrice) * 100
        )
      : 0;

  return {
    originalPrice,
    finalPrice,
    discountPercent,
    hasDiscount: discountPercent > 0,
  };
};

const getProductImage = (product) =>
  product.images?.[0] ||
  product.imageUrls?.[0] ||
  product.image ||
  FALLBACK_IMAGE;

const GetNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data.message || "Unable to load new arrivals."
          );
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
        if (err.name !== "AbortError") {
          setError(
            err.message || "Could not connect to the server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchNewArrivals();

    return () => controller.abort();
  }, []);

  const handleAddToCart = (product) => {
    setCartMessage("");

    const stock = Number(product.stock);

    if (product.stock != null && stock <= 0) {
      setCartMessage("This product is out of stock.");
      return;
    }

    try {
      const storedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(storedCart)) {
        throw new Error("Invalid cart data");
      }

      const existingIndex = storedCart.findIndex(
        (item) =>
          String(item._id || item.id) === String(product._id)
      );

      if (existingIndex !== -1) {
        const currentQuantity = Number(
          storedCart[existingIndex].quantity || 1
        );

        if (
          product.stock != null &&
          currentQuantity >= stock
        ) {
          setCartMessage("Available stock limit reached.");
          return;
        }

        storedCart[existingIndex] = {
          ...storedCart[existingIndex],
          quantity: currentQuantity + 1,
        };
      } else {
        storedCart.push({
          ...product,
          _id: product._id,
          quantity: 1,
          price: getProductPricing(product).finalPrice,
          image: getProductImage(product),
        });
      }

      localStorage.setItem(
        CART_KEY,
        JSON.stringify(storedCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));

      setAddingProduct(String(product._id));
      setCartMessage(`${product.title} added to cart.`);

      window.setTimeout(() => {
        setAddingProduct("");
      }, 1600);
    } catch {
      setCartMessage(
        "Unable to update your cart. Please try again."
      );
    }
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
      <style>{`
        @keyframes soleoraBadgeEnter {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes soleoraBadgeShine {
          0%, 35% {
            transform: translateX(-160%) skewX(-20deg);
          }
          75%, 100% {
            transform: translateX(320%) skewX(-20deg);
          }
        }

        .soleora-discount-badge {
          animation: soleoraBadgeEnter 500ms ease-out both;
          box-shadow: 0 5px 18px rgba(55, 8, 23, 0.22);
        }

        .soleora-discount-shine {
          animation: soleoraBadgeShine 4s ease-in-out infinite;
        }

        .soleora-product-image {
          transition: transform 700ms cubic-bezier(0.2, 0.65, 0.3, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .soleora-discount-badge,
          .soleora-discount-shine {
            animation: none !important;
          }

          .soleora-product-image {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-10">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[3px] text-[#861b35] sm:text-xs">
              The Latest Edit
            </p>

            <h2 className="text-2xl font-bold uppercase tracking-[1px] text-neutral-950 sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-neutral-500 sm:text-sm">
              Discover the latest styles, thoughtfully selected for you.
            </p>
          </div>

          {!loading && !error && products.length > 0 && (
            <span className="shrink-0 pb-1 text-[10px] uppercase tracking-wider text-neutral-500 sm:text-xs">
              {products.length}{" "}
              {products.length === 1 ? "Piece" : "Pieces"}
            </span>
          )}
        </div>

        {loading && (
          <div
            className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6"
            aria-label="Loading new arrivals"
            aria-busy="true"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="min-w-0">
                <div className="aspect-[4/5] animate-pulse bg-neutral-100" />
                <div className="mt-4 h-3 w-1/3 animate-pulse bg-neutral-100" />
                <div className="mt-3 h-4 w-4/5 animate-pulse bg-neutral-100" />
                <div className="mt-3 h-3 w-1/2 animate-pulse bg-neutral-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            className="border border-neutral-200 px-5 py-12 text-center sm:py-16"
            role="alert"
          >
            <p className="text-sm font-semibold text-neutral-900">
              We couldn't load the latest collection.
            </p>

            <p className="mt-2 text-xs text-neutral-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 border border-neutral-900 px-6 py-3 text-[10px] font-semibold uppercase tracking-[1.5px] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="border border-neutral-200 px-5 py-14 text-center sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Something new is coming
            </p>

            <p className="mt-2 text-xs text-neutral-500">
              Our latest arrivals will be available here soon.
            </p>

            <Link
              to="/shop"
              className="mt-5 inline-block border border-neutral-900 px-6 py-3 text-[10px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Explore Collection
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => {
              const {
                originalPrice,
                finalPrice,
                discountPercent,
                hasDiscount,
              } = getProductPricing(product);

              const image = getProductImage(product);
              const isOutOfStock =
                product.stock != null &&
                Number(product.stock) <= 0;

              return (
                <article
                  key={product._id}
                  className="group min-w-0"
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#861b35]"
                    aria-label={`View ${product.title || "product"}`}
                  >
                    <div className="relative isolate aspect-[4/5] overflow-hidden bg-[#f5f4f2]">
                      <img
                        src={image}
                        alt={product.title || "SOLEORA clothing"}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="soleora-product-image h-full w-full object-cover group-hover:scale-[1.04]"
                      />

                      <span className="absolute left-2 top-2 bg-white/95 px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[1px] text-neutral-900 shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[9px]">
                        New Arrival
                      </span>

                      {hasDiscount && (
                        <div className="absolute bottom-2 left-2 z-10 sm:bottom-4 sm:left-3">
                          <span className="soleora-discount-badge relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-[#390617] via-[#861b35] to-[#530c23] px-2.5 py-2 text-white sm:gap-2 sm:px-3.5 sm:py-2.5">
                            <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
                              %
                            </span>

                            <span className="relative z-10 flex flex-col leading-tight">
                              <span className="text-[7px] font-medium uppercase tracking-[1px] text-white/75 sm:text-[9px] sm:tracking-[1.3px]">
                                Special Offer
                              </span>

                              <span className="mt-0.5 whitespace-nowrap text-[10px] font-extrabold tracking-wide sm:text-xs">
                                {discountPercent}% OFF
                              </span>
                            </span>

                            <span
                              aria-hidden="true"
                              className="soleora-discount-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 sm:pt-4">
                      <p className="mb-1.5 truncate text-[9px] font-medium uppercase tracking-[1.2px] text-neutral-500 sm:text-[10px] sm:tracking-[1.5px]">
                        {product.category?.name ||
                          product.category ||
                          product.gender ||
                          "SOLEORA Collection"}
                      </p>

                      <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-5 text-neutral-900 transition-colors group-hover:text-[#861b35] sm:text-sm">
                        {product.title || "Untitled Product"}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {hasDiscount && (
                          <span className="text-[10px] text-neutral-400 line-through sm:text-xs">
                            PKR {formatPrice(originalPrice)}
                          </span>
                        )}

                        <span
                          className={`text-xs font-bold sm:text-sm ${
                            hasDiscount
                              ? "text-[#861b35]"
                              : "text-neutral-950"
                          }`}
                        >
                          PKR {formatPrice(finalPrice)}
                        </span>
                      </div>

                      {Array.isArray(product.colors) &&
                        product.colors.length > 0 && (
                          <p className="mt-2 truncate text-[9px] text-neutral-500 sm:text-[10px]">
                            {product.colors.length === 1
                              ? "Color: "
                              : "Colors: "}
                            {product.colors.join(", ")}
                          </p>
                        )}

                      {product.stock != null && (
                        <p
                          className={`mt-2 text-[9px] font-medium sm:text-[10px] ${
                            isOutOfStock
                              ? "text-red-600"
                              : "text-neutral-500"
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of stock"
                            : `${product.stock} available`}
                        </p>
                      )}
                    </div>
                  </Link>

                  <button
                    type="button"
                    disabled={
                      isOutOfStock ||
                      addingProduct === String(product._id)
                    }
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 min-h-10 w-full bg-neutral-950 px-2 py-3 text-[9px] font-semibold uppercase tracking-[1.2px] text-white transition-colors duration-300 hover:bg-[#861b35] disabled:cursor-not-allowed disabled:bg-neutral-300 sm:text-[10px] sm:tracking-[1.5px]"
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : addingProduct === String(product._id)
                        ? "Added to Cart ✓"
                        : "Add to Cart"}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {cartMessage && (
          <p
            className="mt-5 text-center text-xs text-neutral-600"
            role="status"
            aria-live="polite"
          >
            {cartMessage}
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-10 text-center sm:mt-14">
            <Link
              to="/shop"
              className="inline-flex min-h-11 items-center justify-center border border-neutral-900 px-8 py-3 text-[10px] font-semibold uppercase tracking-[2px] text-neutral-900 transition-colors duration-300 hover:bg-neutral-900 hover:text-white sm:px-10"
            >
              Explore All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default GetNewArrivals;