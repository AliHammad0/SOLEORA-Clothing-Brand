
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    home: "Home",
    shop: "Shop",
    newArrivals: "New Arrivals",
    shopByCategory: "Shop By Category",
    specialPrices: "Special Prices",
    testimonials: "Testimonials",
    benefits: "Product Benefits",
    login: "Login",
    cart: "Cart",
    terms: "Terms & Conditions",
    returns: "Returns & Exchange Policy",
    footer: "All rights reserved.",
    notFound: "Sorry, this page could not be found.",
    backHome: "Back to Home",
  },

  ur: {
    home: "ہوم",
    shop: "خریداری",
    newArrivals: "نئی مصنوعات",
    shopByCategory: "کیٹیگری کے مطابق خریداری",
    specialPrices: "خصوصی قیمتیں",
    testimonials: "صارفین کی آراء",
    benefits: "مصنوعات کے فوائد",
    login: "لاگ اِن",
    cart: "کارٹ",
    terms: "شرائط و ضوابط",
    returns: "واپسی اور تبدیلی کی پالیسی",
    footer: "جملہ حقوق محفوظ ہیں۔",
    notFound: "معذرت، یہ صفحہ نہیں ملا۔",
    backHome: "ہوم پیج پر واپس جائیں",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);

    document.documentElement.lang = language;

    const isRTL = language === "ur" || language === "ar";

    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    document.body.classList.remove(
      "lang-en",
      "lang-ur",
      "lang-hi",
      "lang-bn",
      "lang-ar",
      "lang-zh",
      "lang-ja",
      "lang-fr"
    );

    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const t = (key) =>
    translations[language]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
