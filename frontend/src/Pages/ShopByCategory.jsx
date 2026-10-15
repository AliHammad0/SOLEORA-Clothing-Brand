
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const CATEGORIES = [
  {
    id: "men",
    subtitle: "THE EVERYDAY EDIT",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    link: "/men",
  },
  {
    id: "women",
    subtitle: "MADE TO STAND OUT",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=85",
    link: "/women",
  },
  {
    id: "kids",
    subtitle: "LITTLE STEPS, BIG STYLE",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=85",
    link: "/kids",
  },
];

const TRANSLATIONS = {
  en: {
    eyebrow: "DISCOVER SOLEORA",
    title: "Find your kind of style.",
    description: "Explore footwear designed to complement every moment.",
    explore: "Shop collection",
    previous: "Previous category",
    next: "Next category",
    categories: { men: "Men", women: "Women", kids: "Kids" },
  },
  ur: {
    eyebrow: "سولیورا دریافت کریں",
    title: "اپنے انداز کا انتخاب کریں۔",
    description: "ہر موقع کے لیے خوبصورت جوتوں کا انتخاب۔",
    explore: "کلیکشن دیکھیں",
    previous: "پچھلی کیٹیگری",
    next: "اگلی کیٹیگری",
    categories: { men: "مرد", women: "خواتین", kids: "بچے" },
  },
  bn: {
    eyebrow: "SOLEORA আবিষ্কার করুন",
    title: "খুঁজে নিন আপনার স্টাইল।",
    description: "প্রতিটি মুহূর্তের জন্য মানানসই জুতা।",
    explore: "কালেকশন দেখুন",
    previous: "আগের ক্যাটাগরি",
    next: "পরের ক্যাটাগরি",
    categories: { men: "পুরুষ", women: "নারী", kids: "শিশু" },
  },
  hi: {
    eyebrow: "SOLEORA की दुनिया",
    title: "अपना स्टाइल चुनें।",
    description: "हर मौके के लिए खास फुटवियर।",
    explore: "कलेक्शन देखें",
    previous: "पिछली श्रेणी",
    next: "अगली श्रेणी",
    categories: { men: "पुरुष", women: "महिलाएं", kids: "बच्चे" },
  },
  ar: {
    eyebrow: "اكتشف SOLEORA",
    title: "اختر أسلوبك الخاص.",
    description: "أحذية تناسب مختلف لحظاتك.",
    explore: "تسوق المجموعة",
    previous: "الفئة السابقة",
    next: "الفئة التالية",
    categories: { men: "رجال", women: "نساء", kids: "أطفال" },
  },
  zh: {
    eyebrow: "探索 SOLEORA",
    title: "找到你的风格。",
    description: "为每一个时刻挑选合适的鞋履。",
    explore: "探索系列",
    previous: "上一类别",
    next: "下一类别",
    categories: { men: "男士", women: "女士", kids: "儿童" },
  },
  ja: {
    eyebrow: "SOLEORAを発見",
    title: "自分らしいスタイルを。",
    description: "さまざまなシーンに合うシューズを。",
    explore: "コレクションを見る",
    previous: "前のカテゴリー",
    next: "次のカテゴリー",
    categories: { men: "メンズ", women: "レディース", kids: "キッズ" },
  },
  fr: {
    eyebrow: "DÉCOUVREZ SOLEORA",
    title: "Trouvez votre style.",
    description: "Des chaussures pour chaque moment.",
    explore: "Découvrir la collection",
    previous: "Catégorie précédente",
    next: "Catégorie suivante",
    categories: { men: "Homme", women: "Femme", kids: "Enfants" },
  },
};

const STYLES = `
  .soleora-reveal {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .45s ease, transform .45s ease;
  }

  .soleora-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .soleora-slider {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x pan-y;
  }

  .soleora-slider::-webkit-scrollbar {
    display: none;
  }

  .soleora-slide {
    flex: 0 0 100%;
    min-width: 0;
    scroll-snap-align: start;
  }

  .soleora-category-image {
    transition: transform .6s cubic-bezier(.2,.65,.3,1);
  }

  .soleora-category-card:hover .soleora-category-image {
    transform: scale(1.04);
  }

  .soleora-category-arrow {
    transition: background-color .2s ease, color .2s ease,
      border-color .2s ease;
  }

  .soleora-category-card:hover .soleora-category-arrow {
    background: #171717;
    color: white;
    border-color: #171717;
  }

  .soleora-slider-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid #d4d4d4;
    border-radius: 50%;
    color: #171717;
    background: #fff;
    transition: background-color .2s ease, color .2s ease,
      border-color .2s ease, opacity .2s ease;
  }

  .soleora-slider-control:hover:not(:disabled) {
    color: #fff;
    background: #171717;
    border-color: #171717;
  }

  .soleora-slider-control:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  .soleora-progress {
    height: 2px;
    transform-origin: left;
    animation: soleora-progress 3s linear infinite;
  }

  @keyframes soleora-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  @media (min-width: 640px) {
    .soleora-slide {
      flex-basis: calc((100% - 20px) / 2);
    }
  }

  @media (min-width: 1024px) {
    .soleora-slide {
      flex-basis: calc((100% - 48px) / 3);
    }
  }

  @media (max-width: 639px) {
    .soleora-slider-control {
      width: 38px;
      height: 38px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .soleora-reveal,
    .soleora-category-image,
    .soleora-category-arrow,
    .soleora-slider-control,
    .soleora-slider {
      transition: none;
      scroll-behavior: auto;
    }

    .soleora-progress {
      animation: none;
    }
  }
`;

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CategoryCard({ category, translation, isRTL }) {
  const categoryName = translation.categories[category.id];

  return (
    <Link
      to={category.link}
      aria-label={`${translation.explore}: ${categoryName}`}
      className="soleora-category-card group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f1ed]">
        <img
          src={category.image}
          alt={`${categoryName} footwear collection`}
          loading="lazy"
          decoding="async"
          className="soleora-category-image h-full w-full object-cover"
        />

        <span className="absolute left-3 top-3 max-w-[90%] bg-white px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-800 sm:left-4 sm:top-4 sm:px-3 sm:text-[10px]">
          {category.subtitle}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 py-4 sm:py-5">
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight text-neutral-950 sm:text-2xl">
            {categoryName}
          </h3>

          <p className="mt-1 text-[10px] tracking-wide text-neutral-500 sm:text-xs">
            {translation.explore}
          </p>
        </div>

        <span className="soleora-category-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-900 sm:h-10 sm:w-10">
          <ArrowIcon direction={isRTL ? "left" : "right"} />
        </span>
      </div>
    </Link>
  );
}

export default function ShopByCategory() {
  const { language } = useLanguage();

  const translation = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRTL = language === "ur" || language === "ar";

  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const activeIndexRef = useRef(0);
  const interactionTimeoutRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index, behavior = "smooth") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = slider.querySelectorAll(".soleora-slide");
    if (!slides.length) return;

    const nextIndex = (index + slides.length) % slides.length;
    const slide = slides[nextIndex];

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    slider.scrollTo({
      left: slide.offsetLeft - slider.offsetLeft,
      behavior,
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateActiveIndex = () => {
      const slides = Array.from(
        slider.querySelectorAll(".soleora-slide")
      );

      if (!slides.length) return;

      const sliderRect = slider.getBoundingClientRect();
      let closestIndex = 0;
      let closestDistance = Infinity;

      slides.forEach((slide, index) => {
        const distance = Math.abs(
          slide.getBoundingClientRect().left - sliderRect.left
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    };

    slider.addEventListener("scroll", updateActiveIndex, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveIndex);

    return () => {
      slider.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, []);

  // Automatically change category every 3 seconds.
  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;

      // Allow manual swiping/clicking to finish before autoplay resumes.
      if (interactionTimeoutRef.current) return;

      goToSlide(activeIndexRef.current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isVisible]);

  const handleManualMove = (direction) => {
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }

    goToSlide(activeIndexRef.current + direction);

    interactionTimeoutRef.current = window.setTimeout(() => {
      interactionTimeoutRef.current = null;
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="soleora-category-title"
      className="overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
    >
      <style>{STYLES}</style>

      <div className="mx-auto max-w-7xl">
        <div
          className={`soleora-reveal mb-6 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-neutral-500 sm:mb-3 sm:text-xs">
              {translation.eyebrow}
            </p>

            <h2
              id="soleora-category-title"
              className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-5xl"
            >
              {translation.title}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
              {translation.description}
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span className="text-[10px] tracking-[0.16em] text-neutral-500 sm:text-xs">
              {String(activeIndex + 1).padStart(2, "0")} / 03
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualMove(-1)}
                aria-label={translation.previous}
                className="soleora-slider-control"
              >
                <ArrowIcon direction="left" />
              </button>

              <button
                type="button"
                onClick={() => handleManualMove(1)}
                aria-label={translation.next}
                className="soleora-slider-control"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          onPointerDown={() => {
            if (interactionTimeoutRef.current) {
              window.clearTimeout(interactionTimeoutRef.current);
            }

            interactionTimeoutRef.current = window.setTimeout(() => {
              interactionTimeoutRef.current = null;
            }, 3500);
          }}
          className="soleora-slider gap-4 sm:gap-5 lg:gap-6"
        >
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              className={`soleora-reveal soleora-slide ${
                isVisible ? "is-visible" : ""
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <CategoryCard
                category={category}
                translation={translation}
                isRTL={isRTL}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              type="button"
              aria-label={`Go to ${translation.categories[category.id]}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => {
                if (interactionTimeoutRef.current) {
                  window.clearTimeout(interactionTimeoutRef.current);
                }

                goToSlide(index);

                interactionTimeoutRef.current = window.setTimeout(() => {
                  interactionTimeoutRef.current = null;
                }, 3500);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-6 bg-neutral-900"
                  : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>

        <div className="mt-4 h-[2px] overflow-hidden bg-neutral-100">
          <div
            key={activeIndex}
            className="soleora-progress h-full bg-neutral-900"
          />
        </div>
      </div>
    </section>
  );
}
