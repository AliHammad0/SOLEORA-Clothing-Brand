import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const API_URL = "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/all";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(
          productList.filter(
            (product) => product.isActive && product.isNewArrival
          )
        );
      } catch (err) {
        setError(err.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p>Loading new arrivals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-white px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-500">
              Just Dropped
            </p>
            <h2 className="text-3xl font-bold uppercase tracking-tight md:text-5xl">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden border-b border-black pb-1 text-sm font-semibold uppercase tracking-wider sm:block"
          >
            View All
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No new arrivals available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="group">
                <Link
                  to={`/products/${product._id}`}
                  className="relative block overflow-hidden bg-gray-100"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    New
                  </span>
                </Link>

                <div className="flex items-start justify-between gap-3 pt-4">
                  <div className="min-w-0">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-semibold transition-colors hover:text-gray-500">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm text-gray-500">
                      {product.brand}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-bold">
                        Rs.{" "}
                        {product.specialPrice ||
                          product.discountPrice ||
                          product.price}
                      </span>

                      {(product.specialPrice || product.discountPrice) && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/products/${product._id}`}
                    aria-label={`View ${product.title}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-gray-300 transition-colors hover:bg-black hover:text-white"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </div>

                <Link
                  to={`/products/${product._id}`}
                  className="mt-4 block w-full border border-black py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-white"
                >
                  Discover Product
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;