
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Orders & Payments",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our collection, select your preferred product, choose the available size and color, add it to your cart, and proceed to checkout. Enter your delivery details and confirm your order.",
      },
      {
        question: "Do I need an account to place an order?",
        answer:
          "No. You can place an order as a guest without creating an account. However, logging in allows you to view orders linked to your account through the My Orders page.",
      },
      {
        question: "Which payment methods are available?",
        answer:
          "Cash on Delivery (COD) is currently available. You can pay the order amount when your parcel arrives.",
      },
      {
        question: "How do I know my order was confirmed?",
        answer:
          "After successfully placing your order, the website displays an order confirmation. Keep your order number for future reference.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "Where does SOLEORA deliver?",
        answer:
          "We accept orders for eligible delivery addresses in Pakistan. Availability may vary depending on your location.",
      },
      {
        question: "How much is the shipping fee?",
        answer:
          "Orders of Rs. 5,000 or more qualify for free shipping. Orders below Rs. 5,000 have a shipping fee of Rs. 250.",
      },
      {
        question: "How long will delivery take?",
        answer:
          "Delivery time depends on your location and courier service. If you need an estimate for your order, please contact our support team.",
      },
      {
        question: "How can I check my order status?",
        answer:
          "Log in to the account used when placing your order and visit My Orders. Guest orders may not appear in your account.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        question: "How do I choose the right size?",
        answer:
          "Check the sizes available on the product page before adding an item to your cart. If you are unsure, contact our support team before ordering.",
      },
      {
        question: "Are all products available in every size and color?",
        answer:
          "No. Available sizes, colors, and quantities vary by product. The options shown on each product page indicate the available selections.",
      },
      {
        question: "How do I care for my clothing?",
        answer:
          "Follow the care instructions on the garment label. When in doubt, use a gentle wash cycle and avoid high heat unless the label says otherwise.",
      },
    ],
  },
  {
    category: "Returns & Support",
    questions: [
      {
        question: "Can I return or exchange a product?",
        answer:
          "Please review our Returns & Exchanges policy for eligibility, conditions, and instructions before requesting a return or exchange.",
      },
      {
        question: "What should I do if I receive a damaged or incorrect item?",
        answer:
          "Contact our support team as soon as possible with your order number and a description of the issue. Photos of the item may help us review your request.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Contact our support team as soon as possible. Changes or cancellations may not be possible once an order has been processed or dispatched.",
      },
    ],
  },
];

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredFaqs = faqs
    .map((group) => ({
      ...group,
      questions: group.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(normalizedSearch) ||
          item.answer.toLowerCase().includes(normalizedSearch) ||
          group.category.toLowerCase().includes(normalizedSearch)
      ),
    }))
    .filter((group) => group.questions.length > 0);

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-black sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            SOLEORA CUSTOMER CARE
          </p>

          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Find answers about orders, payments, delivery, products,
            returns, and more.
          </p>
        </div>

        <div className="mx-auto mt-9 max-w-2xl">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your question..."
            aria-label="Search frequently asked questions"
            className="w-full border border-gray-300 px-5 py-4 text-sm outline-none transition focus:border-black"
          />
        </div>

        <div className="mt-12 space-y-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((group) => (
              <section key={group.category}>
                <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                  {group.category}
                </h2>

                <div className="divide-y divide-gray-200 border-y border-gray-200">
                  {group.questions.map((item) => {
                    const key = `${group.category}-${item.question}`;
                    const isOpen = openQuestion === key;

                    return (
                      <div key={key}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQuestion(isOpen ? null : key)
                          }
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 py-5 text-left"
                        >
                          <span className="text-sm font-medium sm:text-base">
                            {item.question}
                          </span>

                          <ChevronDown
                            size={20}
                            className={`shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <p className="max-w-3xl pb-5 pr-6 text-sm leading-7 text-gray-600">
                            {item.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="py-12 text-center">
              <h2 className="text-lg font-semibold">
                No matching questions
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Try another search term.
              </p>
            </div>
          )}
        </div>

        <section className="mt-14 bg-gray-50 px-5 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-semibold">
            Still need help?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
            We are here to help with your SOLEORA shopping experience.
            Check your order details or review our delivery and returns
            information.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/my-orders"
              className="bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              My Orders
            </Link>

            <Link
              to="/shipping-and-delivery"
              className="border border-black px-6 py-3 text-sm font-medium hover:bg-white"
            >
              Shipping & Delivery
            </Link>

            <Link
              to="/returns"
              className="border border-black px-6 py-3 text-sm font-medium hover:bg-white"
            >
              Returns Policy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FAQ;
