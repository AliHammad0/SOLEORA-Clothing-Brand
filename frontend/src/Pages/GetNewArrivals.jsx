import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/new?limit=8";

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
    Number(product.originalPrice || product.price || 0);

  const getSpecialPrice = (product) =>
    Number(product.specialPrice || product.discountPrice || 0);

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
    Number(price || 0).toLocaleString("en-PK", {
      maximumFractionDigits: 2,
    });

  const addToCart = (product) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cart = Array.isArray(storedCart) ? storedCart : [];

      const productId = String(product._id);
      const finalPrice = getFinalPrice(product);

      const productImage =
        product.images?.[0] ||
        product.imageUrls?.[0] ||
        product.image ||
        "";

      const existingIndex = cart.findIndex(
        (item) => String(item._id || item.productId) === productId
      );

      if (existingIndex !== -1) {
        const existingProduct = cart[existingIndex];

        cart[existingIndex] = {
          ...existingProduct,
          ...product,
          _id: product._id,
          productId: product._id,
          title: product.title,
          price: finalPrice,
          image: productImage,
          quantity: Number(existingProduct.quantity || 1) + 1,
        };
      } else {
        cart.push({
          ...product,
          _id: product._id,
          productId: product._id,
          title: product.title,
          price: finalPrice,
          originalPrice: getOriginalPrice(product),
          specialPrice: getSpecialPrice(product),
          image: productImage,
          images: product.images?.length
            ? product.images
            : product.imageUrls?.length
              ? product.imageUrls
              : productImage
                ? [productImage]
                : [],
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Notify cart components in the current tab.
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));

      setAddedProduct(productId);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Product cart mein add nahi ho saka. Dobara try karein.");
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
              className="mt-4 border border-black px-5 py-2 text-sm hover:bg-black hover:text-white"
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

              const image =
                product.images?.[0] ||
                product.imageUrls?.[0] ||
                product.image ||
                "https://placehold.co/600x750?text=SOLEORA";

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
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/600x750?text=SOLEORA";
                        }}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[10px] font-semibold text-black sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                        NEW
                      </span>

                      {hasDiscount && (
                        <span className="absolute bottom-2 left-2 bg-black px-2 py-1 text-[10px] font-semibold text-white sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <div className="pt-3 sm:pt-4">
                      <p className="mb-1 truncate text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                        {product.category?.name ||
                          product.category ||
                          product.gender ||
                          "Collection"}
                      </p>

                      <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-base">
                        {product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {hasDiscount && (
                          <span className="text-[11px] text-gray-400 line-through sm:text-sm">
                            PKR {formatPrice(originalPrice)}
                          </span>
                        )}

                        <span className="text-xs font-bold text-black sm:text-sm">
                          PKR {formatPrice(finalPrice)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full bg-black px-3 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800 sm:text-sm"
                  >
                    {addedProduct === String(product._id)
                      ? "Added to Cart ✓"
                      : "Add to Cart"}
                  </button>
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