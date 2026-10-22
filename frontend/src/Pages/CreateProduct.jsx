import { useState } from "react";
import axios from "axios";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/create";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  specialPrice: "",
  discount: "0",
  brand: "SOLEORA",
  category: "",
  images: "",
  stock: "0",
  sizes: "",
  colors: "",
  gender: "",
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};

export default function CreateProduct() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title") {
        next.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }

      return next;
    });
  };

  const toArray = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        specialPrice:
          form.specialPrice === ""
            ? null
            : Number(form.specialPrice),
        discount: Number(form.discount || 0),
        brand: form.brand.trim(),
        category: form.category.trim(),
        images: toArray(form.images),
        stock: Number(form.stock),
        sizes: toArray(form.sizes),
        colors: toArray(form.colors),
        gender: form.gender,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isActive: form.isActive,
      };

      if (
        payload.specialPrice !== null &&
        (payload.specialPrice <= 0 ||
          payload.specialPrice >= payload.price)
      ) {
        setError(
          "Special price must be less than the original price."
        );
        return;
      }

      if (payload.discount < 0 || payload.discount > 100) {
        setError("Discount must be between 0 and 100.");
        return;
      }

      const response = await axios.post(API_URL, payload);

      setMessage(
        response.data.message || "Product created successfully!"
      );

      setForm({ ...initialForm });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create product. Check your server and connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  const fields = [
    {
      name: "title",
      label: "Product Title",
      placeholder: "Classic Sneakers",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      placeholder: "classic-sneakers",
      required: true,
    },
    {
      name: "price",
      label: "Original Price",
      placeholder: "5000",
      type: "number",
      required: true,
    },
    {
      name: "specialPrice",
      label: "Special Price (Optional)",
      placeholder: "3500",
      type: "number",
    },
    {
      name: "discount",
      label: "Discount (%)",
      placeholder: "20",
      type: "number",
    },
    {
      name: "brand",
      label: "Brand",
      placeholder: "SOLEORA",
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
      placeholder: "0",
    },
    {
      name: "sizes",
      label: "Sizes (comma-separated)",
      placeholder: "39, 40, 41, 42",
    },
    {
      name: "colors",
      label: "Colors (comma-separated)",
      placeholder: "Black, White, Blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create Product
        </h1>

        <p className="mb-8 text-gray-500">
          Enter your product details and optional special offer price.
        </p>

        {message && (
          <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label className={labelClass}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>

                <input
                  className={inputClass}
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required || false}
                  min={field.type === "number" ? "0" : undefined}
                  max={field.name === "discount" ? "100" : undefined}
                  step={field.type === "number" ? "0.01" : undefined}
                />
              </div>
            ))}

            <div>
              <label className={labelClass}>
                Category *
              </label>
              <input
                className={inputClass}
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Shoes, Clothing, Accessories"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                className={inputClass}
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                className={inputClass}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Image URLs (comma-separated)
              </label>
              <textarea
                className={inputClass}
                name="images"
                value={form.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-t pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active Product
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}