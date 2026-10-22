
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images
      .filter((image) => typeof image === "string")
      .map((image) => image.trim())
      .filter(Boolean);
  }

  if (typeof images === "string" && images.trim()) {
    return images
      .split(/[\n,]/)
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

const calculateDiscount = (price, specialPrice) => {
  const original = Number(price);
  const special = Number(specialPrice);

  if (
    !Number.isFinite(original) ||
    !Number.isFinite(special) ||
    original <= 0 ||
    special <= 0 ||
    special >= original
  ) {
    return 0;
  }

  return Math.round(((original - special) / original) * 100);
};

const getRegularPrice = (product) => {
  const candidates = [
    product?.price,
    product?.originalPrice,
    product?.original_price,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") {
      continue;
    }

    const value = Number(candidate);

    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }

  return "";
};

const getSpecialPrice = (product, regularPrice) => {
  const candidates = [
    product?.specialPrice,
    product?.discountPrice,
    product?.discount_price,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") {
      continue;
    }

    const value = Number(candidate);

    if (
      Number.isFinite(value) &&
      value > 0 &&
      Number(regularPrice) > 0 &&
      value < Number(regularPrice)
    ) {
      return value;
    }
  }

  // Discount ki bunyaad par Special Price auto-generate nahi hogi.
  return "";
};

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    specialPrice: "",
    discount: "0",
    stock: "0",
    brand: "SOLEORA",
    gender: "",
    description: "",
    images: [""],
    colors: [],
    isActive: true,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || "Product load nahi ho saka."
          );
        }

        const product = data.product || data;

        if (!product?._id) {
          throw new Error("Product data nahi mila.");
        }

        const price = getRegularPrice(product);
        const specialPrice = getSpecialPrice(product, price);
        const images = normalizeImages(product.images);

        setForm({
          title: product.title || "",
          price: price === "" ? "" : String(price),

          // Sirf database mein saved Special Price load hogi.
          specialPrice:
            specialPrice === "" ? "" : String(specialPrice),

          // Discount apni saved value se load hoga.
          discount: String(Number(product.discount || 0)),

          stock: String(product.stock ?? 0),
          brand: product.brand || "SOLEORA",
          gender: product.gender || "",
          description: product.description || "",
          images: images.length ? images : [""],
          colors: Array.isArray(product.colors)
            ? product.colors
            : [],
          isActive: product.isActive !== false,
        });
      } catch (err) {
        setError(err.message || "Product load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    } else {
      setError("Product ID nahi mili.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateImage = (index, value) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.map((image, imageIndex) =>
        imageIndex === index ? value : image
      ),
    }));
  };

  const addImage = () => {
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImage = (index) => {
    setForm((previous) => {
      const images = previous.images.filter(
        (_, imageIndex) => imageIndex !== index
      );

      return {
        ...previous,
        images: images.length ? images : [""],
      };
    });
  };

  const handleColorsChange = (value) => {
    const colors = value
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    setForm((previous) => ({
      ...previous,
      colors: [...new Set(colors)],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const stock = Number(form.stock);
    const discount = Number(form.discount || 0);

    // Blank Special Price ko null save karein.
    const specialPrice =
      form.specialPrice.trim() === ""
        ? null
        : Number(form.specialPrice);

    if (!form.title.trim()) {
      setError("Product title required hai.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Original price zero se zyada honi chahiye.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError("Stock sahi enter karein.");
      return;
    }

    if (!Number.isInteger(stock)) {
      setError("Stock whole number mein enter karein.");
      return;
    }

    if (
      specialPrice !== null &&
      (!Number.isFinite(specialPrice) ||
        specialPrice <= 0 ||
        specialPrice >= price)
    ) {
      setError(
        "Special Price original price se kam honi chahiye."
      );
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount >= 100
    ) {
      setError("Discount 0 se 99 ke darmiyan enter karein.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        price,
        specialPrice,
        discount,
        stock,
        brand: form.brand.trim() || "SOLEORA",
        gender: form.gender,
        description: form.description.trim(),
        images: normalizeImages(form.images),
        colors: form.colors,
        isActive: form.isActive,
      };

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || "Product update nahi ho saka."
        );
      }

      setSuccess("Product successfully update ho gaya!");

      window.scrollTo({ top: 0, behavior: "smooth" });

      window.setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message || "Product update nahi ho saka.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Update Product
          </h1>

          <p className="mb-7 mt-2 text-sm text-gray-500">
            Product ki details, price, discount aur stock update karein.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Brand
                </label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Original Price (PKR) *
                </label>
                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Discount (%)
                </label>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  max="99"
                  step="1"
                  value={form.discount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Special Price (PKR)
                </label>
                <input
                  name="specialPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.specialPrice}
                  onChange={handleChange}
                  placeholder="No offer: leave blank"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Special Price sirf khud enter karne par save hogi.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Stock *
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-black"
                  />
                  Product is active and visible
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Colors (comma-separated)
                </label>
                <input
                  value={form.colors.join(", ")}
                  onChange={(event) =>
                    handleColorsChange(event.target.value)
                  }
                  placeholder="Black, White, Blue"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">
                    Product Images (URLs)
                  </label>

                  <button
                    type="button"
                    onClick={addImage}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                  >
                    <Plus size={14} />
                    Add Image
                  </button>
                </div>

                <div className="space-y-3">
                  {form.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      {image.trim() ? (
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-100" />
                      )}

                      <input
                        type="url"
                        value={image}
                        onChange={(event) =>
                          updateImage(index, event.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                        className={`${inputClass} min-w-0 flex-1 text-sm`}
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <Link
                to="/admin/dashboard"
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
