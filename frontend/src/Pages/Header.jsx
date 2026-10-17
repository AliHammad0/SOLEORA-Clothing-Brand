
import React, { useState } from "react";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingBag,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

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
    shoes: "SHOES",
    sale: "SALE",
    allWomen: "All Women",
    womensClothing: "Women's Clothing",
    womensShoes: "Women's Shoes",
    womensBags: "Women's Bags",
    allMen: "All Men",
    mensClothing: "Men's Clothing",
    mensShoes: "Men's Shoes",
    mensAccessories: "Men's Accessories",
    allShoes: "All Shoes",
    sneakers: "Sneakers",
    formalShoes: "Formal Shoes",
    casualShoes: "Casual Shoes",
    account: "MY ACCOUNT",
    searchPlaceholder: "Search products...",
    search: "SEARCH",
    country: "Country",
    language: "Language",
    done: "DONE",
  },
  ur: {
    announcement: "6000 روپے سے زیادہ کے آرڈر پر مفت ڈیلیوری",
    shopNow: "ابھی خریدیں",
    newArrivals: "نئی آمد",
    women: "خواتین",
    men: "مرد",
    shoes: "جوتے",
    sale: "سیل",
    allWomen: "تمام خواتین",
    womensClothing: "خواتین کے کپڑے",
    womensShoes: "خواتین کے جوتے",
    womensBags: "خواتین کے بیگز",
    allMen: "تمام مرد",
    mensClothing: "مردوں کے کپڑے",
    mensShoes: "مردوں کے جوتے",
    mensAccessories: "مردوں کی ایکسیسریز",
    allShoes: "تمام جوتے",
    sneakers: "اسنیکرز",
    formalShoes: "فارمل جوتے",
    casualShoes: "کیژول جوتے",
    account: "میرا اکاؤنٹ",
    searchPlaceholder: "پروڈکٹس تلاش کریں...",
    search: "تلاش کریں",
    country: "ملک",
    language: "زبان",
    done: "مکمل",
  },
  bn: {
    announcement: "অর্ডারে ফ্রি ডেলিভারি",
    shopNow: "এখনই কিনুন",
    newArrivals: "নতুন কালেকশন",
    women: "নারী",
    men: "পুরুষ",
    shoes: "জুতা",
    sale: "ছাড়",
    allWomen: "সব নারীদের পণ্য",
    womensClothing: "নারীদের পোশাক",
    womensShoes: "নারীদের জুতা",
    womensBags: "নারীদের ব্যাগ",
    allMen: "সব পুরুষদের পণ্য",
    mensClothing: "পুরুষদের পোশাক",
    mensShoes: "পুরুষদের জুতা",
    mensAccessories: "পুরুষদের অ্যাক্সেসরিজ",
    allShoes: "সব জুতা",
    sneakers: "স্নিকার্স",
    formalShoes: "ফরমাল জুতা",
    casualShoes: "ক্যাজুয়াল জুতা",
    account: "আমার অ্যাকাউন্ট",
    searchPlaceholder: "পণ্য খুঁজুন...",
    search: "খুঁজুন",
    country: "দেশ",
    language: "ভাষা",
    done: "সম্পন্ন",
  },
  hi: {
    announcement: "ऑर्डर पर मुफ़्त डिलीवरी",
    shopNow: "अभी खरीदें",
    newArrivals: "नए उत्पाद",
    women: "महिलाएं",
    men: "पुरुष",
    shoes: "जूते",
    sale: "सेल",
    allWomen: "सभी महिलाओं के उत्पाद",
    womensClothing: "महिलाओं के कपड़े",
    womensShoes: "महिलाओं के जूते",
    womensBags: "महिलाओं के बैग",
    allMen: "सभी पुरुषों के उत्पाद",
    mensClothing: "पुरुषों के कपड़े",
    mensShoes: "पुरुषों के जूते",
    mensAccessories: "पुरुषों की एक्सेसरीज़",
    allShoes: "सभी जूते",
    sneakers: "स्नीकर्स",
    formalShoes: "फॉर्मल जूते",
    casualShoes: "कैज़ुअल जूते",
    account: "मेरा अकाउंट",
    searchPlaceholder: "उत्पाद खोजें...",
    search: "खोजें",
    country: "देश",
    language: "भाषा",
    done: "हो गया",
  },
  ar: {
    announcement: "توصيل مجاني للطلبات المؤهلة",
    shopNow: "تسوق الآن",
    newArrivals: "وصل حديثًا",
    women: "نساء",
    men: "رجال",
    shoes: "أحذية",
    sale: "تخفيضات",
    allWomen: "جميع منتجات النساء",
    womensClothing: "ملابس نسائية",
    womensShoes: "أحذية نسائية",
    womensBags: "حقائب نسائية",
    allMen: "جميع منتجات الرجال",
    mensClothing: "ملابس رجالية",
    mensShoes: "أحذية رجالية",
    mensAccessories: "إكسسوارات رجالية",
    allShoes: "جميع الأحذية",
    sneakers: "أحذية رياضية",
    formalShoes: "أحذية رسمية",
    casualShoes: "أحذية كاجوال",
    account: "حسابي",
    searchPlaceholder: "ابحث عن المنتجات...",
    search: "بحث",
    country: "الدولة",
    language: "اللغة",
    done: "تم",
  },
  zh: {
    announcement: "符合条件的订单免费配送",
    shopNow: "立即选购",
    newArrivals: "新品上市",
    women: "女装",
    men: "男装",
    shoes: "鞋类",
    sale: "促销",
    allWomen: "全部女装",
    womensClothing: "女士服装",
    womensShoes: "女士鞋履",
    womensBags: "女士包袋",
    allMen: "全部男装",
    mensClothing: "男士服装",
    mensShoes: "男士鞋履",
    mensAccessories: "男士配饰",
    allShoes: "全部鞋类",
    sneakers: "运动鞋",
    formalShoes: "正装鞋",
    casualShoes: "休闲鞋",
    account: "我的账户",
    searchPlaceholder: "搜索商品...",
    search: "搜索",
    country: "国家",
    language: "语言",
    done: "完成",
  },
  ja: {
    announcement: "対象注文は送料無料",
    shopNow: "今すぐ購入",
    newArrivals: "新着商品",
    women: "レディース",
    men: "メンズ",
    shoes: "シューズ",
    sale: "セール",
    allWomen: "レディース全商品",
    womensClothing: "レディースウェア",
    womensShoes: "レディースシューズ",
    womensBags: "レディースバッグ",
    allMen: "メンズ全商品",
    mensClothing: "メンズウェア",
    mensShoes: "メンズシューズ",
    mensAccessories: "メンズアクセサリー",
    allShoes: "すべてのシューズ",
    sneakers: "スニーカー",
    formalShoes: "フォーマルシューズ",
    casualShoes: "カジュアルシューズ",
    account: "マイアカウント",
    searchPlaceholder: "商品を検索...",
    search: "検索",
    country: "国",
    language: "言語",
    done: "完了",
  },
  fr: {
    announcement: "LIVRAISON GRATUITE SUR LES COMMANDES ÉLIGIBLES",
    shopNow: "ACHETER",
    newArrivals: "NOUVEAUTÉS",
    women: "FEMMES",
    men: "HOMMES",
    shoes: "CHAUSSURES",
    sale: "SOLDES",
    allWomen: "Toutes les femmes",
    womensClothing: "Vêtements femme",
    womensShoes: "Chaussures femme",
    womensBags: "Sacs femme",
    allMen: "Tous les hommes",
    mensClothing: "Vêtements homme",
    mensShoes: "Chaussures homme",
    mensAccessories: "Accessoires homme",
    allShoes: "Toutes les chaussures",
    sneakers: "Baskets",
    formalShoes: "Chaussures habillées",
    casualShoes: "Chaussures décontractées",
    account: "MON COMPTE",
    searchPlaceholder: "Rechercher des produits...",
    search: "RECHERCHER",
    country: "Pays",
    language: "Langue",
    done: "TERMINÉ",
  },
};

const getSavedValue = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const Header = () => {
  const { language, setLanguage } = useLanguage();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [countryCode, setCountryCode] = useState(() =>
    getSavedValue("countryCode", "PK")
  );
  const [regionOpen, setRegionOpen] = useState(false);

  const selectedCountry =
    countries.find((country) => country.code === countryCode) || countries[0];

  const t = translations[language] || translations.en;
  const isRTL = language === "ur" || language === "ar";

  const navLinks = [
    { id: "new", name: t.newArrivals, href: "/new" },
    {
      id: "women",
      name: t.women,
      href: "/women",
      dropdown: [
        { name: t.allWomen, href: "/women" },
        { name: t.womensClothing, href: "/women/clothing" },
        { name: t.womensShoes, href: "/women/shoes" },
        { name: t.womensBags, href: "/women/bags" },
      ],
    },
    {
      id: "men",
      name: t.men,
      href: "/men",
      dropdown: [
        { name: t.allMen, href: "/men" },
        { name: t.mensClothing, href: "/men/clothing" },
        { name: t.mensShoes, href: "/men/shoes" },
        { name: t.mensAccessories, href: "/men/accessories" },
      ],
    },
    {
      id: "shoes",
      name: t.shoes,
      href: "/shoes",
      dropdown: [
        { name: t.allShoes, href: "/shoes" },
        { name: t.sneakers, href: "/shoes/sneakers" },
        { name: t.formalShoes, href: "/shoes/formal" },
        { name: t.casualShoes, href: "/shoes/casual" },
      ],
    },
    { id: "sale", name: t.sale, href: "/sale" },
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
    } catch {
      // Continue if browser storage is unavailable.
    }
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);

    try {
      localStorage.setItem("language", code);
    } catch {
      // Continue if browser storage is unavailable.
    }
  };

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-50 w-full bg-white font-[Arial,sans-serif] text-black"
    >
      <div className="bg-black px-3 py-2 text-center text-[10px] tracking-wide text-white sm:text-xs">
        {t.announcement}{" "}
        {selectedCountry.code === "PK"
          ? "Rs. 6,000"
          : selectedCountry.code === "US"
          ? "$60"
          : selectedCountry.code === "GB"
          ? "£50"
          : selectedCountry.code === "BD"
          ? "৳5,000"
          : selectedCountry.code === "IN"
          ? "₹5,000"
          : selectedCountry.code === "SA"
          ? "SAR 200"
          : selectedCountry.code === "AE"
          ? "AED 200"
          : selectedCountry.code === "CN"
          ? "¥300"
          : selectedCountry.code === "JP"
          ? "¥5,000"
          : "€60"}{" "}
        <a href="/shipping" className="ms-2 underline underline-offset-2">
          {t.shopNow}
        </a>
      </div>

      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex min-h-[76px] items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={23} /> : <Menu size={23} />}
            </button>

            <nav className="hidden flex-1 items-center gap-5 md:flex lg:gap-7">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative flex h-[76px] items-center"
                  onMouseEnter={() =>
                    link.dropdown && setActiveDropdown(link.id)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="flex items-center gap-1">
                    <a
                      href={link.href}
                      className={`text-[11px] tracking-wide hover:underline hover:underline-offset-8 lg:text-xs ${
                        link.id === "sale" ? "text-red-600" : ""
                      }`}
                    >
                      {link.name}
                    </a>

                    {link.dropdown && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === link.id ? null : link.id
                          )
                        }
                        aria-label={`Toggle ${link.name} dropdown`}
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
                        <a
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-3 text-xs text-gray-700 transition hover:bg-gray-50 hover:text-black"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <a
              href="/"
              className="shrink-0 text-center text-xl font-bold tracking-[0.12em] sm:text-3xl sm:tracking-[0.18em]"
            >
              SOLEORA
            </a>

            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRegionOpen(!regionOpen)}
                  className="flex items-center gap-1.5 text-xs hover:opacity-60"
                  aria-label="Country and language settings"
                >
                  <Globe size={19} strokeWidth={1.5} />
                  <span className="hidden lg:inline">
                    {selectedCountry.code} / {language.toUpperCase()}
                  </span>
                  <ChevronDown size={13} />
                </button>

                {regionOpen && (
                  <div className="absolute end-0 top-full z-[60] mt-4 w-72 border border-gray-200 bg-white p-5 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        {t.country} & {t.language}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setRegionOpen(false)}
                        aria-label="Close settings"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <label className="mb-2 block text-xs text-gray-500">
                      {t.country}
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="mb-4 w-full border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-black"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.currency})
                        </option>
                      ))}
                    </select>

                    <label className="mb-2 block text-xs text-gray-500">
                      {t.language}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-black"
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
                      className="mt-5 w-full bg-black py-3 text-xs font-semibold text-white transition hover:bg-gray-800"
                    >
                      {t.done}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="hover:opacity-60"
              >
                <Search size={21} strokeWidth={1.5} />
              </button>

              <a
                href="/login"
                aria-label="My Account"
                className="hidden hover:opacity-60 sm:block"
              >
                <UserRound size={21} strokeWidth={1.5} />
              </a>

              <a
                href="/cart"
                aria-label="Shopping Bag"
                className="hover:opacity-60"
              >
                <ShoppingBag size={21} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {searchOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchText.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(
                    searchText.trim()
                  )}`;
                }
              }}
              className="flex items-center gap-3 border-t border-gray-200 py-4"
            >
              <Search size={19} />
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none"
                autoFocus
              />
              <button type="submit" className="text-xs font-semibold">
                {t.search}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={19} />
              </button>
            </form>
          )}
        </div>
      </div>

      {mobileMenu && (
        <nav className="absolute start-0 top-full z-50 w-full border-b border-gray-200 bg-white shadow-lg md:hidden">
          <div className="px-5 py-3">
            {navLinks.map((link) => (
              <div key={link.id} className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <a
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`py-4 text-xs tracking-wider ${
                      link.id === "sale" ? "text-red-600" : ""
                    }`}
                  >
                    {link.name}
                  </a>

                  {link.dropdown && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === link.id ? null : link.id
                        )
                      }
                      aria-label={`Toggle ${link.name} menu`}
                      className="p-3"
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
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenu(false);
                          setActiveDropdown(null);
                        }}
                        className="block py-3 text-xs text-gray-600 hover:text-black"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a
              href="/login"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 py-4 text-xs"
            >
              <UserRound size={18} />
              {t.account}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
