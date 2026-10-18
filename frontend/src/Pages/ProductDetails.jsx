import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Leaf,
  Gem,
  Star,
  Plus,
  Minus,
  ChevronRight,
  ZoomIn,
} from "lucide-react";

const API_URL = "http://localhost:8080/api/v1/products";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok || !data.ok || !data.product) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data.product);
        setActiveImage(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError("Product ID is missing from URL");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          <p className="animate-pulse text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p className="text-center text-red-600">
          {error || "Product not found"}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="border border-black px-5 py-2 text-sm transition-colors hover:bg-black hover:text-white"
        >
          Try Again
        </button>

        <Link to="/" className="text-sm underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const originalPrice = Number(product.price) || 0;
  const specialPrice = Number(product.specialPrice) || 0;

  const discount = Math.min(
    100,
    Math.max(0, Number(product.discount) || 0)
  );

  // Special price has priority over percentage discount.
  const discountedPrice =
    specialPrice > 0 && specialPrice < originalPrice
      ? specialPrice
      : discount > 0
        ? originalPrice - (originalPrice * discount) / 100
        : originalPrice;

  const onSale =
    originalPrice > 0 && discountedPrice < originalPrice;

  const stock = Math.max(0, Number(product.stock) || 0);

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  const discountPercentage =
    onSale && originalPrice > 0
      ? Math.round(
          ((originalPrice - discountedPrice) / originalPrice) * 100
        )
      : 0;

  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : [];

  const colors = Array.isArray(product.colors)
    ? product.colors
    : product.color
      ? [product.color]
      : [];

  const fabric =
    product.fabric || product.material || "Not specified";

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const addToCart = () => {
    setMessage("");

    if (stock <= 0) {
      setMessage("This product is out of stock.");
      return;
    }

    if (quantity > stock) {
      setMessage(`Only ${stock} items are available.`);
      return;
    }

    const cartItem = {
      _id: product._id,
      title: product.title,
      price: discountedPrice,
      quantity,
      image: images[0] || "",
    };

    setCart((previous) => {
      const existing = previous.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return previous.map((item) =>
          item._id === product._id
            ? {
                ...item,
                price: discountedPrice,
                quantity: Math.min(
                  item.quantity + quantity,
                  stock
                ),
              }
            : item
        );
      }

      return [...previous, cartItem];
    });

    setMessage("Product added to cart successfully!");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-black">
            Home
          </Link>

          <ChevronRight size={15} />

          <span>{product.gender || "Collection"}</span>

          <ChevronRight size={15} />

          <span className="line-clamp-1 text-gray-900">
            {product.title}
          </span>
        </nav>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="grid grid-cols-[60px_minmax(0,1fr)] gap-3 sm:grid-cols-[85px_minmax(0,1fr)] sm:gap-4">
            <div className="flex flex-col gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`overflow-hidden border-2 transition-all duration-300 hover:opacity-80 active:scale-95 ${
                    activeImage === index
                      ? "scale-[0.98] border-slate-900"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </button>
              ))}
            </div>

            <div className="group relative overflow-hidden bg-stone-100">
              {images.length > 0 ? (
                <img
                  key={images[activeImage]}
                  src={images[activeImage]}
                  alt={product.title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center text-gray-400">
                  No product image available
                </div>
              )}

              {discountPercentage > 0 && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 sm:text-sm">
                  -{discountPercentage}% OFF
                </span>
              )}

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      images[activeImage],
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="Zoom product image"
                  className="absolute bottom-4 right-4 rounded-full bg-white p-3 shadow-md transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white active:scale-95"
                >
                  <ZoomIn size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gray-500">
              {product.brand || "SOLEORA COLLECTION"}
            </p>

            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={`text-3xl font-bold ${
                  onSale ? "text-red-600" : "text-slate-900"
                }`}
              >
                {formatPrice(discountedPrice)}
              </span>

              {onSale && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>

                  <span className="bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
                    Save {formatPrice(originalPrice - discountedPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              {stock > 5 ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-green-600" />
                  </span>
                  In Stock — {stock} items available
                </div>
              ) : stock > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
                  Only {stock} left in stock!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Out of Stock
                </div>
              )}
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium">Available Sizes:</p>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((size, index) => (
                    <span
                      key={`${size}-${index}`}
                      className="border border-gray-300 px-4 py-2 text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium">Available Colors:</p>
                <p className="text-sm text-gray-600">
                  {colors.join(", ")}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Quantity:</p>

              <div className="inline-flex h-11 items-center border border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setQuantity((previous) => Math.max(1, previous - 1));
                    setMessage("");
                  }}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="h-full px-4 transition-colors hover:bg-gray-100 active:scale-90 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span className="flex h-full min-w-14 items-center justify-center border-x border-gray-200">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setQuantity((previous) =>
                      Math.min(stock, previous + 1)
                    );
                    setMessage("");
                  }}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                  className="h-full px-4 transition-colors hover:bg-gray-100 active:scale-90 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={addToCart}
              disabled={stock <= 0 || quantity > stock}
              className="mt-6 flex h-14 w-full items-center justify-center gap-3 bg-slate-900 px-6 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <ShoppingCart size={20} />
              {stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            {message && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${
                  message.includes("successfully")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Service Benefits */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-100 pb-7">
              <div className="flex flex-col items-center gap-2 px-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <Truck size={24} />
                <span className="text-xs">Fast Delivery</span>
              </div>

              <div className="flex flex-col items-center gap-2 px-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <ShieldCheck size={24} />
                <span className="text-xs">Secure Payment</span>
              </div>

              <div className="flex flex-col items-center gap-2 px-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <RefreshCw size={24} />
                <span className="text-xs">Easy Returns</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold">PRODUCT DETAILS</h2>

              <div className="mt-6 space-y-5 text-sm leading-7">
                <div>
                  <h3 className="font-bold">FABRIC / MATERIAL:</h3>
                  <p className="text-gray-600">{fabric}</p>
                </div>

                <div>
                  <h3 className="font-bold">COLOR:</h3>
                  <p className="text-gray-600">
                    {colors.length > 0
                      ? colors.join(", ")
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold">DESCRIPTION:</h3>
                  <p className="whitespace-pre-line text-gray-600">
                    {product.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Benefits */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-gray-200 border-y border-gray-100 py-5">
              <div className="flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <Leaf size={24} />
                <span className="text-xs">Premium Quality</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <Gem size={24} />
                <span className="text-xs">Elegant Design</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-1">
                <Star size={24} />
                <span className="text-xs">Quality Craftsmanship</span>
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="mt-8 animate-[fadeIn_0.4s_ease-out] border border-gray-200 p-4">
                <h3 className="font-bold">Cart Summary</h3>

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="mt-3 flex justify-between gap-4 text-sm"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>

                    <span className="whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <p className="mt-4 border-t pt-3 font-bold">
                  Total:{" "}
                  {formatPrice(
                    cart.reduce(
                      (total, item) =>
                        total + item.price * item.quantity,
                      0
                    )
                  )}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}