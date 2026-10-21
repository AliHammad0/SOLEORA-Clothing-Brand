
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products";

const GetNewArrivals = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState("");
  const [addingProducts, setAddingProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState("");

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/new?limit=8`);
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

  useEffect(() => {
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

  const addProductToCart = async (product) => {
    const productId = String(product._id || product.id || "");

    if (!productId || addingProducts.includes(productId)) return;

    if (Number(product.stock ?? 0) <= 0) {
      setCartMessage("😂 Bhai, Maal Khatam!");
      return;
    }

    setAddingProducts((previous) => [...previous, productId]);
    setCartMessage("");

    try {
      const response = await fetch(`${API_URL}/${productId}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await response.json().catch(() => null);

      if (!data || typeof data !== "object") {
        throw new Error("Backend se valid response nahi mila.");
      }

      if (
        !response.ok ||
        data.ok === false ||
        data.success === false
      ) {
        if (
          response.status === 409 ||
          /stock|available|out of stock|quantity/i.test(
            data.message || ""
          )
        ) {
          setProducts((previous) =>
            previous.map((item) =>
              String(item._id || item.id) === productId
                ? { ...item, stock: 0 }
                : item
            )
          );

          setCartMessage("😂 Bhai, Maal Khatam!");
          return;
        }

        throw new Error(
          data.message || "Product reserve nahi ho saka."
        );
      }

      const responseData =
        data.data && typeof data.data === "object"
          ? data.data
          : data;

      const reservation =
        responseData.reservation || data.reservation || null;

      const updatedProduct =
        responseData.product || data.product || null;

      const reservationId = String(
        responseData.reservationId ||
          data.reservationId ||
          reservation?._id ||
          reservation?.id ||
          ""
      );

      const reservedQuantity = Number(
        responseData.reservedQuantity ??
          data.reservedQuantity ??
          reservation?.quantity ??
          responseData.quantity ??
          data.quantity ??
          1
      );

      if (
        !updatedProduct ||
        !reservationId ||
        !Number.isSafeInteger(reservedQuantity) ||
        reservedQuantity !== 1
      ) {
        throw new Error(
          "Reservation response incomplete hai. Cart update nahi hua."
        );
      }

      const originalPrice = getOriginalPrice(product);
      const finalPrice = getFinalPrice(product);

      const productImages = product.images?.length
        ? product.images
        : product.imageUrls?.length
          ? product.imageUrls
          : product.image
            ? [product.image]
            : [];

      const cartProduct = {
        ...product,
        ...updatedProduct,
        _id: String(
          updatedProduct._id || updatedProduct.id || productId
        ),
        title: product.title,
        price: finalPrice,
        originalPrice,
        specialPrice: finalPrice < originalPrice ? finalPrice : 0,
        image: productImages[0] || updatedProduct.image || "",
        images: productImages,
        stock: Math.max(0, Number(updatedProduct.stock ?? 0)),
      };

      dispatch(
        addToCart({
          product: cartProduct,
          quantity: reservedQuantity,
          reservationId,
        })
      );

      setProducts((previous) =>
        previous.map((item) =>
          String(item._id || item.id) === productId
            ? {
                ...item,
                ...updatedProduct,
                stock: Math.max(
                  0,
                  Number(updatedProduct.stock ?? 0)
                ),
              }
            : item
        )
      );

      setAddedProduct(productId);
      setCartMessage("Product added to cart! ✓");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Add to cart error:", err);

      setCartMessage(
        err.message === "Failed to fetch"
          ? "Server se connection nahi ho saka. Dobara try karein."
          : err.message || "Product cart mein add nahi ho saka."
      );
    } finally {
      setAddingProducts((previous) =>
        previous.filter((id) => id !== productId)
      );
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

        {cartMessage && (
          <p
            role="status"
            className={`mb-4 text-sm ${
              cartMessage.includes("Maal Khatam")
                ? "font-semibold text-red-600"
                : cartMessage.includes("added to cart")
                  ? "text-green-700"
                  : "text-gray-600"
            }`}
          >
            {cartMessage}
          </p>
        )}

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
              onClick={fetchNewArrivals}
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

              const productId = String(product._id || product.id || "");
              const outOfStock = Number(product.stock ?? 0) <= 0;
              const isAdding = addingProducts.includes(productId);

              return (
                <article key={productId} className="group min-w-0">
                  <Link
                    to={`/product/${productId}`}
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

                      <p className="mt-1 text-[11px] text-gray-500">
                        {outOfStock
                          ? "😂 Bhai, Maal Khatam!"
                          : `${product.stock} left`}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => addProductToCart(product)}
                    disabled={outOfStock || isAdding}
                    className={`mt-2 w-full px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-white transition sm:mt-3 sm:px-3 sm:py-2 sm:text-xs sm:tracking-wider ${
                      outOfStock || isAdding
                        ? "cursor-not-allowed bg-gray-400"
                        : addedProduct === productId
                          ? "bg-green-700 hover:bg-green-800"
                          : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {outOfStock
                      ? "😂 Bhai, Maal Khatam!"
                      : isAdding
                        ? "Adding..."
                        : addedProduct === productId
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
