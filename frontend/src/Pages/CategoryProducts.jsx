
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
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-neutral-200 pb-6 sm:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            SOLEORA COLLECTION
          </p>

          <h1 className="text-3xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
            {category} Collection
          </h1>

          <p className="mt-3 text-sm text-neutral-500 sm:text-base">
            Explore the latest styles from SOLEORA.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-500">
            Loading products...
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-black px-5 py-3 text-sm text-white"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-medium text-neutral-900">
              No products found
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Abhi {category.toLowerCase()} category mein products available nahi hain.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => {
              const price = Number(
                product.specialPrice ??
                  product.discountPrice ??
                  product.price ??
                  0
              );

              const originalPrice = Number(
                product.originalPrice ?? product.price ?? 0
              );

              const image = Array.isArray(product.images)
                ? product.images[0]
                : Array.isArray(product.image)
                ? product.image[0]
                : product.image || product.images || "";

              return (
                <Link
                  key={product._id || product.id}
                  to={`/product/${product._id || product.id}`}
                  className="group min-w-0"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#f5f3ef]">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title || product.name || category}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <h2 className="truncate text-sm font-medium text-neutral-900 sm:text-base">
                      {product.title || product.name || "SOLEORA Product"}
                    </h2>

                    {product.brand && (
                      <p className="mt-1 text-xs text-neutral-500">
                        {product.brand}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-950">
                        PKR {price.toLocaleString()}
                      </span>

                      {originalPrice > price && (
                        <span className="text-xs text-neutral-400 line-through">
                          PKR {originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {product.stock !== undefined && (
                      <p className="mt-2 text-xs text-neutral-500">
                        {product.stock > 0
                          ? `${product.stock} in stock`
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
    </main>
  );
};

export default CategoryProducts;
