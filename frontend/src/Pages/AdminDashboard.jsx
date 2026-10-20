
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Boxes,
  CircleDollarSign,
  Pencil,
  Save,
  XCircle,
  Plus,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1";

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Off White", hex: "#FAF9F6" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Snow", hex: "#FFFAFA" },
  { name: "Floral White", hex: "#FFFAF0" },
  { name: "Ghost White", hex: "#F8F8FF" },
  { name: "White Smoke", hex: "#F5F5F5" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Wheat", hex: "#F5DEB3" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Sand", hex: "#C2B280" },
  { name: "Taupe", hex: "#483C32" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Chocolate", hex: "#7B3F00" },
  { name: "Coffee", hex: "#6F4E37" },
  { name: "Mocha", hex: "#967969" },
  { name: "Caramel", hex: "#C68E17" },
  { name: "Cocoa", hex: "#875F42" },
  { name: "Chestnut", hex: "#954535" },
  { name: "Walnut", hex: "#773F1A" },
  { name: "Mahogany", hex: "#C04000" },
  { name: "Rust", hex: "#B7410E" },
  { name: "Copper", hex: "#B87333" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Platinum", hex: "#E5E4E2" },
  { name: "Gray", hex: "#808080" },
  { name: "Light Gray", hex: "#D3D3D3" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Ash Gray", hex: "#B2BEB5" },
  { name: "Graphite", hex: "#383838" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Baby Blue", hex: "#89CFF0" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Powder Blue", hex: "#B0E0E6" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Denim Blue", hex: "#1560BD" },
  { name: "Ocean Blue", hex: "#0077BE" },
  { name: "Ice Blue", hex: "#D6F1FF" },
  { name: "Midnight Blue", hex: "#191970" },
  { name: "Cobalt Blue", hex: "#0047AB" },
  { name: "Teal Blue", hex: "#367588" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Aqua", hex: "#00FFFF" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Mint", hex: "#98FF98" },
  { name: "Seafoam", hex: "#9FE2BF" },
  { name: "Petrol Blue", hex: "#005F6A" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Periwinkle", hex: "#CCCCFF" },
  { name: "Cornflower Blue", hex: "#6495ED" },
  { name: "Purple", hex: "#800080" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Lilac", hex: "#C8A2C8" },
  { name: "Violet", hex: "#8F00FF" },
  { name: "Plum", hex: "#DDA0DD" },
  { name: "Mauve", hex: "#E0B0FF" },
  { name: "Orchid", hex: "#DA70D6" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Fuchsia", hex: "#FF00FF" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Baby Pink", hex: "#F4C2C2" },
  { name: "Dusty Pink", hex: "#DCAE96" },
  { name: "Blush Pink", hex: "#DE5D83" },
  { name: "Rose Pink", hex: "#FF66CC" },
  { name: "Salmon Pink", hex: "#FF91A4" },
  { name: "Coral Pink", hex: "#F88379" },
  { name: "Peach", hex: "#FFE5B4" },
  { name: "Apricot", hex: "#FBCEB1" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Salmon", hex: "#FA8072" },
  { name: "Red", hex: "#FF0000" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Maroon", hex: "#800000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Wine", hex: "#722F37" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Scarlet", hex: "#FF2400" },
  { name: "Cherry Red", hex: "#D2042D" },
  { name: "Brick Red", hex: "#CB4154" },
  { name: "Tomato Red", hex: "#FF6347" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Dark Orange", hex: "#FF8C00" },
  { name: "Burnt Orange", hex: "#CC5500" },
  { name: "Tangerine", hex: "#F28500" },
  { name: "Amber", hex: "#FFBF00" },
  { name: "Mustard", hex: "#FFDB58" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Lemon Yellow", hex: "#FFF44F" },
  { name: "Pastel Yellow", hex: "#FDFD96" },
  { name: "Butter Yellow", hex: "#FCE883" },
  { name: "Olive", hex: "#808000" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Green", hex: "#008000" },
  { name: "Dark Green", hex: "#006400" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Emerald Green", hex: "#50C878" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Mint Green", hex: "#AAF0D1" },
  { name: "Pistachio", hex: "#93C572" },
  { name: "Moss Green", hex: "#8A9A5B" },
  { name: "Army Green", hex: "#4B5320" },
  { name: "Hunter Green", hex: "#355E3B" },
  { name: "Jade Green", hex: "#00A86B" },
  { name: "Sea Green", hex: "#2E8B57" },
  { name: "Neon Green", hex: "#39FF14" },
  { name: "Teal", hex: "#008080" },
  { name: "Aqua Green", hex: "#00FFBF" },
  { name: "Chartreuse", hex: "#7FFF00" },
  { name: "Fern Green", hex: "#4F7942" },
  { name: "Kelly Green", hex: "#4CBB17" },
  { name: "Pine Green", hex: "#01796F" },
  { name: "Purple Plum", hex: "#673147" },
  { name: "Eggplant", hex: "#614051" },
  { name: "Grape", hex: "#6F2DA8" },
  { name: "Amethyst", hex: "#9966CC" },
  { name: "Royal Purple", hex: "#7851A9" },
  { name: "Pastel Purple", hex: "#B39EB5" },
  { name: "Electric Purple", hex: "#BF00FF" },
  { name: "Blue Violet", hex: "#8A2BE2" },
  { name: "Raspberry", hex: "#E30B5D" },
  { name: "Berry", hex: "#990F4B" },
  { name: "Mulberry", hex: "#C54B8C" },
  { name: "Dusty Rose", hex: "#DCAE96" },
  { name: "Antique Rose", hex: "#C08081" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Vanilla", hex: "#F3E5AB" },
  { name: "Oatmeal", hex: "#E6D5B8" },
  { name: "Linen", hex: "#FAF0E6" },
  { name: "Almond", hex: "#EFDECD" },
  { name: "Biscuit", hex: "#EED9C4" },
  { name: "Cinnamon", hex: "#D2691E" },
  { name: "Ginger", hex: "#B06500" },
  { name: "Sienna", hex: "#A0522D" },
  { name: "Umber", hex: "#635147" },
  { name: "Sepia", hex: "#704214" },
  { name: "Caramel Brown", hex: "#AF6E4D" },
  { name: "Stone", hex: "#928E85" },
  { name: "Greige", hex: "#BEB5A7" },
  { name: "Pewter", hex: "#899499" },
  { name: "Gunmetal", hex: "#2A3439" },
  { name: "Onyx", hex: "#353839" },
  { name: "Jet Black", hex: "#343434" },
  { name: "Pearl", hex: "#EAE0C8" },
  { name: "Opal", hex: "#A8C3BC" },
  { name: "Sea Blue", hex: "#006994" },
  { name: "Lagoon", hex: "#4CB7A5" },
  { name: "Lagoon Blue", hex: "#007F86" },
  { name: "Arctic Blue", hex: "#C6E6FB" },
  { name: "Glacier Blue", hex: "#78B8D5" },
  { name: "Denim", hex: "#6F8FAF" },
  { name: "Washed Blue", hex: "#9DB4C0" },
  { name: "Vintage Blue", hex: "#547AA5" },
  { name: "Pastel Blue", hex: "#AEC6CF" },
  { name: "Pastel Green", hex: "#77DD77" },
  { name: "Pastel Pink", hex: "#FFD1DC" },
  { name: "Pastel Orange", hex: "#FFB347" },
  { name: "Pastel Red", hex: "#FF6961" },
  { name: "Pastel Teal", hex: "#99E6B3" },
  { name: "Pastel Peach", hex: "#FFDAB9" },
  { name: "Pastel Brown", hex: "#836953" },
  { name: "Pastel Gray", hex: "#CFCFC4" },
  { name: "Neon Pink", hex: "#FF10F0" },
  { name: "Neon Blue", hex: "#1F51FF" },
  { name: "Neon Orange", hex: "#FF5F1F" },
  { name: "Neon Yellow", hex: "#DFFF00" },
  { name: "Neon Purple", hex: "#BC13FE" },
  { name: "Fluorescent Green", hex: "#CCFF00" },
  { name: "Electric Blue", hex: "#7DF9FF" },
  { name: "Electric Cyan", hex: "#00FFFF" },
  { name: "Ice Gray", hex: "#D7DDE2" },
  { name: "Cloud Gray", hex: "#E6E6E6" },
  { name: "Storm Gray", hex: "#71797E" },
  { name: "Blue Gray", hex: "#6699CC" },
  { name: "Green Gray", hex: "#A9BA9D" },
  { name: "Warm Gray", hex: "#BEB5A7" },
  { name: "Cool Gray", hex: "#8C92AC" },
  { name: "Red Orange", hex: "#FF4500" },
  { name: "Yellow Orange", hex: "#FFAE42" },
  { name: "Golden Yellow", hex: "#FFC000" },
  { name: "Dark Mustard", hex: "#B8860B" },
  { name: "Curry", hex: "#CDA434" },
  { name: "Saffron", hex: "#F4C430" },
  { name: "Burgundy Red", hex: "#9B1B30" },
  { name: "Ox Blood", hex: "#4A0000" },
  { name: "Plum Wine", hex: "#673147" },
  { name: "Dark Chocolate", hex: "#3C1F0B" },
  { name: "Espresso", hex: "#4E312D" },
  { name: "Toffee", hex: "#755139" },
  { name: "Honey", hex: "#EB9605" },
  { name: "Maple", hex: "#BB9351" },
  { name: "Tobacco", hex: "#71543E" },
  { name: "Mushroom", hex: "#BAA89B" },
  { name: "Putty", hex: "#D3BBAA" },
  { name: "Clay", hex: "#B66A50" },
  { name: "Terracotta", hex: "#E2725B" },
  { name: "Brick", hex: "#AA4A44" },
  { name: "Dusty Blue", hex: "#8CA6DB" },
  { name: "Cornsilk", hex: "#FFF8DC" },
  { name: "Pale Pink", hex: "#FADADD" },
  { name: "Pale Blue", hex: "#D0F0FD" },
  { name: "Pale Green", hex: "#D0F0C0" },
  { name: "Pale Lavender", hex: "#E6E6FA" },
  { name: "Pale Yellow", hex: "#FFFF99" },
  { name: "Pale Peach", hex: "#FFE5B4" },
  { name: "Pale Gray", hex: "#F0F0F0" },
  { name: "Pale Mint", hex: "#DDFADA" },
  { name: "Dark Teal", hex: "#014D4E" },
  { name: "Dark Navy", hex: "#000033" },
  { name: "Dark Olive", hex: "#556B2F" },
  { name: "Dark Purple", hex: "#301934" },
  { name: "Dark Brown", hex: "#654321" },
  { name: "Dark Maroon", hex: "#560319" },
  { name: "Dark Charcoal", hex: "#232B2B" },
  { name: "Dark Slate", hex: "#2F4F4F" },
  { name: "Dark Cyan", hex: "#008B8B" },
  { name: "Dark Magenta", hex: "#8B008B" },
  { name: "Dark Salmon", hex: "#E9967A" },
  { name: "Dark Khaki", hex: "#BDB76B" },
  { name: "Dark Sea Green", hex: "#8FBC8F" },
  { name: "Dark Orchid", hex: "#9932CC" },
  { name: "Dark Violet", hex: "#9400D3" },
  { name: "Light Coral", hex: "#F08080" },
  { name: "Light Salmon", hex: "#FFA07A" },
  { name: "Light Sea Green", hex: "#20B2AA" },
  { name: "Light Steel Blue", hex: "#B0C4DE" },
  { name: "Light Slate Gray", hex: "#778899" },
  { name: "Light Goldenrod", hex: "#FAFAD2" },
  { name: "Light Cyan", hex: "#E0FFFF" },
  { name: "Light Green", hex: "#90EE90" },
  { name: "Light Salmon Pink", hex: "#FF9999" },
  { name: "Light Lavender", hex: "#DCD0FF" },
  { name: "Light Mauve", hex: "#D8BFD8" },
  { name: "Light Peach", hex: "#FFE5B4" },
  { name: "Light Rose", hex: "#FBC0C0" },
  { name: "Light Teal", hex: "#B2DFDB" },
  { name: "Light Turquoise", hex: "#AFEEEE" },
  { name: "Light Violet", hex: "#D8BFD8" },
  { name: "Light Yellow", hex: "#FFFFE0" },
  { name: "Medium Blue", hex: "#0000CD" },
  { name: "Medium Purple", hex: "#9370DB" },
  { name: "Medium Orchid", hex: "#BA55D3" },
  { name: "Medium Sea Green", hex: "#3CB371" },
  { name: "Medium Slate Blue", hex: "#7B68EE" },
  { name: "Medium Turquoise", hex: "#48D1CC" },
  { name: "Medium Violet Red", hex: "#C71585" },
  { name: "Medium Aquamarine", hex: "#66CDAA" },
  { name: "Medium Spring Green", hex: "#00FA9A" },
  { name: "Medium Purple Gray", hex: "#9C8AA5" },
  { name: "Medium Rose", hex: "#D96C8A" },
  { name: "Medium Olive", hex: "#8A8B40" },
  { name: "Medium Brown", hex: "#9B7653" },
  { name: "Medium Charcoal", hex: "#4D4D4D" },
];

const normalizeImages = (images) => {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string" && images.trim()) {
    return images.split(/\n|,/).map((url) => url.trim()).filter(Boolean);
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

const ColorDropdown = ({ selectedColors, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const filteredColors = useMemo(
    () =>
      COLORS.filter((color) =>
        color.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleColor = (colorName) => {
    const exists = selectedColors.includes(colorName);

    onChange(
      exists
        ? selectedColors.filter((color) => color !== colorName)
        : [...selectedColors, colorName]
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium">Product Colors</label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left outline-none hover:border-gray-400 focus:border-black"
        aria-expanded={open}
      >
        <span className="flex flex-wrap items-center gap-2">
          {selectedColors.length ? (
            <>
              {selectedColors.slice(0, 3).map((colorName) => {
                const color = COLORS.find((item) => item.name === colorName);

                return (
                  <span
                    key={colorName}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color?.hex || "#CCCCCC" }}
                    />
                    {colorName}
                  </span>
                );
              })}
              {selectedColors.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{selectedColors.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-400">Search and select colors</span>
          )}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search colors..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{filteredColors.length} colors found</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="font-medium text-red-600 hover:underline"
              >
                Clear selection
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-2">
            {filteredColors.map((color) => {
              const checked = selectedColors.includes(color.name);

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-gray-50 ${
                    checked ? "bg-gray-100" : ""
                  }`}
                >
                  <span
                    className="h-5 w-5 shrink-0 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="flex-1">{color.name}</span>
                  {checked && <Check size={17} className="text-green-600" />}
                </button>
              );
            })}

            {filteredColors.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-gray-500">
                No matching colors found.
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
            >
              Done ({selectedColors.length} selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    specialPrice: "",
    discount: "",
    stock: "",
    brand: "",
    gender: "",
    description: "",
    images: [""],
    colors: [],
    isActive: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products/all`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEditing = (product) => {
    const images = normalizeImages(product.images);
    const specialPrice = product.specialPrice ?? product.discountPrice ?? "";

    setEditingId(product._id);
    setSuccess("");
    setError("");

    setForm({
      title: product.title || "",
      price: product.price ?? "",
      specialPrice,
      discount: calculateDiscount(product.price, specialPrice),
      stock: product.stock ?? 0,
      brand: product.brand || "",
      gender: product.gender || "",
      description: product.description || "",
      images: images.length ? images : [""],
      colors: Array.isArray(product.colors) ? product.colors : [],
      isActive: product.isActive !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setError("");
    setSuccess("");

    setForm({
      title: "",
      price: "",
      specialPrice: "",
      discount: "",
      stock: "",
      brand: "",
      gender: "",
      description: "",
      images: [""],
      colors: [],
      isActive: true,
    });
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "price" || name === "specialPrice") {
        next.discount = calculateDiscount(
          name === "price" ? value : prev.price,
          name === "specialPrice" ? value : prev.specialPrice
        );
      }

      if (name === "discount") {
        const price = Number(prev.price);
        const discount = Number(value);

        next.specialPrice =
          price > 0 && value !== "" && discount >= 0 && discount <= 100
            ? Math.round(price * (1 - discount / 100) * 100) / 100
            : "";
      }

      return next;
    });
  };

  const updateImage = (index, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) =>
        imageIndex === index ? value : image
      ),
    }));
  };

  const addImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const images = prev.images.filter((_, imageIndex) => imageIndex !== index);

      return { ...prev, images: images.length ? images : [""] };
    });
  };

  const updateProduct = async (event) => {
    event.preventDefault();

    if (!editingId) return;

    const price = Number(form.price);
    const stock = Number(form.stock);
    const specialPrice =
      form.specialPrice === "" ? null : Number(form.specialPrice);

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid original price.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (
      specialPrice !== null &&
      (!Number.isFinite(specialPrice) ||
        specialPrice < 0 ||
        specialPrice >= price)
    ) {
      setError("Special price must be less than the original price.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        price,
        stock,
        brand: form.brand.trim(),
        gender: form.gender,
        description: form.description,
        images: form.images.map((image) => image.trim()).filter(Boolean),
        colors: form.colors,
        isActive: form.isActive,
        specialPrice: specialPrice ?? 0,
        discount: calculateDiscount(price, specialPrice),
      };

      const response = await fetch(`${API_URL}/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Product update failed.");
      }

      if (!data.product) {
        throw new Error("Product updated, but the API did not return the updated product.");
      }

      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingId ? data.product : product
        )
      );

      setSuccess("Product updated successfully!");
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  const activeProducts = products.filter(
    (product) => product.isActive !== false
  );

  const specialProducts = products.filter((product) => {
    const special = product.specialPrice ?? product.discountPrice;
    return Number(special) > 0 && Number(special) < Number(product.price);
  });

  const filteredProducts = products.filter((product) =>
    (product.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const productValue = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", icon: Users, href: "/admin/users" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const stats = [
    { title: "Total Products", value: products.length, icon: Boxes, color: "bg-blue-50 text-blue-600" },
    { title: "Active Products", value: activeProducts.length, icon: Package, color: "bg-green-50 text-green-600" },
    { title: "Special Offers", value: specialProducts.length, icon: TrendingUp, color: "bg-red-50 text-red-600" },
    { title: "Product Value", value: `PKR ${productValue.toLocaleString("en-PK")}`, icon: CircleDollarSign, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <div>
            <h1 className="text-2xl font-black tracking-widest">SOLEORA</h1>
            <p className="mt-1 text-xs text-gray-500">Admin Dashboard</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <ExternalLink size={18} />
            View Store
          </a>

          <div className="mt-3 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold">SOLEORA Store</p>
            <p className="mt-1 text-xs text-gray-500">Product Management</p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div>
              <h2 className="text-lg font-bold sm:text-xl">Dashboard</h2>
              <p className="hidden text-xs text-gray-500 sm:block">
                Welcome to your store management panel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:px-4"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          <section>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Store overview</p>
              <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                Welcome Back, Admin
              </h3>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {editingId && (
              <section className="relative z-20 mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Edit Product</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update price, discount, images, colors and product details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    aria-label="Close editor"
                  >
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={updateProduct} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Product Title</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Brand</label>
                      <input
                        name="brand"
                        value={form.brand}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Original Price (PKR)</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Discount (%)</label>
                      <input
                        name="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={form.discount}
                        onChange={handleFormChange}
                        placeholder="e.g. 20"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Discount automatically calculates the special price.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Special Price (PKR)</label>
                      <input
                        name="specialPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.specialPrice}
                        onChange={handleFormChange}
                        placeholder="No offer: leave blank"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Current discount: {calculateDiscount(form.price, form.specialPrice)}%
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Stock</label>
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleFormChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      >
                        <option value="">Select gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <ColorDropdown
                        selectedColors={form.colors}
                        onChange={(colors) =>
                          setForm((prev) => ({ ...prev, colors }))
                        }
                      />

                      {form.colors.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {form.colors.map((colorName) => {
                            const color = COLORS.find(
                              (item) => item.name === colorName
                            );

                            return (
                              <span
                                key={colorName}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs"
                              >
                                <span
                                  className="h-3 w-3 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: color?.hex || "#CCCCCC",
                                  }}
                                />
                                {colorName}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      colors: prev.colors.filter(
                                        (item) => item !== colorName
                                      ),
                                    }))
                                  }
                                  aria-label={`Remove ${colorName}`}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <X size={13} />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium">Product Images (URLs)</label>
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
                                alt={`Product preview ${index + 1}`}
                                className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.visibility = "hidden";
                                }}
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                <Package size={20} />
                              </div>
                            )}

                            <input
                              type="url"
                              value={image}
                              onChange={(event) =>
                                updateImage(index, event.target.value)
                              }
                              placeholder="https://example.com/product-image.jpg"
                              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                            />

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              aria-label="Remove image URL"
                              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Add public image URLs. The first image is used as the main preview.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                        <input
                          name="isActive"
                          type="checkbox"
                          checked={form.isActive}
                          onChange={handleFormChange}
                          className="h-4 w-4 accent-black"
                        />
                        Product is active and visible
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                    >
                      <XCircle size={17} />
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <div className={`rounded-xl p-3 ${stat.color}`}>
                        <Icon size={21} />
                      </div>
                    </div>
                    <p className="mt-5 break-words text-2xl font-bold">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold">Products Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and edit your products.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4 font-semibold">Product</th>
                    <th className="px-3 py-4 font-semibold">Price</th>
                    <th className="px-3 py-4 font-semibold">Discount</th>
                    <th className="px-3 py-4 font-semibold">Stock</th>
                    <th className="px-3 py-4 font-semibold">Colors</th>
                    <th className="px-3 py-4 font-semibold">Gender</th>
                    <th className="px-3 py-4 font-semibold">Status</th>
                    <th className="px-3 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading &&
                    filteredProducts.map((product) => {
                      const specialPrice =
                        product.specialPrice ?? product.discountPrice;
                      const discount = calculateDiscount(
                        product.price,
                        specialPrice
                      );
                      const images = normalizeImages(product.images);

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  images[0] ||
                                  "https://placehold.co/60x70?text=Item"
                                }
                                alt={product.title || "Product"}
                                className="h-14 w-12 rounded-lg bg-gray-100 object-cover"
                              />
                              <div>
                                <p className="max-w-[200px] truncate font-semibold">
                                  {product.title}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {product.brand || "SOLEORA"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div className="font-semibold">
                              PKR {Number(product.price || 0).toLocaleString("en-PK")}
                            </div>
                            {Number(specialPrice) > 0 &&
                              Number(specialPrice) < Number(product.price) && (
                                <div className="mt-1 text-xs text-red-600">
                                  Offer: PKR {Number(specialPrice).toLocaleString("en-PK")}
                                </div>
                              )}
                          </td>

                          <td className="px-3 py-4">
                            {discount > 0 ? (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                {discount}% OFF
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-3 py-4">{product.stock ?? 0}</td>

                          <td className="px-3 py-4">
                            <div className="flex max-w-36 flex-wrap gap-1">
                              {(Array.isArray(product.colors)
                                ? product.colors
                                : []
                              ).slice(0, 3).map((colorName) => {
                                const color = COLORS.find(
                                  (item) => item.name === colorName
                                );

                                return (
                                  <span
                                    key={colorName}
                                    title={colorName}
                                    className="h-5 w-5 rounded-full border border-gray-300"
                                    style={{
                                      backgroundColor: color?.hex || "#CCCCCC",
                                    }}
                                  />
                                );
                              })}
                              {(product.colors || []).length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{product.colors.length - 3}
                                </span>
                              )}
                              {(!Array.isArray(product.colors) ||
                                product.colors.length === 0) && "—"}
                            </div>
                          </td>

                          <td className="px-3 py-4">{product.gender || "—"}</td>

                          <td className="px-3 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.isActive !== false
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {product.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-3 py-4">
                            <button
                              type="button"
                              onClick={() => startEditing(product)}
                              className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                  {!loading && !error && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-3 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}

                  {loading && (
                    <tr>
                      <td colSpan="8" className="px-3 py-12 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Showing {filteredProducts.length} products.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
