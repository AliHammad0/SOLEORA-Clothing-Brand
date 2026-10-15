
import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const benefits = [
  { icon: "🚚", title: "shipping", description: "shippingDesc" },
  { icon: "↩️", title: "returns", description: "returnsDesc" },
  { icon: "📦", title: "delivery", description: "deliveryDesc" },
  { icon: "🔒", title: "checkout", description: "checkoutDesc" },
  { icon: "💳", title: "payments", description: "paymentsDesc" },
  { icon: "💬", title: "support", description: "supportDesc" },
];

const translations = {
  en: {
    section: "Store benefits",
    shipping: "FREE SHIPPING",
    shippingDesc: "Above Rs. 6,000",
    returns: "EASY RETURNS",
    returnsDesc: "14 Days Return & Exchange",
    delivery: "FAST DELIVERY",
    deliveryDesc: "Within 3–5 Working Days",
    checkout: "SECURE CHECKOUT",
    checkoutDesc: "Shop with Confidence",
    payments: "EASY PAYMENTS",
    paymentsDesc: "Convenient Payment Options",
    support: "CUSTOMER SUPPORT",
    supportDesc: "We're Here to Help",
    previous: "Previous store benefit",
    next: "Next store benefit",
    show: "Show benefit",
  },
  ur: {
    section: "خریداری کے فوائد",
    shipping: "مفت شپنگ",
    shippingDesc: "6,000 روپے سے زیادہ کی خریداری پر",
    returns: "آسان واپسی",
    returnsDesc: "14 دن میں واپسی اور تبدیلی",
    delivery: "تیز ڈیلیوری",
    deliveryDesc: "3 سے 5 کاروباری دنوں میں",
    checkout: "محفوظ چیک آؤٹ",
    checkoutDesc: "اعتماد کے ساتھ خریداری کریں",
    payments: "آسان ادائیگی",
    paymentsDesc: "ادائیگی کے آسان طریقے",
    support: "صارفین کی مدد",
    supportDesc: "ہم مدد کے لیے موجود ہیں",
    previous: "پچھلا فائدہ",
    next: "اگلا فائدہ",
    show: "فائدہ دکھائیں",
  },
  hi: {
    section: "खरीदारी के फायदे",
    shipping: "मुफ़्त शिपिंग",
    shippingDesc: "₹6,000 से अधिक की खरीदारी पर",
    returns: "आसान वापसी",
    returnsDesc: "14 दिनों में वापसी और एक्सचेंज",
    delivery: "तेज़ डिलीवरी",
    deliveryDesc: "3–5 कार्यदिवसों में",
    checkout: "सुरक्षित चेकआउट",
    checkoutDesc: "विश्वास के साथ खरीदारी करें",
    payments: "आसान भुगतान",
    paymentsDesc: "सुविधाजनक भुगतान विकल्प",
    support: "ग्राहक सहायता",
    supportDesc: "हम आपकी मदद के लिए हैं",
    previous: "पिछला लाभ",
    next: "अगला लाभ",
    show: "लाभ दिखाएँ",
  },
  bn: {
    section: "কেনাকাটার সুবিধা",
    shipping: "বিনামূল্যে শিপিং",
    shippingDesc: "৬,০০০ টাকার বেশি কেনাকাটায়",
    returns: "সহজে ফেরত",
    returnsDesc: "১৪ দিনের মধ্যে ফেরত ও বিনিময়",
    delivery: "দ্রুত ডেলিভারি",
    deliveryDesc: "৩–৫ কর্মদিবসের মধ্যে",
    checkout: "নিরাপদ চেকআউট",
    checkoutDesc: "নিশ্চিন্তে কেনাকাটা করুন",
    payments: "সহজ পেমেন্ট",
    paymentsDesc: "সুবিধাজনক পেমেন্টের বিকল্প",
    support: "গ্রাহক সহায়তা",
    supportDesc: "আমরা সাহায্য করতে প্রস্তুত",
    previous: "আগের সুবিধা",
    next: "পরের সুবিধা",
    show: "সুবিধা দেখুন",
  },
  ar: {
    section: "مزايا التسوق",
    shipping: "شحن مجاني",
    shippingDesc: "للطلبات التي تتجاوز 6000 روبية",
    returns: "إرجاع سهل",
    returnsDesc: "الإرجاع والاستبدال خلال 14 يومًا",
    delivery: "توصيل سريع",
    deliveryDesc: "خلال 3 إلى 5 أيام عمل",
    checkout: "دفع آمن",
    checkoutDesc: "تسوق بكل ثقة",
    payments: "دفع سهل",
    paymentsDesc: "خيارات دفع مريحة",
    support: "دعم العملاء",
    supportDesc: "نحن هنا لمساعدتك",
    previous: "الميزة السابقة",
    next: "الميزة التالية",
    show: "عرض الميزة",
  },
  zh: {
    section: "购物优势",
    shipping: "免费配送",
    shippingDesc: "订单金额超过6000卢比",
    returns: "轻松退换",
    returnsDesc: "14天退货与换货",
    delivery: "快速配送",
    deliveryDesc: "3至5个工作日内送达",
    checkout: "安全结账",
    checkoutDesc: "放心购物",
    payments: "便捷支付",
    paymentsDesc: "多种便捷支付方式",
    support: "客户支持",
    supportDesc: "我们随时为您提供帮助",
    previous: "上一项优势",
    next: "下一项优势",
    show: "查看优势",
  },
  ja: {
    section: "ショッピングの特典",
    shipping: "送料無料",
    shippingDesc: "6,000ルピー以上のご注文",
    returns: "簡単返品",
    returnsDesc: "14日以内の返品・交換",
    delivery: "迅速な配送",
    deliveryDesc: "3〜5営業日以内にお届け",
    checkout: "安全な決済",
    checkoutDesc: "安心してお買い物",
    payments: "簡単なお支払い",
    paymentsDesc: "便利なお支払い方法",
    support: "カスタマーサポート",
    supportDesc: "いつでもサポートします",
    previous: "前の特典",
    next: "次の特典",
    show: "特典を表示",
  },
  fr: {
    section: "Avantages de la boutique",
    shipping: "LIVRAISON GRATUITE",
    shippingDesc: "Dès 6 000 roupies d'achat",
    returns: "RETOURS FACILES",
    returnsDesc: "Retour et échange sous 14 jours",
    delivery: "LIVRAISON RAPIDE",
    deliveryDesc: "Sous 3 à 5 jours ouvrés",
    checkout: "PAIEMENT SÉCURISÉ",
    checkoutDesc: "Achetez en toute confiance",
    payments: "PAIEMENT FACILE",
    paymentsDesc: "Des options de paiement pratiques",
    support: "SERVICE CLIENT",
    supportDesc: "Nous sommes là pour vous aider",
    previous: "Avantage précédent",
    next: "Avantage suivant",
    show: "Afficher l'avantage",
  },
};

const AUTO_SLIDE_DELAY = 3500;

const ProductBenefits = () => {
  const { language } = useLanguage();
  const t = (key) =>
    translations[language]?.[key] || translations.en[key] || key;

  const isRTL = language === "ur" || language === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalBenefits = benefits.length;

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % totalBenefits);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + totalBenefits) % totalBenefits
    );
  };

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalBenefits);
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(timer);
  }, [isPaused, totalBenefits]);

  return (
    <section
      aria-label={t("section")}
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      {/* Desktop and tablet benefits */}
      <div className="mx-auto hidden max-w-[1600px] grid-cols-3 divide-x divide-white/20 px-4 py-5 sm:px-6 md:grid lg:grid-cols-6 lg:px-10">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-center justify-center gap-3 px-3 py-2"
          >
            <span className="shrink-0 text-2xl" aria-hidden="true">
              {benefit.icon}
            </span>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.1em] lg:text-[11px]">
                {t(benefit.title)}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/75">
                {t(benefit.description)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile slider */}
      <div className="relative flex min-h-[112px] items-center gap-2 px-3 pb-5 pt-4 sm:min-h-[124px] sm:px-5 md:hidden">
        <button
          type="button"
          onClick={isRTL ? nextSlide : previousSlide}
          aria-label={t("previous")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-2xl text-white transition hover:bg-white hover:text-black active:scale-95"
        >
          {isRTL ? "›" : "‹"}
        </button>

        <div className="min-w-0 flex-1 overflow-hidden" aria-live="polite" aria-atomic="true">
          <div
            className="flex items-stretch transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{
              transform: `translateX(${isRTL ? "" : "-"}${activeIndex * 100}%)`,
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                aria-hidden={activeIndex !== index}
                className="flex w-full shrink-0 items-center justify-center gap-3 px-1 text-center"
              >
                <span className="shrink-0 text-3xl sm:text-4xl" aria-hidden="true">
                  {benefit.icon}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase leading-5 tracking-[0.08em] sm:text-base">
                    {t(benefit.title)}
                  </p>
                  <p className="mt-1.5 text-sm leading-5 text-white/80 sm:text-base">
                    {t(benefit.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={isRTL ? previousSlide : nextSlide}
          aria-label={t("next")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-2xl text-white transition hover:bg-white hover:text-black active:scale-95"
        >
          {isRTL ? "‹" : "›"}
        </button>

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {benefits.map((benefit, index) => (
            <button
              key={benefit.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${t("show")} ${index + 1}: ${t(benefit.title)}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBenefits;
