
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Cart = () => {
    const { language } = useLanguage();

    const translations = {
        en: {
            selection: "Your Selection",
            title: "Shopping Cart",
            item: "item",
            items: "items",
            bag: "in your bag",
            empty: "Your cart is empty",
            emptyDesc: "Looks like you haven't added anything yet.",
            continue: "Continue Shopping",
            product: "Product",
            quantity: "Quantity",
            total: "Total",
            remove: "Remove",
            size: "Size",
            color: "Color",
            summary: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            free: "FREE",
            unlocked: "You've unlocked free shipping!",
            spend: "more to get free shipping.",
            checkout: "Proceed to Checkout",
            secure: "Secure checkout",
            shippingNote: "Shipping charges are estimated. Final charges may vary at checkout.",
            rights: "All rights reserved.",
            goTop: "Go to top",
            decrease: "Decrease quantity of",
            increase: "Increase quantity of",
        },
        ur: {
            selection: "آپ کا انتخاب",
            title: "شاپنگ کارٹ",
            item: "آئٹم",
            items: "آئٹمز",
            bag: "آپ کے بیگ میں",
            empty: "آپ کا کارٹ خالی ہے",
            emptyDesc: "آپ نے ابھی تک کوئی چیز شامل نہیں کی۔",
            continue: "خریداری جاری رکھیں",
            product: "پروڈکٹ",
            quantity: "تعداد",
            total: "کل",
            remove: "ہٹائیں",
            size: "سائز",
            color: "رنگ",
            summary: "آرڈر کی تفصیل",
            subtotal: "ذیلی کل",
            shipping: "ڈیلیوری چارجز",
            free: "مفت",
            unlocked: "آپ کو مفت ڈیلیوری مل گئی ہے!",
            spend: "مزید خرچ کریں اور مفت ڈیلیوری حاصل کریں۔",
            checkout: "چیک آؤٹ پر جائیں",
            secure: "محفوظ چیک آؤٹ",
            shippingNote: "ڈیلیوری چارجز کا تخمینہ ہے۔ حتمی چارجز چیک آؤٹ پر مختلف ہو سکتے ہیں۔",
            rights: "تمام حقوق محفوظ ہیں۔",
            goTop: "اوپر جائیں",
            decrease: "کی تعداد کم کریں",
            increase: "کی تعداد بڑھائیں",
        },
        hi: {
            selection: "आपका चयन",
            title: "शॉपिंग कार्ट",
            item: "आइटम",
            items: "आइटम",
            bag: "आपके बैग में",
            empty: "आपका कार्ट खाली है",
            emptyDesc: "आपने अभी तक कुछ नहीं जोड़ा है।",
            continue: "खरीदारी जारी रखें",
            product: "प्रोडक्ट",
            quantity: "मात्रा",
            total: "कुल",
            remove: "हटाएँ",
            size: "साइज़",
            color: "रंग",
            summary: "ऑर्डर सारांश",
            subtotal: "उप-कुल",
            shipping: "डिलीवरी शुल्क",
            free: "मुफ़्त",
            unlocked: "आपको मुफ़्त डिलीवरी मिल गई है!",
            spend: "और खर्च करें और मुफ़्त डिलीवरी पाएँ।",
            checkout: "चेकआउट करें",
            secure: "सुरक्षित चेकआउट",
            shippingNote: "डिलीवरी शुल्क अनुमानित हैं। अंतिम शुल्क चेकआउट पर बदल सकते हैं।",
            rights: "सर्वाधिकार सुरक्षित।",
            goTop: "ऊपर जाएँ",
            decrease: "की मात्रा घटाएँ",
            increase: "की मात्रा बढ़ाएँ",
        },
        bn: {
            selection: "আপনার নির্বাচন",
            title: "শপিং কার্ট",
            item: "টি পণ্য",
            items: "টি পণ্য",
            bag: "আপনার ব্যাগে",
            empty: "আপনার কার্ট খালি",
            emptyDesc: "আপনি এখনও কোনো পণ্য যোগ করেননি।",
            continue: "কেনাকাটা চালিয়ে যান",
            product: "পণ্য",
            quantity: "পরিমাণ",
            total: "মোট",
            remove: "সরান",
            size: "সাইজ",
            color: "রং",
            summary: "অর্ডারের সারাংশ",
            subtotal: "উপমোট",
            shipping: "ডেলিভারি চার্জ",
            free: "বিনামূল্যে",
            unlocked: "আপনি বিনামূল্যে ডেলিভারি পেয়েছেন!",
            spend: "আর খরচ করলে বিনামূল্যে ডেলিভারি পাবেন।",
            checkout: "চেকআউটে যান",
            secure: "নিরাপদ চেকআউট",
            shippingNote: "ডেলিভারি চার্জ আনুমানিক। চেকআউটে চূড়ান্ত চার্জ পরিবর্তিত হতে পারে।",
            rights: "সর্বস্বত্ব সংরক্ষিত।",
            goTop: "উপরে যান",
            decrease: "এর পরিমাণ কমান",
            increase: "এর পরিমাণ বাড়ান",
        },
        ar: {
            selection: "اختياراتك",
            title: "سلة التسوق",
            item: "منتج",
            items: "منتجات",
            bag: "في حقيبتك",
            empty: "سلتك فارغة",
            emptyDesc: "لم تضف أي منتجات حتى الآن.",
            continue: "متابعة التسوق",
            product: "المنتج",
            quantity: "الكمية",
            total: "الإجمالي",
            remove: "إزالة",
            size: "المقاس",
            color: "اللون",
            summary: "ملخص الطلب",
            subtotal: "المجموع الفرعي",
            shipping: "الشحن",
            free: "مجانًا",
            unlocked: "لقد حصلت على شحن مجاني!",
            spend: "إضافية للحصول على شحن مجاني.",
            checkout: "إتمام الشراء",
            secure: "دفع آمن",
            shippingNote: "رسوم الشحن تقديرية وقد تختلف عند إتمام الشراء.",
            rights: "جميع الحقوق محفوظة.",
            goTop: "العودة للأعلى",
            decrease: "تقليل كمية",
            increase: "زيادة كمية",
        },
        zh: {
            selection: "您的选择",
            title: "购物车",
            item: "件商品",
            items: "件商品",
            bag: "在您的购物袋中",
            empty: "购物车为空",
            emptyDesc: "您还没有添加任何商品。",
            continue: "继续购物",
            product: "商品",
            quantity: "数量",
            total: "总计",
            remove: "删除",
            size: "尺码",
            color: "颜色",
            summary: "订单摘要",
            subtotal: "小计",
            shipping: "运费",
            free: "免费",
            unlocked: "您已获得免费配送！",
            spend: "即可享受免费配送。",
            checkout: "前往结账",
            secure: "安全结账",
            shippingNote: "运费为预估金额，最终费用可能在结账时有所变化。",
            rights: "保留所有权利。",
            goTop: "返回顶部",
            decrease: "减少数量",
            increase: "增加数量",
        },
        ja: {
            selection: "お選びいただいた商品",
            title: "ショッピングカート",
            item: "点",
            items: "点",
            bag: "カート内の商品",
            empty: "カートは空です",
            emptyDesc: "商品がまだ追加されていません。",
            continue: "買い物を続ける",
            product: "商品",
            quantity: "数量",
            total: "合計",
            remove: "削除",
            size: "サイズ",
            color: "色",
            summary: "注文概要",
            subtotal: "小計",
            shipping: "送料",
            free: "無料",
            unlocked: "送料無料が適用されました！",
            spend: "追加すると送料無料になります。",
            checkout: "購入手続きへ",
            secure: "安全な決済",
            shippingNote: "送料は概算です。最終的な料金は決済時に変わる場合があります。",
            rights: "無断転載を禁じます。",
            goTop: "トップへ戻る",
            decrease: "数量を減らす",
            increase: "数量を増やす",
        },
        fr: {
            selection: "Votre sélection",
            title: "Panier",
            item: "article",
            items: "articles",
            bag: "dans votre panier",
            empty: "Votre panier est vide",
            emptyDesc: "Vous n'avez encore rien ajouté.",
            continue: "Continuer vos achats",
            product: "Produit",
            quantity: "Quantité",
            total: "Total",
            remove: "Supprimer",
            size: "Taille",
            color: "Couleur",
            summary: "Récapitulatif de commande",
            subtotal: "Sous-total",
            shipping: "Livraison",
            free: "GRATUIT",
            unlocked: "Vous bénéficiez de la livraison gratuite !",
            spend: "de plus pour obtenir la livraison gratuite.",
            checkout: "Passer à la caisse",
            secure: "Paiement sécurisé",
            shippingNote: "Les frais de livraison sont estimés. Le montant final peut varier au paiement.",
            rights: "Tous droits réservés.",
            goTop: "Retour en haut",
            decrease: "Diminuer la quantité de",
            increase: "Augmenter la quantité de",
        },
    };

    const text = translations[language] || translations.en;
    const isRTL = language === "ur" || language === "ar";

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Premium Oversized T-Shirt",
            category: "Essential Collection",
            size: "M",
            color: "Black",
            price: 2499,
            quantity: 1,
            image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        },
        {
            id: 2,
            name: "Classic Casual Shirt",
            category: "Everyday Collection",
            size: "L",
            color: "White",
            price: 3499,
            quantity: 1,
            image:
                "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600",
        },
    ]);

    const updateQuantity = (id, amount) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: Math.max(1, item.quantity + amount),
                      }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
    const total = subtotal + shipping;

    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const formatPrice = (price) => `Rs. ${price.toLocaleString("en-PK")}`;

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            className="min-h-screen bg-white text-black"
            style={{
                fontFamily: "inherit",
            }}
        >
            <style>{`
                @keyframes cartFadeDown {
                    from { opacity: 0; transform: translateY(-15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes cartFadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes cartSlideIn {
                    from { opacity: 0; transform: translateX(-18px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .cart-header { animation: cartFadeDown 0.65s ease both; }
                .cart-title { animation: cartFadeUp 0.7s ease both; }
                .cart-item {
                    animation: cartSlideIn 0.6s ease both;
                    transition: background-color 0.25s ease;
                }
                .cart-item:hover { background-color: #fafafa; }
                .cart-summary {
                    animation: cartFadeUp 0.8s ease both;
                    transition: box-shadow 0.3s ease;
                }
                .cart-summary:hover {
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);
                }
                .cart-product-image { transition: transform 0.45s ease; }
                .cart-product-image:hover { transform: scale(1.04); }
                .cart-action {
                    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                }
                .cart-action:active { transform: scale(0.94); }
                .cart-quantity-button { transition: background-color 0.2s ease; }
                .cart-quantity-button:hover { background-color: #eeeeee; }
                .cart-checkout {
                    transition: background-color 0.25s ease, transform 0.25s ease;
                }
                .cart-checkout:hover { transform: translateY(-2px); }
                .cart-checkout:active { transform: translateY(0) scale(0.99); }
                @media (prefers-reduced-motion: reduce) {
                    .cart-header, .cart-title, .cart-item, .cart-summary {
                        animation: none !important;
                    }
                    .cart-product-image, .cart-action, .cart-checkout {
                        transition: none !important;
                    }
                }
            `}</style>

            <header className="cart-header border-b border-gray-200 px-5 py-6">
                <Link
                    to="/"
                    className="flex items-center justify-center"
                    aria-label="SOLEORA Home"
                >
                    <span className="text-3xl font-bold tracking-[4px] sm:text-5xl sm:tracking-[5px]">
                        SOLEORA
                    </span>
                </Link>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
                <div className="cart-title mb-10">
                    <p className="mb-3 text-xs uppercase tracking-[3px] text-gray-500">
                        {text.selection}
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                        {text.title}
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        {totalItems}{" "}
                        {language === "en" || language === "fr"
                            ? totalItems === 1
                                ? text.item
                                : text.items
                            : text.items}{" "}
                        {text.bag}
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                aria-hidden="true"
                            >
                                <path d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6" />
                                <circle cx="10" cy="21" r="1" />
                                <circle cx="18" cy="21" r="1" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-semibold">{text.empty}</h2>

                        <p className="mt-3 text-sm text-gray-500">
                            {text.emptyDesc}
                        </p>

                        <Link
                            to="/"
                            className="cart-action mt-7 inline-block bg-black px-8 py-4 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            {text.continue}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
                        <section>
                            <div className="hidden grid-cols-[1fr_100px_100px] border-b border-gray-200 pb-4 text-xs uppercase tracking-wider text-gray-500 sm:grid">
                                <span>{text.product}</span>
                                <span className="text-center">{text.quantity}</span>
                                <span className="text-right">{text.total}</span>
                            </div>

                            <div>
                                {cartItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{ animationDelay: `${index * 150}ms` }}
                                        className="cart-item grid grid-cols-1 gap-4 border-b border-gray-200 py-6 sm:grid-cols-[1fr_100px_100px] sm:items-center sm:gap-3"
                                    >
                                        <div className="flex min-w-0 gap-4">
                                            <div className="h-32 w-24 shrink-0 overflow-hidden bg-gray-100 sm:h-36 sm:w-28">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    className="cart-product-image h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex min-w-0 flex-col items-start">
                                                <h3 className="text-sm font-semibold leading-6 sm:text-base">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {item.category}
                                                </p>

                                                <p className="mt-2 text-xs text-gray-500">
                                                    {text.size}: {item.size} · {text.color}: {item.color}
                                                </p>

                                                <p className="mt-3 text-sm font-medium">
                                                    {formatPrice(item.price)}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="cart-action mt-auto pt-4 text-xs text-gray-500 underline underline-offset-4 hover:text-red-600"
                                                >
                                                    {text.remove}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-center">
                                            <span className="text-xs text-gray-500 sm:hidden">
                                                {text.quantity}
                                            </span>

                                            <div className="flex items-center border border-gray-300">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    aria-label={`${text.decrease} ${item.name}`}
                                                    className="cart-quantity-button px-3 py-2 text-lg"
                                                >
                                                    −
                                                </button>

                                                <span
                                                    aria-live="polite"
                                                    className="min-w-8 text-center text-sm"
                                                >
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    aria-label={`${text.increase} ${item.name}`}
                                                    className="cart-quantity-button px-3 py-2 text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end">
                                            <span className="text-xs text-gray-500 sm:hidden">
                                                {text.total}
                                            </span>

                                            <span className="text-sm font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/"
                                className="cart-action mt-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                            >
                                <span>{isRTL ? "→" : "←"}</span>
                                {text.continue}
                            </Link>
                        </section>

                        <aside className="cart-summary border border-gray-200 p-6 md:p-7">
                            <h2 className="text-xl font-semibold">{text.summary}</h2>

                            <div className="mt-7 space-y-5 border-b border-gray-200 pb-6">
                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-gray-500">{text.subtotal}</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-gray-500">{text.shipping}</span>
                                    <span>
                                        {shipping === 0 ? text.free : formatPrice(shipping)}
                                    </span>
                                </div>

                                <p className="text-xs leading-5 text-gray-500">
                                    {subtotal >= 5000
                                        ? text.unlocked
                                        : `${formatPrice(5000 - subtotal)} ${text.spend}`}
                                </p>
                            </div>

                            <div className="flex items-center justify-between py-6">
                                <span className="font-semibold">{text.total}</span>
                                <span className="text-xl font-semibold">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            <Link
                                to="/checkout"
                                className="cart-checkout flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                {text.checkout}
                                <span aria-hidden="true">{isRTL ? "←" : "→"}</span>
                            </Link>

                            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    aria-hidden="true"
                                >
                                    <rect x="4" y="10" width="16" height="11" rx="2" />
                                    <path d="M8 10V7a4 4 0 118 0v3" />
                                </svg>

                                {text.secure}
                            </div>

                            <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                                {text.shippingNote}
                            </p>
                        </aside>
                    </div>
                )}
            </main>

            <footer className="mt-10 border-t border-gray-200 px-5 py-7 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} SOLEORA. {text.rights}
            </footer>
        </div>
    );
};

export default Cart;
