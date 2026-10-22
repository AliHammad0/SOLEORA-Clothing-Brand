
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/all";

const CategoryProducts = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products load nahi ho sake.");
        }

        const result = await response.json();

        const allProducts = Array.isArray(result)
          ? result
          : Array.isArray(result.products)
          ? result.products
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.products)
          ? result.data.products
          : [];

        const filteredProducts = allProducts.filter((product) => {
          const productCategory = String(
            product.category || product.gender || ""
          ).toLowerCase();

          return (
            productCategory === category.toLowerCase() &&
            product.isActive !== false
          );
        });

        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#191919]">
      {/* Collection Hero */}
      <section className="px-4 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 sm:text-xs">
            <Link to="/" className="transition hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span>{category} Collection</span>
          </div>

          <div className="relative overflow-hidden bg-[#eee9e0] px-6 py-10 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-black/10 sm:h-80 sm:w-80" />
            <div className="pointer-events-none absolute -right-2 -top-12 h-48 w-48 border border-black/10 sm:h-64 sm:w-64" />

            <div className="relative z-10 max-w-2xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-600 sm:text-xs">
                THE SOLEORA EDIT
              </p>

              <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {category}
                <br />
                <span className="font-serif italic">
                  Collection.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600 sm:text-base">
                Discover your next favourite style with SOLEORA.
                Thoughtfully selected footwear for every moment.
              </p>

              <a
                href="#collection-products"
                className="mt-7 inline-flex items-center gap-4 bg-[#191919] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 sm:mt-9"
              >
                Explore Collection
                <span aria-hidden="true">↘</span>
              </a>
            </div>

            <div className="absolute bottom-5 right-5 hidden text-right sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Designed for your everyday
              </p>
              <p className="mt-1 text-sm font-medium tracking-wide">
                SOLEORA®
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="collection-products"
        className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-5 sm:mb-9">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                MADE FOR YOUR STYLE
              </p>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Shop {category}
              </h2>
            </div>

            {!loading && !error && (
              <p className="text-xs text-neutral-500 sm:text-sm">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#eae7e1]" />
                  <div className="mt-4 h-4 w-3/4 bg-[#eae7e1]" />
                  <div className="mt-3 h-3 w-1/2 bg-[#eae7e1]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-neutral-200 bg-white px-5 py-16 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 border border-black px-6 py-3 text-xs uppercase tracking-wider transition hover:bg-black hover:text-white"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white px-5 py-16 text-center sm:py-24">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                SOLEORA COLLECTION
              </p>
              <h3 className="mt-4 text-2xl font-medium">
                New styles are on their way.
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                There are no products in this collection right now.
                Explore the store to find your next favourite.
              </p>
              <Link
                to="/"
                className="mt-7 inline-flex border border-black px-6 py-3 text-xs uppercase tracking-wider transition hover:bg-black hover:text-white"
              >
                Explore All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4">
              {products.map((product) => {
                const productId = product._id || product.id;

                const originalPrice = Number(
                  product.price ??
                    product.originalPrice ??
                    product.original_price ??
                    0
                );

                const specialPrice = Number(
                  product.specialPrice ??
                    product.discountPrice ??
                    product.discount_price ??
                    0
                );

                const hasValidSpecialPrice =
                  Number.isFinite(originalPrice) &&
                  Number.isFinite(specialPrice) &&
                  originalPrice > 0 &&
                  specialPrice > 0 &&
                  specialPrice < originalPrice;

                const price = hasValidSpecialPrice
                  ? specialPrice
                  : originalPrice;

                const discount = hasValidSpecialPrice
                  ? Math.round(
                      ((originalPrice - price) / originalPrice) * 100
                    )
                  : 0;

                const image = Array.isArray(product.images)
                  ? product.images[0]
                  : Array.isArray(product.image)
                  ? product.image[0]
                  : product.image || product.images || "";

                const title =
                  product.title || product.name || "SOLEORA Product";

                return (
                  <Link
                    key={productId}
                    to={`/product/${productId}`}
                    className="group min-w-0"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eeece7]">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
                          SOLEORA
                        </div>
                      )}

                      {discount > 0 && (
                        <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-black sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
                          -{discount}%
                        </span>
                      )}

                      {product.isNewArrival && (
                        <span className="absolute right-2 top-2 bg-[#191919] px-2 py-1 text-[9px] uppercase tracking-wider text-white sm:right-3 sm:top-3 sm:px-3 sm:text-[10px]">
                          New
                        </span>
                      )}

                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 px-3 py-3 text-center text-[10px] uppercase tracking-[0.16em] text-white transition-transform duration-300 group-hover:translate-y-0 max-sm:hidden">
                        View Product
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4">
                      {product.brand && (
                        <p className="mb-1.5 text-[9px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[10px]">
                          {product.brand}
                        </p>
                      )}

                      <h3 className="line-clamp-2 text-sm font-medium leading-5 text-neutral-900 transition group-hover:text-neutral-500 sm:text-base">
                        {title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-neutral-950">
                          PKR {price.toLocaleString()}
                        </span>

                        {hasValidSpecialPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            PKR {originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.stock !== undefined && (
                        <p
                          className={`mt-2 text-[10px] ${
                            product.stock > 0
                              ? "text-neutral-500"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock > 0
                            ? "Available"
                            : "Out of stock"}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brand footer banner */}
      <section className="border-t border-neutral-200 bg-white px-4 py-12 text-center sm:px-8 sm:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
          STEP INTO YOUR STYLE
        </p>
        <h2 className="mt-3 font-serif text-3xl italic tracking-tight sm:text-4xl">
          Find your sole story.
        </h2>
        <Link
          to="/"
          className="mt-6 inline-flex border-b border-black pb-1 text-xs uppercase tracking-[0.15em] transition hover:text-neutral-500"
        >
          Discover SOLEORA
        </Link>
      </section>
    </main>
  );
};

export default CategoryProducts;
