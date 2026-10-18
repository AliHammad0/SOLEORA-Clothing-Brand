import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <section className="bg-black py-16 px-6 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-gray-300">
          Please read these terms before using SOLEORA.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-600 leading-7 mb-8">
          These terms govern your use of the SOLEORA website and
          online shopping services. By using our website, you agree
          to these terms.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-3">
              1. Website Usage
            </h2>
            <p className="text-gray-600 leading-7">
              You agree to use this website lawfully and provide
              accurate information when placing an order or creating
              an account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              2. Products and Availability
            </h2>
            <p className="text-gray-600 leading-7">
              We aim to display accurate product descriptions,
              images, prices, sizes, and colors. Product availability
              may change, and actual colors may vary slightly due to
              screen settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              3. Pricing and Orders
            </h2>
            <p className="text-gray-600 leading-7">
              Prices are displayed on the website in the selected
              currency. Orders are subject to product availability
              and confirmation. If a pricing or stock error occurs,
              we may contact you before processing the order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              4. Payments
            </h2>
            <p className="text-gray-600 leading-7">
              Customers must use the payment methods offered at
              checkout. Any applicable payment or delivery charges
              should be reviewed before confirming an order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              5. Shipping and Delivery
            </h2>
            <p className="text-gray-600 leading-7">
              Delivery times are estimates and may vary depending
              on location, courier services, weather, or other
              circumstances beyond our control.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              6. Returns and Exchanges
            </h2>
            <p className="text-gray-600 leading-7">
              Returns and exchanges are subject to our Returns
              Policy. Please review that policy before placing
              your order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              7. Accounts and Security
            </h2>
            <p className="text-gray-600 leading-7">
              You are responsible for keeping your account
              credentials secure and for activities carried out
              through your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              8. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-7">
              Website content, branding, logos, text, and designs
              may not be copied or used commercially without
              appropriate permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              9. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-7">
              We may update these terms when necessary. Updated
              terms will be published on this page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              10. Contact Us
            </h2>
            <p className="text-gray-600 leading-7">
              For questions about these terms, please contact
              SOLEORA through the contact details provided on
              our website.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;