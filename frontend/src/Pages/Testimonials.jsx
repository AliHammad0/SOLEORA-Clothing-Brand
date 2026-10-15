
import React, { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const reviews = [
  {
    name: "Hassan Mehmood",
    product: "Dusty Blue Set",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop",
    review: {
      en: "Excellent quality and a comfortable fit. The fabric feels premium, and the overall look is exactly what I wanted.",
      ur: "بہترین کوالٹی اور آرام دہ فٹنگ۔ کپڑا پریمیم محسوس ہوتا ہے اور ڈیزائن بالکل میری پسند کے مطابق ہے۔",
      hi: "बेहतरीन गुणवत्ता और आरामदायक फिटिंग। कपड़ा प्रीमियम लगता है और डिज़ाइन मेरी पसंद के अनुसार है।",
      bn: "চমৎকার মান এবং আরামদায়ক ফিটিং। কাপড়টি প্রিমিয়াম এবং ডিজাইনটি আমার পছন্দ অনুযায়ী।",
      ar: "جودة ممتازة ومقاس مريح. القماش فاخر والتصميم مطابق تمامًا لما أردته.",
      zh: "品质出色，穿着舒适。面料质感高级，整体设计完全符合我的期待。",
      ja: "品質が素晴らしく、着心地も快適です。生地に高級感があり、デザインも理想どおりです。",
      fr: "Excellente qualité et coupe confortable. Le tissu est haut de gamme et le style correspond exactement à mes attentes.",
    },
  },
  {
    name: "Mujtaba Faisal Shafi",
    product: "Anywear Polo",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=700&fit=crop",
    review: {
      en: "Really happy with the purchase. The fitting is great, the material feels good, and the delivery experience was smooth.",
      ur: "خرید سے بہت خوش ہوں۔ فٹنگ بہترین ہے، کپڑا اچھا ہے اور ڈیلیوری کا تجربہ بھی بہت اچھا رہا۔",
      hi: "इस खरीदारी से बहुत खुश हूँ। फिटिंग अच्छी है, कपड़ा बढ़िया है और डिलीवरी का अनुभव भी शानदार रहा।",
      bn: "কেনাকাটায় আমি খুব খুশি। ফিটিং দারুণ, কাপড় ভালো এবং ডেলিভারির অভিজ্ঞতাও চমৎকার।",
      ar: "أنا سعيد جدًا بالشراء. المقاس رائع والخامة جيدة وتجربة التوصيل كانت سلسة.",
      zh: "我对这次购物非常满意。版型合适，面料舒适，配送体验也很顺利。",
      ja: "購入してとても満足しています。サイズ感がよく、素材も快適で、配送もスムーズでした。",
      fr: "Très satisfait de mon achat. La coupe est parfaite, la matière agréable et la livraison s'est bien passée.",
    },
  },
  {
    name: "Hamza Saeed",
    product: "Boxy Shirt",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop",
    review: {
      en: "Great style and comfortable material. It looks even better when worn. Definitely a good addition to my wardrobe.",
      ur: "بہترین اسٹائل اور آرام دہ کپڑا۔ پہننے پر یہ مزید اچھا لگتا ہے۔ میری وارڈروب میں ایک بہترین اضافہ ہے۔",
      hi: "शानदार स्टाइल और आरामदायक कपड़ा। पहनने पर यह और भी अच्छा लगता है। मेरी अलमारी के लिए बेहतरीन विकल्प।",
      bn: "দারুণ স্টাইল এবং আরামদায়ক কাপড়। পরলে আরও সুন্দর লাগে। আমার পোশাকের সংগ্রহে চমৎকার সংযোজন।",
      ar: "تصميم رائع وخامة مريحة. يبدو أجمل عند ارتدائه، وهو إضافة ممتازة لخزانة ملابسي.",
      zh: "款式时尚，面料舒适。穿上后更好看，是衣橱里的绝佳单品。",
      ja: "スタイリッシュで着心地の良い素材です。着るとさらに素敵で、ワードローブにぴったりです。",
      fr: "Un superbe style et une matière confortable. Le vêtement est encore plus beau porté et complète parfaitement ma garde-robe.",
    },
  },
  {
    name: "Zahra Hamad",
    product: "Women's Collection",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=700&fit=crop",
    review: {
      en: "Beautiful design, lovely quality, and a very comfortable fit. I would happily shop here again.",
      ur: "خوبصورت ڈیزائن، بہترین کوالٹی اور بہت آرام دہ فٹنگ۔ میں دوبارہ یہاں سے خریداری کرنا پسند کروں گی۔",
      hi: "खूबसूरत डिज़ाइन, बेहतरीन गुणवत्ता और आरामदायक फिटिंग। मैं यहाँ दोबारा खरीदारी करना पसंद करूँगी।",
      bn: "সুন্দর ডিজাইন, চমৎকার মান এবং আরামদায়ক ফিটিং। আমি আবারও এখান থেকে কেনাকাটা করতে চাই।",
      ar: "تصميم جميل وجودة رائعة ومقاس مريح جدًا. يسعدني التسوق هنا مرة أخرى.",
      zh: "设计漂亮，品质出色，穿着非常舒适。我很愿意再次光大这里购物。",
      ja: "美しいデザインと優れた品質で、とても快適です。またぜひ買い物したいです。",
      fr: "Un joli design, une belle qualité et une coupe très confortable. Je reviendrai volontiers faire mes achats ici.",
    },
  },
  {
    name: "Tayyaba Nisa",
    product: "Everyday Wear",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=700&fit=crop",
    review: {
      en: "The outfit looks stylish and feels comfortable throughout the day. Very happy with the overall quality.",
      ur: "لباس اسٹائلش ہے اور پورا دن آرام دہ رہتا ہے۔ مجموعی کوالٹی سے بہت خوش ہوں۔",
      hi: "यह पोशाक स्टाइलिश है और पूरे दिन आरामदायक रहती है। इसकी गुणवत्ता से बहुत खुश हूँ।",
      bn: "পোশাকটি স্টাইলিশ এবং সারাদিন আরামদায়ক। সামগ্রিক মানে আমি খুব খুশি।",
      ar: "الملابس أنيقة ومريحة طوال اليوم. أنا سعيدة جدًا بالجودة بشكل عام.",
      zh: "这套衣服时尚又舒适，全天穿着都很自在。我对整体品质非常满意。",
      ja: "スタイリッシュで一日中快適に着られます。全体的な品質にも大満足です。",
      fr: "La tenue est élégante et confortable toute la journée. Je suis très satisfaite de la qualité générale.",
    },
  },
  {
    name: "Asad Zaki",
    product: "Men's Collection",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&h=700&fit=crop",
    review: {
      en: "Nice fitting and clean design. The quality is impressive for everyday use, and the product looks great.",
      ur: "اچھی فٹنگ اور سادہ ڈیزائن۔ روزمرہ استعمال کے لیے کوالٹی متاثر کن ہے اور پروڈکٹ بھی خوبصورت ہے۔",
      hi: "अच्छी फिटिंग और साफ़ डिज़ाइन। रोज़मर्रा के इस्तेमाल के लिए गुणवत्ता शानदार है और उत्पाद भी अच्छा दिखता है।",
      bn: "ভালো ফিটিং এবং সুন্দর ডিজাইন। প্রতিদিনের ব্যবহারের জন্য মান দারুণ এবং পণ্যটিও দেখতে সুন্দর।",
      ar: "مقاس جيد وتصميم أنيق. الجودة مميزة للاستخدام اليومي والمنتج يبدو رائعًا.",
      zh: "版型合适，设计简洁。日常使用的品质令人满意，产品外观也很出色。",
      ja: "フィット感が良く、すっきりしたデザインです。普段使いに最適な品質で、見た目も素敵です。",
      fr: "Une belle coupe et un design épuré. La qualité est remarquable au quotidien et le produit est très esthétique.",
    },
  },
];

const AUTO_PLAY_DELAY = 4500;

const translations = {
  en: {
    badge: "Customer stories",
    title: "Loved by you.",
    subtitle: "Made for your everyday.",
    description: "Discover what our customers have to say about their experience, from everyday essentials to their favorite styles.",
    overall: "Overall customer rating",
    based: "Based on 736 reviews",
    verified: "Customer testimonial",
    thanks: "Thank you for being part of our journey.",
    inspiration: "Your style inspires us.",
    previous: "Previous customer review",
    next: "Next customer review",
    goTo: "Go to review",
    rating: "out of 5 stars",
  },
  ur: {
    badge: "صارفین کے تجربات",
    title: "آپ کی پسند۔",
    subtitle: "ہر دن کے لیے بہترین۔",
    description: "جانیں کہ ہمارے صارفین ہماری مصنوعات، معیار اور خریداری کے تجربے کے بارے میں کیا کہتے ہیں۔",
    overall: "صارفین کی مجموعی ریٹنگ",
    based: "736 جائزوں کی بنیاد پر",
    verified: "صارف کا جائزہ",
    thanks: "ہمارے سفر کا حصہ بننے کا شکریہ۔",
    inspiration: "آپ کا اسٹائل ہماری ترغیب ہے۔",
    previous: "پچھلا جائزہ",
    next: "اگلا جائزہ",
    goTo: "جائزہ دیکھیں",
    rating: "میں سے 5 ستارے",
  },
  hi: {
    badge: "ग्राहकों के अनुभव",
    title: "आपकी पसंद।",
    subtitle: "हर दिन के लिए।",
    description: "जानें कि हमारे ग्राहक हमारे उत्पादों, गुणवत्ता और खरीदारी के अनुभव के बारे में क्या कहते हैं।",
    overall: "ग्राहकों की कुल रेटिंग",
    based: "736 समीक्षाओं के आधार पर",
    verified: "ग्राहक की समीक्षा",
    thanks: "हमारी यात्रा का हिस्सा बनने के लिए धन्यवाद।",
    inspiration: "आपका स्टाइल हमें प्रेरित करता है।",
    previous: "पिछली समीक्षा",
    next: "अगली समीक्षा",
    goTo: "समीक्षा देखें",
    rating: "में से 5 सितारे",
  },
  bn: {
    badge: "গ্রাহকদের অভিজ্ঞতা",
    title: "আপনাদের পছন্দ।",
    subtitle: "প্রতিদিনের জন্য।",
    description: "আমাদের পণ্য, গুণমান এবং কেনাকাটার অভিজ্ঞতা সম্পর্কে গ্রাহকদের মতামত জানুন।",
    overall: "গ্রাহকদের সামগ্রিক রেটিং",
    based: "৭৩৬টি রিভিউয়ের ভিত্তিতে",
    verified: "গ্রাহকের মতামত",
    thanks: "আমাদের যাত্রার অংশ হওয়ার জন্য ধন্যবাদ।",
    inspiration: "আপনার স্টাইল আমাদের অনুপ্রাণিত করে।",
    previous: "আগের রিভিউ",
    next: "পরের রিভিউ",
    goTo: "রিভিউ দেখুন",
    rating: "এর মধ্যে ৫টি তারকা",
  },
  ar: {
    badge: "تجارب العملاء",
    title: "أنتم مصدر إعجابنا.",
    subtitle: "مصممة لكل يوم.",
    description: "اكتشفوا آراء عملائنا حول المنتجات والجودة وتجربة التسوق.",
    overall: "تقييم العملاء الإجمالي",
    based: "بناءً على 736 مراجعة",
    verified: "رأي أحد العملاء",
    thanks: "شكرًا لكونكم جزءًا من رحلتنا.",
    inspiration: "أسلوبكم يلهمنا.",
    previous: "المراجعة السابقة",
    next: "المراجعة التالية",
    goTo: "عرض المراجعة",
    rating: "من أصل 5 نجوم",
  },
  zh: {
    badge: "顾客体验",
    title: "深受喜爱。",
    subtitle: "为日常生活而设计。",
    description: "了解顾客对我们的产品、品质和购物体验的真实感受。",
    overall: "顾客综合评分",
    based: "基于736条评价",
    verified: "顾客评价",
    thanks: "感谢您成为我们旅程的一部分。",
    inspiration: "您的风格激励着我们。",
    previous: "上一条评价",
    next: "下一条评价",
    goTo: "查看评价",
    rating: "满分5颗星",
  },
  ja: {
    badge: "お客様の声",
    title: "愛される理由。",
    subtitle: "毎日のためのスタイル。",
    description: "商品、品質、お買い物体験についてのお客様の声をご覧ください。",
    overall: "お客様の総合評価",
    based: "736件のレビューに基づく",
    verified: "お客様のレビュー",
    thanks: "私たちの歩みを支えてくださり、ありがとうございます。",
    inspiration: "皆様のスタイルが私たちの inspiration です。",
    previous: "前のレビュー",
    next: "次のレビュー",
    goTo: "レビューを見る",
    rating: "5つ星中",
  },
  fr: {
    badge: "Témoignages clients",
    title: "Vous nous aimez.",
    subtitle: "Pensé pour votre quotidien.",
    description: "Découvrez les avis de nos clients sur nos produits, leur qualité et leur expérience d'achat.",
    overall: "Note globale des clients",
    based: "Basé sur 736 avis",
    verified: "Témoignage client",
    thanks: "Merci de faire partie de notre aventure.",
    inspiration: "Votre style nous inspire.",
    previous: "Avis précédent",
    next: "Avis suivant",
    goTo: "Voir l'avis",
    rating: "sur 5 étoiles",
  },
};

const StarRating = ({ rating, t }) => (
  <div
    className="flex items-center gap-1"
    role="img"
    aria-label={`${rating} ${t("rating")}`}
  >
    {Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? "text-amber-500" : "text-gray-200"}
        aria-hidden="true"
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewCard = ({ review, language, t }) => (
  <article className="group h-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl hover:shadow-black/[0.04]">
    <div className="relative overflow-hidden bg-gray-100">
      <img
        src={review.image}
        alt={review.name}
        loading="lazy"
        className="aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute start-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-800 backdrop-blur-md">
        {t("verified")}
      </div>
    </div>

    <div className="flex flex-col p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <StarRating rating={review.rating} t={t} />
        <span className="text-xs font-medium text-gray-400">
          {review.rating}.0 / 5
        </span>
      </div>

      <blockquote className="flex-1 text-sm leading-7 text-gray-600 sm:text-[15px]">
        “{review.review[language] || review.review.en}”
      </blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700"
          aria-hidden="true"
        >
          {review.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-950">
            {review.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{review.product}</p>
        </div>

        <span
          className="ms-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </div>
  </article>
);

const Testimonials = () => {
  const { language } = useLanguage();
  const t = useCallback(
    (key) => translations[language]?.[key] || translations.en[key] || key,
    [language]
  );

  const isRTL = language === "ur" || language === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalReviews = reviews.length;

  const previousReview = useCallback(() => {
    setActiveIndex((current) => (current - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  const nextReview = useCallback(() => {
    setActiveIndex((current) => (current + 1) % totalReviews);
  }, [totalReviews]);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(nextReview, AUTO_PLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, nextReview]);

  return (
    <section
      id="testimonials"
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="testimonials-heading"
      className="overflow-hidden bg-[#fafafa] px-4 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600 sm:text-xs">
              {t("badge")}
            </span>
          </div>

          <h2
            id="testimonials-heading"
            className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-4xl lg:text-5xl"
          >
            {t("title")}
            <span className="mt-1 block text-gray-400">{t("subtitle")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            {t("description")}
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:px-7">
            <div className="text-start">
              <p className="text-3xl font-semibold tracking-tight text-gray-950">
                4.60
                <span className="text-sm font-medium text-gray-400">/5</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{t("overall")}</p>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="text-start">
              <StarRating rating={5} t={t} />
              <p className="mt-1 text-xs text-gray-500">{t("based")}</p>
            </div>
          </div>
        </div>

        <div
          className="md:hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex items-stretch transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(${isRTL ? "" : "-"}${activeIndex * 100}%)`,
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.name}
                  className="w-full shrink-0 px-0.5"
                  aria-hidden={activeIndex !== index}
                >
                  <ReviewCard review={review} language={language} t={t} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={isRTL ? nextReview : previousReview}
              aria-label={t("previous")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-900 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
            >
              {isRTL ? "→" : "←"}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {reviews.map((review, index) => (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${t("goTo")} ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${
                    activeIndex === index
                      ? "w-7 bg-gray-950"
                      : "w-2 bg-gray-300 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={isRTL ? previousReview : nextReview}
              aria-label={t("next")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-900 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
            >
              {isRTL ? "←" : "→"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(totalReviews).padStart(2, "0")}
          </p>
        </div>

        <div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3 lg:gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.name}
              review={review}
              language={language}
              t={t}
            />
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-7 text-center sm:mt-16">
          <p className="text-xs leading-6 text-gray-500 sm:text-sm">
            {t("thanks")}
            <span className="ms-1 font-medium text-gray-900">
              {t("inspiration")}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
