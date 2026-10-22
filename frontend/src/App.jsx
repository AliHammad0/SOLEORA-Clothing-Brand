
import React from "react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";

import Footer from "./Pages/Footer";
import Header from "./Pages/Header";
import ShopByCategory from "./Pages/ShopByCategory";
import SpecialPrices from "./Pages/SpecialPrices";
import Testimonials from "./Pages/Testimonials";
import ProductBenefits from "./Pages/ProductBenefits";
import GoToTop from "./Pages/GoToTop";
import TermsAndConditions from "./Pages/TermsAndConditions";
import ReturnsExchangePolicy from "./Pages/ReturnPolicy";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Signup from "./Pages/Signup";
import GetAllProducts from "./Pages/GetAllProducts";
import CreateProduct from "./Pages/CreateProduct";
import GetNewArrivals from "./Pages/GetNewArrivals";
import ProductDetails from "./Pages/ProductDetails";
import CategoryProducts from "./Pages/CategoryProducts";
import MyOrders from "./Pages/MyOrders";

import {
  LanguageProvider,
  useLanguage,
} from "./context/LanguageContext";

import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminCustomers from "./Pages/AdminCustomers";
import AdminSettings from "./Pages/AdminSettings";
import AboutUs from "./Pages/AboutUs";
import Profile from "./Pages/Profile";
import ProductSearch from "./Pages/ProductSearch";
import AdminUsers from "./Pages/AdminUsers";
import ShippingAndDelivery from "./Pages/ShippingAndDelivery";
import FAQ from "./Pages/FAQ";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Career from "./Pages/Career";
import UpdateProduct from "./Pages/UpdateProduct";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />

    {/* Go To Top */}
    <div className="fixed bottom-24 right-5 z-40 sm:bottom-28 sm:right-8">
      <GoToTop />
    </div>

    {/* Floating WhatsApp Button */}
    <a
      href="https://wa.me/923114237376"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SOLEORA on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition duration-300 hover:scale-110 hover:bg-[#20ba5a] sm:bottom-6 sm:right-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path d="M12.04 2a9.86 9.86 0 0 0-8.48 14.9L2.2 22l5.23-1.37A9.94 9.94 0 0 0 12.04 21a9.99 9.99 0 0 0 0-19Zm0 17.2c-1.45 0-2.87-.39-4.11-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 1 1 6.88 3.83Zm4.47-6.1c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.13-.17.25-.65.81-.8.98-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-.1-.74-.68-1.24-1.52-1.38-1.77-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.87-.21-.49-.42-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.52.61.19 1.16.16 1.6.1.49-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.3Z" />
      </svg>
    </a>
  </>
);

const AdminRoute = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user.isAdmin === true || user.isAdmin === "true";

  if (!isAdmin) {
    return (
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-[#faf9f6] px-5 py-16 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber-100/60" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-amber-300" />

        <div className="relative z-10 flex h-32 w-32 animate-bounce items-center justify-center rounded-full border border-amber-200 bg-white text-7xl shadow-xl">
          🕵️‍♂️
        </div>

        <p className="relative z-10 mt-8 text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
          SOLEORA SECRET HEADQUARTERS
        </p>

        <h1 className="relative z-10 mt-4 text-3xl font-black tracking-tight text-black sm:text-5xl">
          WHO LET YOU IN?! 😂
        </h1>

        <h2 className="relative z-10 mt-4 text-xl font-bold text-gray-800 sm:text-2xl">
          Nice Try, Fashion Criminal! 🚨
        </h2>

        <div className="relative z-10 mt-6 max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-base leading-8 text-gray-600 sm:text-lg">
            Hold up, superstar! 😎
            <br />
            <br />
            You tried to sneak into the Admin Dashboard like you own the place!
            <br />
            <br />
            <span className="font-bold text-black">
              Your confidence: 100% 💪
            </span>
            <br />
            <span className="font-bold text-red-600">
              Your admin privileges: Absolutely ZERO! 💀
            </span>
            <br />
            <br />
            Nice attempt, detective! 🕵️
            <br />
            Go shop some fresh fits instead of hacking the fashion empire! 👕
          </p>
        </div>

        <p className="relative z-10 mt-6 text-sm font-medium text-gray-500">
          🔒 Admin access only. Your shopping privileges remain intact. 😂
        </p>

        <Link
          to="/"
          className="relative z-10 mt-8 inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-amber-600 hover:shadow-xl"
        >
          <span>逃🏃 BACK TO SHOPPING</span>
          <span aria-hidden="true">→</span>
        </Link>

        <p className="relative z-10 mt-5 text-xs text-gray-400">
          SOLEORA Security Department · Protecting Fashion Since Forever 😂
        </p>

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return <Outlet />;
};

const Home = () => (
  <>
    <GetAllProducts />
    <GetNewArrivals />
    <ShopByCategory />
    <SpecialPrices />
    <Testimonials />
    <ProductBenefits />
  </>
);

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-black">404</h1>

      <p className="mt-3 text-gray-600">
        {t("notFound")}
      </p>

      <Link
        to="/"
        className="mt-6 rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800"
      >
        {t("backHome")}
      </Link>
    </div>
  );
};

const App = () => (
  <LanguageProvider>
    <Routes>
      <Route element={<Layout />}>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<GetNewArrivals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="/careers" element={<Career />} />


        <Route
          path="/shipping-and-delivery"
          element={<ShippingAndDelivery />}
        />

        {/* Category Pages */}
        <Route
          path="/men"
          element={<CategoryProducts category="Men" />}
        />

        <Route
          path="/women"
          element={<CategoryProducts category="Women" />}
        />

        <Route
          path="/kids"
          element={<CategoryProducts category="Kids" />}
        />

        <Route
          path="/ReturnsExchangePolicy"
          element={<ReturnsExchangePolicy />}
        />

        {/* Protected Admin Pages */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/products/edit/:id"
            element={<UpdateProduct />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/customers"
            element={<AdminCustomers />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          <Route
            path="/create"
            element={<CreateProduct />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
);

export default App;
