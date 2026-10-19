import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <section className="bg-black py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
          ABOUT SOLEORA
        </h1>
        <p className="mt-4 text-gray-300 text-lg">
          Style that speaks. Quality that lasts.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-8">
              SOLEORA is a modern clothing brand created for people
              who value style, comfort, and quality. We believe fashion
              should help you express your personality with confidence.
            </p>
            <p className="text-gray-600 leading-8 mt-4">
              Our collection brings together contemporary designs,
              versatile essentials, and timeless styles for everyday
              wear and special occasions.
            </p>
          </div>

          <div className="bg-gray-100 p-10 md:p-14 text-center">
            <h3 className="text-2xl font-bold tracking-widest">
              SOLEORA
            </h3>
            <p className="mt-4 text-gray-500">
              Discover your style.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
          <div className="border border-gray-200 p-8">
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-7">
              To make modern fashion accessible through stylish and
              comfortable clothing.
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-7">
              To build a trusted clothing brand that inspires
              confidence and individuality.
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-xl font-bold mb-3">Our Values</h3>
            <p className="text-gray-600 leading-7">
              Quality, comfort, customer satisfaction, and timeless
              style guide everything we do.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;