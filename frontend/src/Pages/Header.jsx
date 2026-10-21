
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingBag,
  ChevronDown,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../context/LanguageContext";
import { selectCartCount } from "../redux/slices/cartSlice";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/products/search";

const countries = [
  { code: "PK", name: "Pakistan", currency: "PKR", languages: [{ code: "en", name: "English" }, { code: "ur", name: "اردو" }] },
  { code: "BD", name: "Bangladesh", currency: "BDT", languages: [{ code: "bn", name: "বাংলা" }, { code: "en", name: "English" }] },
  { code: "IN", name: "India", currency: "INR", languages: [{ code: "hi", name: "हिन्दी" }, { code: "en", name: "English" }, { code: "bn", name: "বাংলা" }, { code: "ur", name: "اردو" }] },
  { code: "US", name: "United States", currency: "USD", languages: [{ code: "en", name: "English" }] },
  { code: "GB", name: "United Kingdom", currency: "GBP", languages: [{ code: "en", name: "English" }] },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", languages: [{ code: "ar", name: "العربية" }, { code: "en", name: "English" }] },
  { code: "AE", name: "United Arab Emirates", currency: "AED", languages: [{ code: "ar", name: "العربية" }, { code: "en", name: "English" }] },
  { code: "CN", name: "China", currency: "CNY", languages: [{ code: "zh", name: "简体中文" }, { code: "en", name: "English" }] },
  { code: "JP", name: "Japan", currency: "JPY", languages: [{ code: "ja", name: "日本語" }, { code: "en", name: "English" }] },
  { code: "FR", name: "France", currency: "EUR", languages: [{ code: "fr", name: "Français" }, { code: "en", name: "English" }] },
];

const translations = {
  en: {
    announcement: "FREE DELIVERY ON ORDERS ABOVE",
    shopNow: "SHOP NOW",
    newArrivals: "NEW ARRIVALS",
    women: "WOMEN",
    men: "MEN",
    allWomen: "All Women",
    allMen: "All Men",
    account: "MY ACCOUNT",
    dashboard: "DASHBOARD",
    profile: "PROFILE",
    searchPlaceholder: "Search products...",
    search: "SEARCH",
    country: "Country",
    language: "Language",
    done: "DONE",
    searching: "Searching...",
    noResults: "No products found",
    viewAll: "View all results",
  },
  ur: {
    announcement: "6000 روپے سے زیادہ کے آرڈر پر مفت ڈیلیوری",
    shopNow: "ابھی خریدیں",
    newArrivals: "نئی آمد",
    women: "خواتین",
    men: "مرد",
    allWomen: "تمام خواتین",
    allMen: "تمام مرد",
    account: "میرا اکاؤنٹ",
    dashboard: "ڈیش بورڈ",
    profile: "پروفائل",
    searchPlaceholder: "پروڈکٹس تلاش کریں...",
    search: "تلاش کریں",
    country: "ملک",
    language: "زبان",
    done: "مکمل",
    searching: "تلاش جاری ہے...",
    noResults: "کوئی پروڈکٹ نہیں ملی",
    viewAll: "تمام نتائج دیکھیں",
  },
  bn: {
    announcement: "অর্ডারে ফ্রি ডেলিভারি",
    shopNow: "এখনই কিনুন",
    newArrivals: "নতুন কালেকশন",
    women: "নারী",
    men: "পুরুষ",
    allWomen: "সব নারীদের পণ্য",
    allMen: "সব পুরুষদের পণ্য",
    account: "আমার অ্যাকাউন্ট",
    dashboard: "ড্যাশবোর্ড",
    profile: "প্রোফাইল",
    searchPlaceholder: "পণ্য খুঁজুন...",
    search: "খুঁজুন",
    country: "দেশ",
    language: "ভাষা",
    done: "সম্পন্ন",
    searching: "খোঁজা হচ্ছে...",
    noResults: "কোনো পণ্য পাওয়া যায়নি",
    viewAll: "সব ফলাফল দেখুন",
  },
  hi: {
    announcement: "ऑर्डर पर मुफ़्त डिलीवरी",
    shopNow: "अभी खरीदें",
    newArrivals: "नए उत्पाद",
    women: "महिलाएं",
    men: "पुरुष",
    allWomen: "सभी महिलाओं के उत्पाद",
    allMen: "सभी पुरुषों के उत्पाद",
    account: "मेरा अकाउंट",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    searchPlaceholder: "उत्पाद खोजें...",
    search: "खोजें",
    country: "देश",
    language: "भाषा",
    done: "हो गया",
    searching: "खोज रहे हैं...",
    noResults: "कोई उत्पाद नहीं मिला",
    viewAll: "सभी परिणाम देखें",
  },
  ar: {
    announcement: "توصيل مجاني للطلبات المؤهلة",
    shopNow: "تسوق الآن",
    newArrivals: "وصل حديثًا",
    women: "نساء",
    men: "رجال",
    allWomen: "جميع منتجات النساء",
    allMen: "جميع منتجات الرجال",
    account: "حسابي",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    searchPlaceholder: "ابحث عن المنتجات...",
    search: "بحث",
    country: "الدولة",
    language: "اللغة",
    done: "تم",
    searching: "جارٍ البحث...",
    noResults: "لم يتم العثور على منتجات",
    viewAll: "عرض جميع النتائج",
  },
  zh: {
    announcement: "符合条件的订单免费配送",
    shopNow: "立即选购",
    newArrivals: "新品上市",
    women: "女装",
    men: "男装",
    allWomen: "全部女装",
    allMen: "全部男装",
    account: "我的账户",
    dashboard: "管理面板",
    profile: "个人资料",
    searchPlaceholder: "搜索商品...",
    search: "搜索",
    country: "国家",
    language: "语言",
    done: "完成",
    searching: "正在搜索...",
    noResults: "未找到商品",
    viewAll: "查看所有结果",
  },
  ja: {
    announcement: "対象注文は送料無料",
    shopNow: "今すぐ購入",
    newArrivals: "新着商品",
    women: "レディース",
    men: "メンズ",
    allWomen: "レディース全商品",
    allMen: "メンズ全商品",
    account: "マイアカウント",
    dashboard: "管理パネル",
    profile: "プロフィール",
    searchPlaceholder: "商品を検索...",
    search: "検索",
    country: "国",
    language: "言語",
    done: "完了",
    searching: "検索中...",
    noResults: "商品が見つかりません",
    viewAll: "すべての結果を見る",
  },
  fr: {
    announcement: "LIVRAISON GRATUITE SUR LES COMMANDES ÉLIGIBLES",
    shopNow: "ACHETER",
    newArrivals: "NOUVEAUTÉS",
    women: "FEMMES",
    men: "HOMMES",
    allWomen: "Toutes les femmes",
    allMen: "Tous les hommes",
    account: "MON COMPTE",
    dashboard: "TABLEAU DE BORD",
    profile: "PROFIL",
    searchPlaceholder: "Rechercher des produits...",
    search: "RECHERCHER",
    country: "Pays",
    language: "Langue",
    done: "TERMINÉ",
    searching: "Recherche...",
    noResults: "Aucun produit trouvé",
    viewAll: "Voir tous les résultats",
  },
};

const getSavedValue = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const getAuthUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    return token && user ? user : null;
  } catch {
    return null;
  }
};

const getProductImage = (product) => {
  if (typeof product.image === "string") return product.image;
  if (Array.isArray(product.image)) return product.image[0] || "";
  if (Array.isArray(product.images)) return product.images[0] || "";
  return product.imageUrl || "";
};

const getProductPrice = (product) =>
  product.specialPrice ??
  product.discountPrice ??
  product.price ??
  product.originalPrice ??
  0;

const Header = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const cartCount = useSelector(selectCartCount);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [countryCode, setCountryCode] = useState(() =>
    getSavedValue("countryCode", "PK")
  );
  const [regionOpen, setRegionOpen] = useState(false);
  const [authUser, setAuthUser] = useState(getAuthUser);

  useEffect(() => {
    const updateAuthUser = () => setAuthUser(getAuthUser());

    window.addEventListener("storage", updateAuthUser);
    window.addEventListener("focus", updateAuthUser);
    window.addEventListener("userLoggedIn", updateAuthUser);
    window.addEventListener("userLoggedOut", updateAuthUser);
    window.addEventListener("authChanged", updateAuthUser);

    return () => {
      window.removeEventListener("storage", updateAuthUser);
      window.removeEventListener("focus", updateAuthUser);
      window.removeEventListener("userLoggedIn", updateAuthUser);
      window.removeEventListener("userLoggedOut", updateAuthUser);
      window.removeEventListener("authChanged", updateAuthUser);
    };
  }, []);

  useEffect(() => {
    const keyword = searchText.trim();

    if (!searchOpen || !keyword) {
      setSuggestions([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(
          `${API_URL}?q=${encodeURIComponent(keyword)}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || "Search failed");
        }

        const list = Array.isArray(result)
          ? result
          : result.products ||
            result.data?.products ||
            result.data ||
            result.results ||
            [];

        if (!cancelled) {
          setSuggestions(Array.isArray(list) ? list.slice(0, 6) : []);
        }
      } catch (error) {
        if (!cancelled && error.name !== "AbortError") {
          setSuggestions([]);
          setSearchError("Search is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchText, searchOpen]);

  useEffect(() => {
    if (!regionOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") setRegionOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [regionOpen]);

  const isLoggedIn = Boolean(authUser);
  const isAdmin =
    authUser?.isAdmin === true || authUser?.isAdmin === "true";

  const selectedCountry =
    countries.find((country) => country.code === countryCode) || countries[0];

  const t = translations[language] || translations.en;
  const isRTL = language === "ur" || language === "ar";

  // Navigation: Shoes aur Sale remove kar diye hain.
  // Men aur Women ke dropdown mein sirf ek link hai.
  const navLinks = [
    { id: "new", name: t.newArrivals, href: "/new" },
    {
      id: "women",
      name: t.women,
      href: "/women",
      dropdown: [{ name: t.allWomen, href: "/women" }],
    },
    {
      id: "men",
      name: t.men,
      href: "/men",
      dropdown: [{ name: t.allMen, href: "/men" }],
    },
  ];

  const handleCountryChange = (code) => {
    const country = countries.find((item) => item.code === code);
    if (!country) return;

    const nextLanguage = country.languages[0].code;

    setCountryCode(code);
    setLanguage(nextLanguage);

    try {
      localStorage.setItem("countryCode", code);
      localStorage.setItem("language", nextLanguage);
    } catch {}
  };

  const handleLanguageChange = (code) => {
    if (!selectedCountry.languages.some((item) => item.code === code)) return;

    setLanguage(code);

    try {
      localStorage.setItem("language", code);
    } catch {}
  };

  const announcementAmount = {
    PK: "Rs. 6,000",
    US: "$60",
    GB: "£50",
    BD: "৳5,000",
    IN: "₹5,000",
    SA: "SAR 200",
    AE: "AED 200",
    CN: "¥300",
    JP: "¥5,000",
    FR: "€60",
  };

  const accountDestination = isAdmin ? "/admin/dashboard" : "/profile";
  const accountLabel = isAdmin ? t.dashboard : t.profile || "PROFILE";

  const openSearchResults = (event) => {
    event.preventDefault();

    const keyword = searchText.trim();
    if (!keyword) return;

    setSearchOpen(false);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText("");
    setSuggestions([]);
    setSearchError("");
  };

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className={`relative w-full bg-white font-[Arial,sans-serif] text-black ${
        regionOpen ? "z-[9999]" : "z-50"
      }`}
    >
      {/* Announcement */}
      <div className="bg-black px-3 py-2 text-center text-[10px] tracking-wide text-white sm:text-xs">
        {t.announcement} {announcementAmount[selectedCountry.code] || "€60"}{" "}
        <Link to="/" className="ms-2 underline underline-offset-2">
          {t.shopNow}
        </Link>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex min-h-[68px] items-center justify-between gap-2 sm:min-h-[76px]">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenu((previous) => !previous);
                setActiveDropdown(null);
                setRegionOpen(false);
              }}
              className="flex h-10 w-9 shrink-0 items-center justify-center md:hidden"
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <X size={23} /> : <Menu size={23} />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 items-center gap-4 md:flex lg:gap-7">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative flex h-[76px] items-center"
                  onMouseEnter={() => {
                    if (link.dropdown) setActiveDropdown(link.id);
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      to={link.href}
                      className="text-[11px] tracking-wide hover:underline hover:underline-offset-8 lg:text-xs"
                    >
                      {link.name}
                    </Link>

                    {link.dropdown && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown((previous) =>
                            previous === link.id ? null : link.id
                          )
                        }
                        aria-label={`Toggle ${link.name} dropdown`}
                        aria-expanded={activeDropdown === link.id}
                        className="flex h-6 w-6 items-center justify-center"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${
                            activeDropdown === link.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {link.dropdown && activeDropdown === link.id && (
                    <div className="absolute start-0 top-full z-50 w-56 border border-gray-100 bg-white py-3 shadow-lg">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-5 py-3 text-xs text-gray-700 transition hover:bg-gray-50 hover:text-black"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Logo */}
            <Link
              to="/"
              className="shrink-0 text-center text-lg font-bold tracking-[0.1em] sm:text-3xl sm:tracking-[0.18em]"
            >
              SOLEORA
            </Link>

            {/* Header Actions */}
            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3 md:gap-4">
              {isLoggedIn && (
                <Link
                  to={accountDestination}
                  className="hidden shrink-0 items-center gap-2 bg-black px-3 py-3 text-xs font-semibold text-white transition hover:bg-gray-800 sm:flex"
                >
                  {isAdmin ? (
                    <LayoutDashboard size={16} />
                  ) : (
                    <UserRound size={16} />
                  )}
                  <span>{accountLabel}</span>
                </Link>
              )}

              {/* Country & Language */}
              <button
                type="button"
                onClick={() => {
                  setRegionOpen((previous) => !previous);
                  setMobileMenu(false);
                  setSearchOpen(false);
                }}
                className="flex h-10 shrink-0 items-center justify-center gap-1 px-1 text-xs hover:opacity-60 sm:gap-1.5"
                aria-label="Country and language settings"
                aria-expanded={regionOpen}
              >
                <Globe size={19} strokeWidth={1.5} />
                <span className="hidden lg:inline">
                  {selectedCountry.code} / {language.toUpperCase()}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${
                    regionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((previous) => !previous);
                  setRegionOpen(false);
                  setMobileMenu(false);
                }}
                aria-label="Search"
                aria-expanded={searchOpen}
                className="flex h-10 w-9 shrink-0 items-center justify-center hover:opacity-60"
              >
                <Search size={21} strokeWidth={1.5} />
              </button>

              {/* Account */}
              <Link
                to={isLoggedIn ? accountDestination : "/login"}
                aria-label={isLoggedIn ? accountLabel : "My Account"}
                title={isLoggedIn ? accountLabel : "My Account"}
                className="hidden h-10 w-8 shrink-0 items-center justify-center hover:opacity-60 sm:flex"
              >
                {isAdmin ? (
                  <LayoutDashboard size={21} strokeWidth={1.5} />
                ) : (
                  <UserRound size={21} strokeWidth={1.5} />
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Shopping Bag, ${cartCount} items`}
                title="Shopping Bag"
                className="relative flex h-10 w-8 shrink-0 items-center justify-center hover:opacity-60"
              >
                <ShoppingBag size={21} strokeWidth={1.5} />

                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Live Search Bar */}
          {searchOpen && (
            <div className="relative border-t border-gray-200 py-3 sm:py-4">
              <form
                onSubmit={openSearchResults}
                className="flex min-w-0 items-center gap-2 border border-gray-300 bg-white px-3 sm:gap-3 sm:px-4"
              >
                <Search size={19} className="shrink-0" />

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-12 w-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                  autoComplete="off"
                  autoFocus
                  aria-label={t.searchPlaceholder}
                />

                {searchLoading && (
                  <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                )}

                {searchText && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText("");
                      setSuggestions([]);
                      setSearchError("");
                    }}
                    aria-label="Clear search"
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-500 hover:text-black"
                  >
                    <X size={17} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!searchText.trim()}
                  className="shrink-0 text-[10px] font-semibold tracking-wide disabled:opacity-40 sm:text-xs"
                >
                  {t.search}
                </button>

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="flex h-8 w-7 shrink-0 items-center justify-center hover:text-gray-500"
                >
                  <X size={19} />
                </button>
              </form>

              {/* API Search Suggestions */}
              {searchText.trim() && (
                <div className="absolute inset-x-0 top-full z-[90] max-h-[65vh] overflow-y-auto border border-t-0 border-gray-200 bg-white shadow-xl">
                  {searchLoading && suggestions.length === 0 && (
                    <p className="px-4 py-5 text-sm text-gray-500">
                      {t.searching}
                    </p>
                  )}

                  {!searchLoading && searchError && (
                    <p className="px-4 py-5 text-sm text-red-600">
                      {searchError}
                    </p>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    suggestions.length === 0 && (
                      <p className="px-4 py-5 text-sm text-gray-500">
                        {t.noResults}
                      </p>
                    )}

                  {suggestions.map((product, index) => {
                    const id = product._id || product.id;
                    const title = product.title || product.name || "Product";
                    const image = getProductImage(product);
                    const price = getProductPrice(product);

                    return (
                      <Link
                        key={id || product.slug || `${title}-${index}`}
                        to={id ? `/product/${id}` : "/search"}
                        onClick={closeSearch}
                        className="flex items-center gap-3 border-b border-gray-100 px-3 py-3 transition last:border-b-0 hover:bg-gray-50 sm:px-4"
                      >
                        <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#f1eee7] sm:h-16 sm:w-14">
                          {image ? (
                            <img
                              src={image}
                              alt={title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag size={18} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {title}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {product.brand || product.category || "SOLEORA"}
                          </p>
                        </div>

                        <p className="shrink-0 text-xs font-semibold sm:text-sm">
                          Rs. {Number(price || 0).toLocaleString("en-PK")}
                        </p>
                      </Link>
                    );
                  })}

                  {suggestions.length > 0 && (
                    <button
                      type="button"
                      onClick={openSearchResults}
                      className="w-full border-t border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider hover:bg-gray-50"
                    >
                      {t.viewAll} "{searchText.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <nav className="absolute inset-x-0 top-full z-[60] max-h-[calc(100dvh-100px)] overflow-y-auto border-b border-gray-200 bg-white shadow-lg md:hidden">
          <div className="px-5 py-3">
            {navLinks.map((link) => (
              <div key={link.id} className="border-b border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={link.href}
                    onClick={() => {
                      setMobileMenu(false);
                      setActiveDropdown(null);
                    }}
                    className="py-4 text-xs tracking-wider"
                  >
                    {link.name}
                  </Link>

                  {link.dropdown && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown((previous) =>
                          previous === link.id ? null : link.id
                        )
                      }
                      aria-label={`Toggle ${link.name} menu`}
                      aria-expanded={activeDropdown === link.id}
                      className="flex h-10 w-10 shrink-0 items-center justify-center"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          activeDropdown === link.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {link.dropdown && activeDropdown === link.id && (
                  <div className="pb-3 ps-4">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => {
                          setMobileMenu(false);
                          setActiveDropdown(null);
                        }}
                        className="block py-3 text-xs text-gray-600 hover:text-black"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to={isLoggedIn ? accountDestination : "/login"}
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 border-b border-gray-100 py-4 text-xs"
            >
              {isAdmin ? (
                <LayoutDashboard size={18} />
              ) : (
                <UserRound size={18} />
              )}
              {isLoggedIn ? accountLabel : t.account}
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 py-4 text-xs"
            >
              <ShoppingBag size={18} />
              Shopping Bag ({cartCount})
            </Link>
          </div>
        </nav>
      )}

      {/* Country & Language Modal */}
      {regionOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6"
          onClick={() => setRegionOpen(false)}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-sm border border-gray-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2
                id="region-modal-title"
                className="text-sm font-semibold sm:text-base"
              >
                {t.country} & {t.language}
              </h2>

              <button
                type="button"
                onClick={() => setRegionOpen(false)}
                aria-label="Close country and language settings"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <label
              htmlFor="header-country"
              className="mb-2 block text-xs text-gray-500"
            >
              {t.country}
            </label>

            <select
              id="header-country"
              value={countryCode}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="mb-5 block w-full min-w-0 rounded-none border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-black"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.currency})
                </option>
              ))}
            </select>

            <label
              htmlFor="header-language"
              className="mb-2 block text-xs text-gray-500"
            >
              {t.language}
            </label>

            <select
              id="header-language"
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="block w-full min-w-0 rounded-none border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-black"
            >
              {selectedCountry.languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setRegionOpen(false)}
              className="mt-6 w-full bg-black py-3.5 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              {t.done}
            </button>
          </section>
        </div>
      )}
    </header>
  );
};

export default Header;
