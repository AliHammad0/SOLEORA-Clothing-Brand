
import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, Heart, Sparkles } from "lucide-react";

const AboutUs = () => {
  return (
    <main className="bg-white text-black">
      {/* Hero */}
      <section className="grid min-h-[620px] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            Get to know SOLEORA
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Style that feels like you.
          </h1>

          <p className="mt-7 max-w-md text-base leading-7 text-gray-600 sm:text-lg">
            We believe what you wear should feel natural, look timeless, and
            give you the confidence to be yourself.
          </p>

          <div className="mt-9">
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Explore the collection
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
            <ArrowDown size={16} />
            <span>Our story, our style</span>
          </div>
        </div>

        <div className="min-h-[420px] overflow-hidden bg-gray-100 md:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
            alt="Fashion collection and personal style"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              The SOLEORA story
            </p>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              More than clothes.
              <br />
              A way to express you.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-600">
            <p>
              SOLEORA is about making everyday style feel effortless. We bring
              together clothing choices for different moods, moments, and
              personal styles.
            </p>

            <p>
              We believe great style is not about following every trend. It is
              about finding pieces that feel right for you and wearing them
              with confidence.
            </p>

            <p>
              Whether you are refreshing your wardrobe or looking for your next
              favourite outfit, SOLEORA is here to make discovering your style
              feel simple.
            </p>
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="relative h-[420px] overflow-hidden sm:h-[520px]">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=85"
          alt="A curated clothing collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em]">
            Our point of view
          </p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Wear what makes you feel confident.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            Your style is personal. Your wardrobe should be too.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              What matters to us
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Our approach to style
            </h2>
            <p className="mt-5 leading-7 text-gray-600">
              The ideas behind the way we present clothing and help you explore
              your personal look.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="border border-gray-200 p-8 sm:p-9">
              <Sparkles size={27} strokeWidth={1.5} />
              <h3 className="mt-7 text-xl font-semibold">
                Everyday style
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Discover clothing that helps you create looks for your own
                everyday moments and occasions.
              </p>
            </article>

            <article className="border border-gray-200 p-8 sm:p-9">
              <Heart size={27} strokeWidth={1.5} />
              <h3 className="mt-7 text-xl font-semibold">
                Your individuality
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Your personality comes first. Explore different pieces and
                make every outfit your own.
              </p>
            </article>

            <article className="border border-gray-200 p-8 sm:p-9 sm:col-span-2 lg:col-span-1">
              <Check size={27} strokeWidth={1.5} />
              <h3 className="mt-7 text-xl font-semibold">
                A simple experience
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                We want discovering your next look to feel clear, convenient,
                and enjoyable from browsing to choosing.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#f5f3ef] px-6 py-20 text-center sm:px-12 sm:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Find your next look
        </p>

        <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Your style story starts here.
        </h2>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-600">
          Explore SOLEORA and find pieces that feel right for you.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-3 bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Shop SOLEORA
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export default AboutUs;

///
