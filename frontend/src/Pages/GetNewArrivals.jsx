import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Check } from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/new?limit=8";

const CART_KEY = "cart";

const FALLBACK_IMAGE =
  "https://placehold.co/600x750/f5f3f0/252525?text=SOLEORA";

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;

const getProductPricing = (product) => {
  const originalPrice = Number(
    product.price ?? product.originalPrice ?? 0
  );

  const specialPrice = Number(
    product.specialPrice ?? product.discountPrice ?? 0
  );

  const discount = Number(product.discount ?? product.discountPercentage ?? 0);

  let finalPrice = originalPrice;

  if (
    specialPrice > 0 &&
    originalPrice > 0 &&
    specialPrice < originalPrice
  ) {
    finalPrice = specialPrice;
  } else if (discount > 0 && discount < 100 && originalPrice > 0) {
    finalPrice = originalPrice - (originalPrice * discount) / 100;
  }

  const discountPercentage =
    originalPrice > finalPrice && originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  return { originalPrice, finalPrice, discountPercentage };
};

const GetNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedItems, setAddedItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "Unable to load new arrivals.");
        }

        const productList = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.data)
            ? data.data
            : [];

        setProducts(productList);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const stock = Math.max(0, Number(product.stock ?? 0));

    if (stock <= 0) return;

    const { finalPrice } = getProductPricing(product);

    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const cart = Array.isArray(savedCart) ? savedCart : [];

      const productId = String(product._id || product.id);
      const existingItem = cart.find(
        (item) => String(item._id || item.id) === productId
      );

      if (existingItem) {
        if (Number(existingItem.quantity || 1) >= stock) return;

        const updatedCart = cart.map((item) =>
          String(item._id || item.id) === productId
            ? {
                ...item,
                price: finalPrice,
                quantity: Number(item.quantity || 1) + 1,
              }
            : item
        );

        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      } else {
        const cartItem = {
          _id: product._id || product.id,
          title: product.title,
          price: finalPrice,
          quantity: 1,
          image:
            product.images?.[0] ||
            product.image ||
            FALLBACK_IMAGE,
        };

        localStorage.setItem(
          CART_KEY,
          JSON.stringify([...cart, cartItem])
        );
      }

      window.dispatchEvent(new Event("cartUpdated"));
      setAddedItems((previous) => [...new Set([...previous, productId])]);

      window.setTimeout(() => {
        setAddedItems((previous) =>
          previous.filter((id) => id !== productId)
        );
      }, 1500);
    } catch {
      setError("Unable to add this product to the cart.");
    }
  };

  return (
    <section className="bg-white px-3 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-10">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs">
              Fresh styles, just arrived
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              Discover the latest from SOLEORA.
            </p>
          </div>

          <Link
            to="/new-arrivals"
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-900 transition hover:gap-2 sm:text-sm"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-3 h-4 w-4/5 bg-gray-100" />
                <div className="mt-2 h-4 w-2/5 bg-gray-100" />
                <div className="mt-4 h-10 bg-gray-100" />
              </div>
            ))}
          </div>
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
          <p className="py-12 text-center text-sm text-gray-500">
            New arrivals are coming soon.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
            {products.map((product, index) => {
              const { originalPrice, finalPrice, discountPercentage } =
                getProductPricing(product);

              const stock = Math.max(0, Number(product.stock ?? 0));
              const productId = String(product._id || product.id);
              const isAdded = addedItems.includes(productId);
              const image =
                product.images?.[0] || product.image || FALLBACK_IMAGE;

              return (
                <article
                  key={productId}
                  className="group min-w-0 animate-[fadeIn_0.5s_ease-out_both]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link
                    to={`/product/${product._id || product.id}`}
                    className="relative block overflow-hidden bg-stone-100"
                  >
                    <img
                      src={image}
                      alt={product.title || "SOLEORA clothing"}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {discountPercentage > 0 && (
                      <span className="absolute left-2 top-2 overflow-hidden bg-red-600 px-2 py-1.5 text-[10px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                        <span className="inline-block animate-pulse">
                          -{discountPercentage}% OFF
                        </span>
                      </span>
                    )}

                    {product.isNewArrival && (
                      <span className="absolute right-2 top-2 bg-white/95 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-900 sm:right-3 sm:top-3 sm:text-[10px]">
                        New
                      </span>
                    )}
                  </Link>

                  <div className="pt-3 sm:pt-4">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="block"
                    >
                      <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-medium leading-5 text-gray-900 transition-colors hover:text-gray-500 sm:text-sm">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-gray-950 sm:text-base">
                        {formatPrice(finalPrice)}
                      </span>

                      {originalPrice > finalPrice && (
                        <span className="text-[11px] text-gray-400 line-through sm:text-sm">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={stock <= 0}
                      onClick={(event) => handleAddToCart(event, product)}
                      className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 active:scale-[0.98] sm:text-sm ${
                        stock <= 0
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : isAdded
                            ? "bg-green-700 text-white"
                            : "border border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      {stock <= 0 ? (
                        "Out of Stock"
                      ) : isAdded ? (
                        <>
                          <Check size={15} /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} />
                          Add to Cart
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