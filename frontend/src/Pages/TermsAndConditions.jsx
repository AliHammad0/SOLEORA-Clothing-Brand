import React, { useEffect, useRef, useState } from "react";

const TermsAndConditions = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisibleSections((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.12 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleTilt = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-4px)`;
  };

  const resetTilt = (event) => {
    event.currentTarget.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  const sections = [
    {
      number: "01",
      title: "Information About the Website and the Goods",
      content: (
        <>
          <p>
            This section explains the terms relating to the information
            available on our website, descriptions of goods, and your use
            of the website.
          </p>
          <p>
            Separate notices and disclaimers may apply to your use of the
            website. By placing an order with us, you acknowledge these
            Terms and Conditions and agree to the applicable notices and
            disclaimers, subject to applicable law.
          </p>
          <p>
            We aim to ensure that all information on our website,
            including product descriptions and prices, is accurate and
            up to date. However, errors may occasionally occur. We will
            make reasonable efforts to correct errors as soon as possible
            and, where appropriate, notify you if an error may have
            affected your purchase.
          </p>
          <p>
            We provide this website, including its information, tools,
            products, and services, subject to these Terms and Conditions
            and the policies and notices applicable to your use of the
            website.
          </p>
          <p>
            If you experience difficulty placing an order or need
            assistance with an existing order, please contact us using
            the details below.
          </p>

          <div className="group relative mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-neutral-200/60 blur-2xl transition duration-700 group-hover:scale-150" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg text-white">
                  ↗
                </span>
                <div>
                  <h3 className="font-semibold text-black">
                    Contact Information
                  </h3>
                  <p className="text-xs text-neutral-500">
                    We're here to help
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="tel:+923332279263"
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-black"
                >
                  <span className="text-xl">☎</span>
                  <div>
                    <p className="text-xs text-neutral-500">Call us</p>
                    <p className="text-sm font-medium text-black">
                      +92 333 2279263
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:ask@wearzane.com"
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-black"
                >
                  <span className="text-xl">✉</span>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">Email us</p>
                    <p className="break-all text-sm font-medium text-black">
                      ask@wearzane.com
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <p>
            These Terms and Conditions are intended to be governed by the
            laws of the Islamic Republic of Pakistan. Disputes shall be
            handled by the courts having jurisdiction under applicable
            Pakistani law.
          </p>

          <p>
            Shopping for clothing and accessories online differs from
            shopping in a physical store. By using our website, you should
            be aware of the following:
          </p>

          <ul className="space-y-3">
            {[
              "Product colours may vary depending on your screen, device, and display settings.",
              "All sizes and measurements are approximate. Please consult the relevant size information before placing an order.",
              "All products are subject to availability. We may be unable to fulfil an order for an unavailable item.",
              "Delivery dates and timeframes provided on the website or by email are estimates, unless expressly stated otherwise.",
              "Products and promotions available online may differ from those offered in physical stores, where applicable.",
              "You are responsible for keeping your account credentials, password, and other account information confidential and secure.",
            ].map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      number: "02",
      title: "Purchasing Goods Online",
      content: (
        <>
          <p>
            This section explains the terms that apply when you purchase
            products from us through our website.
          </p>
          <p>
            You submit an offer to purchase a product by completing the
            checkout process on our website. This process generally
            includes the following steps:
          </p>

          <ol className="grid gap-3 sm:grid-cols-2">
            {[
              "Adding products to your shopping basket.",
              "Entering your personal details.",
              "Providing your delivery address.",
              "Reviewing and confirming your order.",
            ].map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition duration-300 hover:border-black hover:bg-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-semibold text-white">
                  0{index + 1}
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ol>

          <p>
            Your order represents an offer to purchase goods from us. A
            binding contract is formed only when your order has been
            accepted in accordance with these Terms and Conditions and
            applicable law. If you order multiple products, each product
            may be treated as a separate offer.
          </p>
          <p>
            After receiving your order, we will send an order
            acknowledgement to the email address you provide. This
            acknowledgement will normally include your order number, the
            products ordered, and an estimated delivery timeframe.
          </p>
          <p>
            The acknowledgement email confirms that we have received your
            order. It does not, by itself, mean that we have accepted
            your offer to purchase the goods.
          </p>
          <p>
            Under the original ordering terms supplied for this page,
            acceptance occurs when we dispatch the relevant product and
            send you a dispatch email containing details of the product.
          </p>
          <p>
            We reserve the right to refuse an order where permitted by
            applicable law. Any cancellation, refund, or other action
            relating to an order will be handled in accordance with our
            applicable policies and legal obligations.
          </p>
        </>
      ),
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-800">
      <style>{`
        @keyframes termsFadeUp {
          from { opacity: 0; transform: translateY(35px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes termsFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(5deg); }
        }

        @keyframes termsShine {
          from { transform: translateX(-150%) skewX(-18deg); }
          to { transform: translateX(250%) skewX(-18deg); }
        }

        .terms-hero {
          animation: termsFadeUp .85s cubic-bezier(.2,.7,.2,1) both;
        }

        .terms-reveal {
          opacity: 0;
          transform: translateY(35px);
          transition: opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1);
        }

        .terms-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-float {
          animation: termsFloat 7s ease-in-out infinite;
        }

        .terms-shine {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .terms-shine::after {
          content: "";
          position: absolute;
          inset: 0 auto 0 -30%;
          width: 25%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
          transform: translateX(-150%) skewX(-18deg);
          pointer-events: none;
        }

        .terms-shine:hover::after {
          animation: termsShine .9s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .terms-hero, .terms-float {
            animation: none !important;
          }
          .terms-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
          *, *::before, *::after {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="terms-float absolute -right-32 top-20 h-80 w-80 rounded-full border border-neutral-200/70" />
        <div className="terms-float absolute -right-20 top-32 h-56 w-56 rounded-full border border-neutral-200/70 [animation-delay:-2s]" />
        <div className="absolute left-0 top-0 h-[600px] w-1/2 bg-gradient-to-br from-neutral-100/70 via-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12">
        {/* Hero */}
        <header className="terms-hero relative border-b border-neutral-200 pb-10 sm:pb-14">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-black" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
                Wearzane / Legal
              </p>
            </div>
            <span className="hidden text-xs tracking-widest text-neutral-400 sm:block">
              YOUR RIGHTS. OUR RESPONSIBILITY.
            </span>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Legal Information
              </p>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-black sm:text-6xl lg:text-8xl">
                Terms &amp;
                <span className="block text-neutral-400">Conditions.</span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
                Please read these terms carefully before placing an order
                or using our website. They explain the rules and conditions
                that apply when shopping with Wearzane.
              </p>
            </div>

            <div className="terms-float hidden lg:block">
              <div className="terms-shine relative rotate-3 rounded-2xl bg-black p-7 text-white shadow-2xl shadow-neutral-300/60 transition duration-500 hover:rotate-0">
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    Wearzane
                  </span>
                  <span className="text-xl">✳</span>
                </div>
                <p className="text-4xl font-light tracking-tight">
                  Shop with
                  <br />
                  <span className="font-semibold">confidence.</span>
                </p>
                <div className="mt-10 flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-xs text-white/60">LEGAL GUIDE</span>
                  <span className="text-sm">2026 ↗</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#terms-01"
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-medium transition duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              01 — Website & Goods
            </a>
            <a
              href="#terms-02"
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-medium transition duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              02 — Online Orders
            </a>
            <a
              href="#terms-contact"
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-medium transition duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              Customer Support ↗
            </a>
          </div>
        </header>

        {/* Legal sections */}
        <div className="mt-10 space-y-7 sm:mt-14 sm:space-y-10">
          {sections.map((section, index) => (
            <section
              id={`terms-${section.number}`}
              key={section.number}
              data-index={index}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className={`terms-reveal ${
                visibleSections.includes(index) ? "is-visible" : ""
              } rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.025)] transition-[border-color,box-shadow] duration-500 hover:border-neutral-300 hover:shadow-[0_25px_70px_rgba(0,0,0,0.07)] sm:rounded-3xl sm:p-8 lg:p-12`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:gap-12">
                <div className="lg:sticky lg:top-10 lg:self-start">
                  <p className="text-6xl font-light tracking-[-0.07em] text-neutral-200 sm:text-7xl">
                    {section.number}
                  </p>
                  <div className="mt-4 h-1 w-12 rounded-full bg-black" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    Terms of Service
                  </p>
                </div>

                <div className="min-w-0">
                  <h2 className="mb-7 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-black sm:text-3xl lg:text-4xl">
                    {section.title}
                  </h2>

                  <div className="space-y-5 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8 [&_ol]:my-6 [&_ul]:my-6">
                    {section.content}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Support CTA */}
        <section
          id="terms-contact"
          className="terms-shine relative mt-10 overflow-hidden rounded-2xl bg-black p-6 text-white shadow-2xl shadow-neutral-300/40 sm:mt-14 sm:rounded-3xl sm:p-10 lg:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                We're here for you
              </p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Questions?
                <span className="block text-neutral-400">
                  Let's talk.
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                If you have questions about these Terms and Conditions or
                need assistance with an order, our customer support team
                can help.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:ask@wearzane.com"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-neutral-200"
              >
                Email Us <span>↗</span>
              </a>
              <a
                href="tel:+923332279263"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Call Support <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Wearzane. All rights reserved.
          </p>
          <p className="max-w-xl text-xs leading-6 text-neutral-400 sm:text-right">
            Please review these Terms alongside your shipping, return,
            exchange, privacy, and payment policies.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default TermsAndConditions;