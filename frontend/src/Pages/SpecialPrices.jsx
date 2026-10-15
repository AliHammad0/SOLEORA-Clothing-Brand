import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/special";

const EXCHANGE_RATE = 280;

const ProductCard = ({
  product,
  formatPrice,
  addedProduct,
  handleAddToCart,
}) => {
  const price = Number(product.price || 0);
  const specialPrice = Number(product.specialPrice || 0);
  const discount =
    price > specialPrice && price > 0
      ? Math.round(((price - specialPrice) / price) * 100)
      : 0;

  return (
    <article className="group min-w-0">
      <Link
        to={`/product/${product._id}`}
        aria-label={`View ${product.title}`}
        className="relative block aspect-[3/4] overflow-hidden bg-gray-50"
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title || "Product"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x750?text=SOLEORA";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="pt-3">
        <Link
          to={`/product/${product._id}`}
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
            {formatPrice(specialPrice)}
          </span>

          <span className="text-[10px] text-gray-400 line-through sm:text-xs">
            {formatPrice(price)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleAddToCart(product)}
          className="mt-3 w-full bg-black px-2 py-2.5 text-[10px] font-semibold text-white transition hover:bg-red-600 sm:mt-4 sm:py-3 sm:text-sm"
        >
          {addedProduct === product._id
            ? "Added to Cart"
            : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

const SpecialPrices = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Women");
  const [currency, setCurrency] = useState("PKR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState("");

  useEffect(() => {
    const fetchSpecialPrices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(
            data.message || "Unable to load special prices."
          );
        }

        setProducts(data.products || []);
      } catch (err) {
        setError(
          err.message || "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialPrices();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.gender === activeTab &&
      product.isActive !== false &&
      Number(product.specialPrice) > 0 &&
      Number(product.specialPrice) < Number(product.price)
  );

  const formatPrice = (price) => {
    const amount =
      currency === "USD" ? price / EXCHANGE_RATE : price;

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

  const handleAddToCart = (product) => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingProduct = cart.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        existingProduct.quantity =
          (existingProduct.quantity || 1) + 1;
      } else {
        cart.push({
          ...product,
          name: product.title,
          image: product.images?.[0] || "",
          price: Number(product.specialPrice),
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setAddedProduct(product._id);
      setTimeout(() => setAddedProduct(""), 1500);
    } catch {
      setError("Unable to add this product to cart.");
    }
  };

  const renderProduct = (product) => (
    <ProductCard
      key={product._id}
      product={product}
      formatPrice={formatPrice}
      addedProduct={addedProduct}
      handleAddToCart={handleAddToCart}
    />
  );

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

        <div className="mb-8 flex gap-3">
          {["Women", "Men"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
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
              onClick={() => window.location.reload()}
              className="mt-4 border border-black px-5 py-2 text-sm hover:bg-black hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <p className="py-12 text-center text-gray-500">
              No special price products available for {activeTab}.
            </p>
          )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {/* Mobile slider with navigation arrows */}
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

            {/* Desktop grid */}
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