
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Heart, TrendingUp, Users } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description:
      "Work with people who value teamwork, creativity, and fresh ideas.",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description:
      "Build your skills, learn new things, and grow with the brand.",
  },
  {
    icon: Heart,
    title: "Passion for Fashion",
    description:
      "Be part of a brand focused on style, quality, and customer experience.",
  },
];

const opportunities = [
  {
    title: "Customer Support",
    type: "Customer Experience",
    description:
      "Help customers with product questions, order updates, and general inquiries.",
  },
  {
    title: "Social Media & Content",
    type: "Marketing",
    description:
      "Help create engaging content and support SOLEORA's social media presence.",
  },
  {
    title: "E-commerce Operations",
    type: "Operations",
    description:
      "Support product listings, order coordination, and online store operations.",
  },
];

const Career = () => {
  const applicationSubject = encodeURIComponent(
    "Career Application - SOLEORA"
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-black px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-300">
            CAREERS AT SOLEORA
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Build your future with a brand that moves with style.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            We believe in creativity, fresh ideas, and great customer
            experiences. If you are passionate about fashion and
            e-commerce, we would love to hear from you.
          </p>

          <a
            href={`mailto:?subject=${applicationSubject}`}
            className="mt-8 inline-flex items-center gap-2 bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            <BriefcaseBusiness size={18} />
            Explore Opportunities
          </a>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              WHY SOLEORA
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Grow with us
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              We want people who care about their work, welcome new
              challenges, and want to make online shopping better.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="border border-gray-200 p-7 transition hover:border-black"
                >
                  <Icon size={27} strokeWidth={1.5} />

                  <h3 className="mt-5 text-lg font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            CAREER AREAS
          </p>

          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Explore where you fit
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            These are areas where we may welcome talent as our business
            grows. They are examples of potential opportunities, not
            confirmation of current vacancies.
          </p>

          <div className="mt-9 space-y-4">
            {opportunities.map((job) => (
              <article
                key={job.title}
                className="flex flex-col justify-between gap-5 border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {job.type}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {job.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                    {job.description}
                  </p>
                </div>

                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `Career Interest - ${job.title} - SOLEORA`
                  )}`}
                  className="inline-flex shrink-0 items-center justify-center border border-black px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  Express Interest
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold">
            Don't see your role?
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            We are always interested in hearing from people with useful
            skills and a passion for what they do. Send us your CV and
            tell us how you could contribute to SOLEORA.
          </p>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              "General Career Application - SOLEORA"
            )}`}
            className="mt-7 inline-block bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Send Your CV
          </a>

          <p className="mt-4 text-xs text-gray-500">
            Please use SOLEORA's official contact email when applying.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block text-sm text-gray-600 underline hover:text-black"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Career;
