
import React, { useEffect, useRef, useState } from "react";

const ReturnsExchangePolicy = () => {
  const [visible, setVisible] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setVisible((prev) =>
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

  const sections = [
    {
      number: "01",
      title: "Our Return Policy",
      intro:
        "At Wearzane, we want you to feel confident about every purchase. If something is not right, please review the following return guidelines.",
      items: [
        "Items must be unused, unworn, unwashed, and in their original condition.",
        "All original tags, packaging, and accessories must be included.",
        "Items showing signs of wear, damage, washing, or alteration may not qualify for a return.",
        "Proof of purchase or your order number may be required.",
      ],
    },
    {
      number: "02",
      title: "Exchange Policy",
      intro:
        "Need a different size or product? Contact our support team to request an exchange, subject to product availability.",
      items: [
        "Exchange requests are subject to stock availability.",
        "The item must meet the same condition requirements as a return.",
        "Please confirm your preferred size or replacement item before sending your parcel.",
        "If the requested replacement is unavailable, our support team will discuss the available options.",
      ],
    },
    {
      number: "03",
      title: "Request Timeframe",
      intro:
        "Please contact us as soon as possible after receiving your order if you need a return or exchange.",
      items: [
        "Contact customer support with your order number and reason for the request.",
        "Include clear photographs if the product is damaged, defective, or incorrect.",
        "Wait for confirmation and return instructions before sending the parcel.",
        "Any applicable request deadline will be confirmed by our support team.",
      ],
    },
    {
      number: "04",
      title: "Damaged or Incorrect Items",
      intro:
        "If your order arrives damaged or you receive an incorrect item, please let us know so we can review the issue.",
      items: [
        "Keep the item and its original packaging.",
        "Take clear photographs of the product and any visible damage.",
        "Share your order number and details with customer support.",
        "We will review the information and advise you on the next steps.",
      ],
    },
    {
      number: "05",
      title: "Refunds & Processing",
      intro:
        "Refund eligibility and processing depend on the circumstances of the return and the payment method used.",
      items: [
        "Refunds must be approved in accordance with the applicable policy.",
        "Approved refunds will be processed using an appropriate method.",
        "Processing and payment-provider timelines may vary.",
        "Any applicable delivery or return charges will be explained by customer support.",
      ],
    },
  ];

  const tiltCard = (event) => {
    if (window.matchMedia("(hover: none)").matches) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg) translateY(-3px)`;
  };

  const resetCard = (event) => {
    event.currentTarget.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-800">
      <style>{`
        @keyframes returnIntro {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes returnFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(4deg); }
        }

        .return-intro {
          animation: returnIntro .8s ease both;
        }

        .return-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s ease, transform .7s ease,
            border-color .3s ease, box-shadow .3s ease;
        }

        .return-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .return-float {
          animation: returnFloat 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .return-intro, .return-float {
            animation: none !important;
          }
          .return-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="return-float absolute -right-24 top-20 h-72 w-72 rounded-full border border-neutral-200" />
        <div className="return-float absolute -right-10 top-36 h-44 w-44 rounded-full border border-neutral-200 [animation-delay:-3s]" />
        <div className="absolute left-0 top-0 h-[500px] w-2/3 bg-gradient-to-br from-neutral-100/70 via-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12">
        {/* Hero */}
        <header className="return-intro border-b border-neutral-200 pb-10 sm:pb-14">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-black" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
                Wearzane / Customer Care
              </p>
            </div>

            <span className="hidden text-xs tracking-widest text-neutral-400 sm:block">
              YOUR SATISFACTION MATTERS
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_290px]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Simple. Clear. Customer First.
              </p>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-black sm:text-6xl lg:text-8xl">
                Returns
                <span className="block text-neutral-400">
                  & Exchanges.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
                Shopping should feel right. Explore our return and
                exchange guidelines and find out how to get help
                with your Wearzane order.
              </p>

              <a
                href="#return-policy"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-neutral-800"
              >
                Explore the Policy <span>↓</span>
              </a>
            </div>

            <div className="return-float hidden lg:block">
              <div className="rounded-2xl bg-black p-7 text-white shadow-2xl shadow-neutral-300/70 transition duration-500 hover:rotate-0">
                <div className="mb-12 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-white/60">
                    Wearzane
                  </span>
                  <span className="text-2xl">↺</span>
                </div>

                <p className="text-3xl font-light leading-tight">
                  A better
                  <br />
                  <span className="font-semibold">shopping experience.</span>
                </p>

                <div className="mt-10 border-t border-white/20 pt-4 text-xs text-white/60">
                  CUSTOMER CARE / 01
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Policy quick links */}
        <div className="mt-8 flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.number}
              href={`#return-${section.number}`}
              className="rounded-full border border-neutral-200 px-4 py-2.5 text-xs font-medium transition hover:border-black hover:bg-black hover:text-white"
            >
              {section.number} / {section.title}
            </a>
          ))}
        </div>

        {/* Policy cards */}
        <div id="return-policy" className="mt-10 space-y-5 sm:mt-14 sm:space-y-7">
          {sections.map((section, index) => (
            <section
              id={`return-${section.number}`}
              key={section.number}
              data-index={index}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
              onMouseMove={tiltCard}
              onMouseLeave={resetCard}
              className={`return-reveal ${
                visible.includes(index) ? "is-visible" : ""
              } rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.025)] hover:border-neutral-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:rounded-3xl sm:p-8 lg:p-10`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="grid gap-6 sm:grid-cols-[100px_1fr] sm:gap-10">
                <div>
                  <p className="text-5xl font-light tracking-[-0.07em] text-neutral-200 sm:text-6xl">
                    {section.number}
                  </p>
                  <div className="mt-4 h-1 w-10 rounded-full bg-black" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                    {section.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                    {section.intro}
                  </p>

                  <ul className="mt-6 space-y-4">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-neutral-600 sm:text-base">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs text-black">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact banner */}
        <section className="relative mt-10 overflow-hidden rounded-2xl bg-black p-6 text-white sm:mt-14 sm:rounded-3xl sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 top-0 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Need assistance?
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                We're here
                <span className="block text-neutral-400">to help.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                Contact our team with your order number and details
                about your return or exchange request.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:ask@wearzane.com"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-1 hover:bg-neutral-200"
              >
                Email Support ↗
              </a>

              <a
                href="tel:+923332279263"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Call Us ↗
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-xs leading-6 text-neutral-400">
            © {new Date().getFullYear()} Wearzane. All rights reserved.
            Return and exchange requests are subject to applicable
            policies and consumer protection laws.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default ReturnsExchangePolicy;
