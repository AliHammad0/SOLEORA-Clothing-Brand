
import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const GoToTop = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const translations = {
    en: "Go To Top",
    ur: "اوپر جائیں",
    hi: "ऊपर जाएँ",
    bn: "উপরে যান",
    ar: "اذهب إلى الأعلى",
    zh: "回到顶部",
    ja: "トップへ戻る",
    fr: "Retour en haut",
  };

  const buttonText = translations[language] || translations.en;
  const isRTL = language === "ur" || language === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={buttonText}
      title={buttonText}
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed bottom-6 z-50 inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:bottom-8 sm:px-5 sm:py-3.5 sm:text-base ${
        isRTL ? "left-4 sm:left-8" : "right-4 sm:right-8"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
        <path d="M12 9V21" />
      </svg>

      <span>{buttonText}</span>
    </button>
  );
};

export default GoToTop;
