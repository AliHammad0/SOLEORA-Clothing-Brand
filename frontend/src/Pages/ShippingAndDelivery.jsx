
import React from "react";
import { Link } from "react-router-dom";

const ShippingAndDelivery = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-black sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">
          Shipping & Delivery
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Everything you need to know about receiving your SOLEORA order.
        </p>

        <div className="mt-10 space-y-8 leading-7 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-black">
              1. Order Processing
            </h2>
            <p className="mt-3">
              Once your order is placed, our team will review the details
              and prepare your items for dispatch. We may contact you to
              confirm your delivery information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              2. Delivery Areas
            </h2>
            <p className="mt-3">
              SOLEORA accepts orders with valid delivery addresses in
              Pakistan. Delivery availability may vary by location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              3. Delivery Time
            </h2>
            <p className="mt-3">
              Delivery times depend on your location, courier service,
              weather conditions, and other factors. Our team can provide
              an estimated delivery time when your order is confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              4. Shipping Charges
            </h2>
            <p className="mt-3">
              Orders of Rs. 5,000 or more qualify for free shipping.
              Orders below Rs. 5,000 have a shipping charge of Rs. 250.
              Any applicable charges are displayed at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              5. Cash on Delivery
            </h2>
            <p className="mt-3">
              Cash on Delivery (COD) is available for eligible orders.
              Please ensure that your phone number and delivery address
              are correct and that someone is available to receive and
              pay for the parcel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              6. Track Your Order
            </h2>
            <p className="mt-3">
              Registered customers can check their order status through
              the My Orders page. For assistance, contact our support
              team with your order number.
            </p>

            <Link
              to="/my-orders"
              className="mt-4 inline-block border border-black px-5 py-3 text-sm font-medium hover:bg-black hover:text-white"
            >
              View My Orders
            </Link>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              7. Delays & Delivery Issues
            </h2>
            <p className="mt-3">
              Delivery may occasionally be delayed due to courier
              disruptions, incorrect address details, or circumstances
              beyond our control. Please contact our support team if
              your parcel has not arrived within the estimated timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">
              8. Incorrect Delivery Information
            </h2>
            <p className="mt-3">
              Please review your delivery details carefully before
              placing an order. If you need to correct an address or
              phone number, contact us as soon as possible. Changes
              cannot be guaranteed once an order has been dispatched.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <p>
            Need help with your delivery? Please contact SOLEORA customer
            support and include your order number.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block font-medium text-black underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ShippingAndDelivery;
