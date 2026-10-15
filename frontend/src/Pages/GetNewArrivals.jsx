import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/v1/products/new?limit=8";

const GetNewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Products load nahi huay");
        }

        setProducts(
          (data.products || []).filter(
            (product) =>
              product.isActive === true &&
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
          <p className="py-12 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            No new arrivals available right now.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => {
              const price = Number(product.price || 0);

              const specialPrice = Number(
                product.specialPrice || product.discountPrice || 0
              );

              const hasDiscount =
                specialPrice > 0 && specialPrice < price;

              const image =
                product.images?.[0] ||
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
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://placehold.co/600x750?text=SOLEORA";
                        }}
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-semibold text-black">
                        NEW
                      </span>

                      {hasDiscount && (
                        <span className="absolute bottom-3 left-3 bg-black px-3 py-1 text-xs font-semibold text-white">
                          SALE
                        </span>
                      )}
                    </div>

                    <div className="pt-4">
                      <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                        {product.category?.name ||
                          product.category ||
                          product.gender ||
                          "Collection"}
                      </p>

                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                        {product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-sm font-bold text-black">
                              PKR {specialPrice.toLocaleString("en-PK")}
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              PKR {price.toLocaleString("en-PK")}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-black">
                            PKR {price.toLocaleString("en-PK")}
                          </span>
                        )}
                      </div>

                      {product.colors?.length > 0 && (
                        <p className="mt-2 text-xs text-gray-500">
                          Colors: {product.colors.join(", ")}
                        </p>
                      )}
                    </div>
                  </Link>
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