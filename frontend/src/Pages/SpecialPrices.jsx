
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products";

const EXCHANGE_RATE = 280;

const ProductCard = ({
  product,
  formatPrice,
  addedProduct,
  adding,
  handleAddToCart,
}) => {
  const originalPrice = Number(product.price || product.originalPrice || 0);
  const specialPrice = Number(product.specialPrice || product.discountPrice || 0);
  const finalPrice =
    specialPrice > 0 && specialPrice < originalPrice
      ? specialPrice
      : originalPrice;

  const discount =
    originalPrice > finalPrice && originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  const productId = String(product._id || product.id || "");
  const outOfStock = Number(product.stock ?? 0) <= 0;

  return (
    <article className="group min-w-0">
      <Link
        to={`/product/${productId}`}
        aria-label={`View ${product.title}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gray-50"
      >
        <img
          src={
            product.images?.[0] ||
            product.imageUrls?.[0] ||
            product.image ||
            "https://placehold.co/600x750?text=SOLEORA"
          }
          alt={product.title || "SOLEORA Product"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/600x750?text=SOLEORA";
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
          {discount > 0 ? `-${discount}%` : "SPECIAL"}
        </span>
      </Link>

      <div className="pt-3">
        <Link
          to={`/product/${productId}`}
          className="block hover:underline"
        >
          <h3 className="truncate text-xs font-semibold text-gray-900 sm:text-base">
            {product.title}
          </h3>
        </Link>

        {product.brand && (
          <p className="mt-1 truncate text-[10px] text-gray-500 sm:text-xs">
            {product.brand}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-red-600 sm:text-base">
            {formatPrice(finalPrice)}
          </span>

          {discount > 0 && (
            <span className="text-[10px] text-gray-400 line-through sm:text-xs">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
          {outOfStock
            ? "😂 Bhai, Maal Khatam!"
            : `${product.stock} left`}
        </p>

        <button
          type="button"
          onClick={() => handleAddToCart(product)}
          disabled={outOfStock || adding}
          className={`mt-2 w-full px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-white transition sm:mt-3 sm:px-3 sm:py-2 sm:text-xs ${
            outOfStock || adding
              ? "cursor-not-allowed bg-gray-400"
              : addedProduct === productId
                ? "bg-green-700 hover:bg-green-800"
                : "bg-black hover:bg-red-600"
          }`}
        >
          {outOfStock
            ? "😂 Bhai, Maal Khatam!"
            : adding
              ? "Adding..."
              : addedProduct === productId
                ? "Added to Cart ✓"
                : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

const SpecialPrices = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Women");
  const [currency, setCurrency] = useState("PKR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [addedProduct, setAddedProduct] = useState("");
  const [addingProducts, setAddingProducts] = useState([]);

  const fetchSpecialPrices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/special`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message || "Unable to load special prices."
        );
      }

      setProducts(
        (data.products || []).filter(
          (product) =>
            product.isActive !== false &&
            product.active !== false
        )
      );
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialPrices();
  }, []);

  const filteredProducts = products.filter((product) => {
    const originalPrice = Number(
      product.price || product.originalPrice || 0
    );
    const specialPrice = Number(
      product.specialPrice || product.discountPrice || 0
    );

    return (
      product.gender === activeTab &&
      product.isActive !== false &&
      product.active !== false &&
      specialPrice > 0 &&
      specialPrice < originalPrice
    );
  });

  const formatPrice = (price) => {
    const amount =
      currency === "USD" ? Number(price || 0) / EXCHANGE_RATE : Number(price || 0);

    return currency === "USD"
      ? `$${amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : `PKR ${amount.toLocaleString("en-PK", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`;
  };

  const handleAddToCart = async (product) => {
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

      const originalPrice = Number(
        product.price || product.originalPrice || 0
      );

      const specialPrice = Number(
        product.specialPrice || product.discountPrice || 0
      );

      const finalPrice =
        specialPrice > 0 && specialPrice < originalPrice
          ? specialPrice
          : originalPrice;

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
        name: product.title,
        price: finalPrice,
        originalPrice,
        specialPrice:
          finalPrice < originalPrice ? finalPrice : 0,
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

      setTimeout(() => {
        setAddedProduct((current) =>
          current === productId ? "" : current
        );
      }, 1500);
    } catch (err) {
      console.error("Special prices add to cart error:", err);

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

  const moveSlider = (direction) => {
    const slider = document.getElementById(
      "special-prices-slider"
    );

    if (slider) {
      slider.scrollBy({
        left: direction * (slider.clientWidth / 2),
        behavior: "smooth",
      });
    }
  };

  const renderProduct = (product) => {
    const productId = String(product._id || product.id || "");

    return (
      <ProductCard
        key={productId}
        product={product}
        formatPrice={formatPrice}
        addedProduct={addedProduct}
        adding={addingProducts.includes(productId)}
        handleAddToCart={handleAddToCart}
      />
    );
  };

  return (
    <section className="bg-white px-4 py-12 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Limited Time Offers
            </p>

            <h2 className="text-3xl font-bold text-black md:text-4xl">
              Special Prices
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Discover selected styles at special prices.
            </p>
          </div>

          <div className="flex gap-2">
            {["PKR", "USD"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCurrency(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  currency === item
                    ? "bg-black text-white"
                    : "border border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          {["Women", "Men"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCartMessage("");
              }}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "border border-gray-300 text-black hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-3 h-4 w-3/4 bg-gray-100" />
                <div className="mt-2 h-4 w-1/2 bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchSpecialPrices}
              className="mt-4 border border-black px-5 py-2 text-sm hover:bg-black hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No special price products available for {activeTab}.
          </p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => moveSlider(-1)}
                aria-label="Previous products"
                className="absolute left-1 top-1/3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
              >
                <ChevronLeft size={22} />
              </button>

              <div
                id="special-prices-slider"
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: "none" }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="w-[calc((100%-16px)/2)] min-w-[calc((100%-16px)/2)] snap-start"
                  >
                    {renderProduct(product)}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => moveSlider(1)}
                aria-label="Next products"
                className="absolute right-1 top-1/3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="hidden grid-cols-3 gap-x-6 gap-y-8 md:grid lg:grid-cols-4">
              {filteredProducts.map(renderProduct)}
            </div>
          </>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-block border border-black px-7 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpecialPrices;
