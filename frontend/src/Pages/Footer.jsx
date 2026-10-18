
import React from "react";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  en: {
    information: "INFORMATION",
    about: "About Us",
    contact: "Contact Us",
    faqs: "FAQs",
    privacy: "Privacy Policy",
    careers: "Careers",
    shop: "SHOP",
    newArrivals: "New Arrivals",
    women: "Women",
    men: "Men",
    service: "CUSTOMER SERVICE",
    terms: "Terms & Conditions",
    shipping: "Shipping & Delivery",
    track: "Track your Order",
    returns: "Returns & Exchange Policy",
    community: "JOIN THE COMMUNITY",
    newsletter: "Stay up-to-date with new launches and offers. Sign up now and get 10% off your first purchase!",
    email: "Email address",
    subscribe: "Subscribe",
    thankYou: "Thank you for joining our community!",
    copyright: "All rights reserved.",
  },
  ur: {
    information: "معلومات",
    about: "ہمارے بارے میں",
    contact: "ہم سے رابطہ کریں",
    faqs: "اکثر پوچھے جانے والے سوالات",
    privacy: "رازداری کی پالیسی",
    careers: "ملازمتیں",
    shop: "خریداری",
    newArrivals: "نئی مصنوعات",
    women: "خواتین",
    men: "مرد",
    service: "صارفین کی خدمات",
    terms: "شرائط و ضوابط",
    shipping: "شپنگ اور ڈیلیوری",
    track: "اپنا آرڈر ٹریک کریں",
    returns: "واپسی اور تبدیلی کی پالیسی",
    community: "ہماری کمیونٹی میں شامل ہوں",
    newsletter: "نئی مصنوعات اور خصوصی آفرز سے باخبر رہیں۔ ابھی سائن اپ کریں اور پہلی خریداری پر 10% رعایت حاصل کریں!",
    email: "ای میل ایڈریس",
    subscribe: "سبسکرائب کریں",
    thankYou: "ہماری کمیونٹی میں شامل ہونے کا شکریہ!",
    copyright: "جملہ حقوق محفوظ ہیں۔",
  },
  hi: {
    information: "जानकारी",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    faqs: "अक्सर पूछे जाने वाले सवाल",
    privacy: "गोपनीयता नीति",
    careers: "करियर",
    shop: "खरीदारी",
    newArrivals: "नए उत्पाद",
    women: "महिलाएँ",
    men: "पुरुष",
    service: "ग्राहक सेवा",
    terms: "नियम और शर्तें",
    shipping: "शिपिंग और डिलीवरी",
    track: "अपना ऑर्डर ट्रैक करें",
    returns: "वापसी और एक्सचेंज नीति",
    community: "हमारे समुदाय से जुड़ें",
    newsletter: "नए उत्पादों और ऑफ़र की जानकारी पाएँ। साइन अप करें और पहली खरीदारी पर 10% की छूट पाएँ!",
    email: "ईमेल पता",
    subscribe: "सब्सक्राइब करें",
    thankYou: "हमारे समुदाय से जुड़ने के लिए धन्यवाद!",
    copyright: "सर्वाधिकार सुरक्षित।",
  },
  bn: {
    information: "তথ্য",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ করুন",
    faqs: "সাধারণ প্রশ্নাবলি",
    privacy: "গোপনীয়তা নীতি",
    careers: "ক্যারিয়ার",
    shop: "কেনাকাটা",
    newArrivals: "নতুন পণ্য",
    women: "নারী",
    men: "পুরুষ",
    service: "গ্রাহক সেবা",
    terms: "শর্তাবলি",
    shipping: "শিপিং ও ডেলিভারি",
    track: "আপনার অর্ডার ট্র্যাক করুন",
    returns: "ফেরত ও বিনিময় নীতি",
    community: "আমাদের কমিউনিটিতে যোগ দিন",
    newsletter: "নতুন পণ্য ও অফারের খবর পান। সাইন আপ করে প্রথম কেনাকাটায় ১০% ছাড় নিন!",
    email: "ইমেইল ঠিকানা",
    subscribe: "সাবস্ক্রাইব করুন",
    thankYou: "আমাদের কমিউনিটিতে যোগ দেওয়ার জন্য ধন্যবাদ!",
    copyright: "সর্বস্বত্ব সংরক্ষিত।",
  },
  ar: {
    information: "معلومات",
    about: "من نحن",
    contact: "اتصل بنا",
    faqs: "الأسئلة الشائعة",
    privacy: "سياسة الخصوصية",
    careers: "الوظائف",
    shop: "تسوق",
    newArrivals: "وصل حديثًا",
    women: "نساء",
    men: "رجال",
    service: "خدمة العملاء",
    terms: "الشروط والأحكام",
    shipping: "الشحن والتوصيل",
    track: "تتبع طلبك",
    returns: "سياسة الإرجاع والاستبدال",
    community: "انضم إلى مجتمعنا",
    newsletter: "تابع أحدث المنتجات والعروض. سجّل الآن واحصل على خصم 10% على أول عملية شراء!",
    email: "البريد الإلكتروني",
    subscribe: "اشترك",
    thankYou: "شكرًا لانضمامك إلى مجتمعنا!",
    copyright: "جميع الحقوق محفوظة.",
  },
  zh: {
    information: "信息",
    about: "关于我们",
    contact: "联系我们",
    faqs: "常见问题",
    privacy: "隐私政策",
    careers: "招聘信息",
    shop: "购物",
    newArrivals: "新品上市",
    women: "女装",
    men: "男装",
    service: "客户服务",
    terms: "条款与条件",
    shipping: "配送与运输",
    track: "追踪订单",
    returns: "退换货政策",
    community: "加入我们的社区",
    newsletter: "及时了解新品和优惠。立即注册，首次购买可享受九折优惠！",
    email: "电子邮箱",
    subscribe: "订阅",
    thankYou: "感谢您加入我们的社区！",
    copyright: "版权所有。",
  },
  ja: {
    information: "インフォメーション",
    about: "私たちについて",
    contact: "お問い合わせ",
    faqs: "よくある質問",
    privacy: "プライバシーポリシー",
    careers: "採用情報",
    shop: "ショップ",
    newArrivals: "新着商品",
    women: "レディース",
    men: "メンズ",
    service: "カスタマーサービス",
    terms: "利用規約",
    shipping: "配送について",
    track: "注文を追跡",
    returns: "返品・交換ポリシー",
    community: "コミュニティに参加",
    newsletter: "新商品やお得な情報をお届けします。登録すると初回購入が10%オフになります！",
    email: "メールアドレス",
    subscribe: "登録する",
    thankYou: "コミュニティへのご参加ありがとうございます！",
    copyright: "無断転載を禁じます。",
  },
  fr: {
    information: "INFORMATIONS",
    about: "À propos",
    contact: "Contactez-nous",
    faqs: "FAQ",
    privacy: "Politique de confidentialité",
    careers: "Carrières",
    shop: "BOUTIQUE",
    newArrivals: "Nouveautés",
    women: "Femmes",
    men: "Hommes",
    service: "SERVICE CLIENT",
    terms: "Conditions générales",
    shipping: "Livraison",
    track: "Suivre votre commande",
    returns: "Politique de retour et d'échange",
    community: "REJOIGNEZ NOTRE COMMUNAUTÉ",
    newsletter: "Découvrez nos nouveautés et offres. Inscrivez-vous et profitez de 10 % de réduction sur votre premier achat !",
    email: "Adresse e-mail",
    subscribe: "S'abonner",
    thankYou: "Merci de rejoindre notre communauté !",
    copyright: "Tous droits réservés.",
  },
};

const Footer = () => {
  const { language } = useLanguage();
  const t = (key) =>
    translations[language]?.[key] || translations.en[key] || key;

  const isRTL = language === "ur" || language === "ar";

  const handleSubscribe = (e) => {
    e.preventDefault();
    window.alert(t("thankYou"));
    e.currentTarget.reset();
  };

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="border-t border-gray-200 bg-white text-black"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 text-sm font-bold">{t("information")}</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><a href="/about" className="hover:underline">{t("about")}</a></li>
              <li><a href="/pages/contact" className="hover:underline">{t("contact")}</a></li>
              <li><a href="/pages/faqs" className="hover:underline">{t("faqs")}</a></li>
              <li><a href="/pages/privacy-policy" className="hover:underline">{t("privacy")}</a></li>
              <li><a href="/pages/careers" className="hover:underline">{t("careers")}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold">{t("shop")}</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><a href="/collections" className="hover:underline">{t("newArrivals")}</a></li>
              <li><a href="/collections/womens-clothing" className="hover:underline">{t("women")}</a></li>
              <li><a href="/collections/mens-clothing" className="hover:underline">{t("men")}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold">{t("service")}</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><a href="/terms" className="hover:underline">{t("terms")}</a></li>
              <li><a href="/pages/shipping-and-delivery" className="hover:underline">{t("shipping")}</a></li>
              <li><a href="/pages/track-your-order" className="hover:underline">{t("track")}</a></li>
              <li><a href="/ReturnsExchangePolicy" className="hover:underline">{t("returns")}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold">{t("community")}</h3>
            <p className="mb-5 text-sm leading-6 text-gray-700">
              {t("newsletter")}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex border-b border-black pb-2"
            >
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                aria-label={t("email")}
                required
                className="w-full bg-transparent text-sm outline-none"
              />
              <button
                type="submit"
                aria-label={t("subscribe")}
                className="ms-3 shrink-0"
              >
                {isRTL ? "←" : "→"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-center text-xs text-gray-600 sm:flex-row">
          <p>© 2026, Ali Hammad. {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
