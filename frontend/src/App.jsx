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
import Signup from "./Pages/Signup";
import GetAllProducts from "./Pages/GetAllProducts";
import CreateProduct from "./Pages/CreateProduct";
import GetNewArrivals from "./Pages/GetNewArrivals";
import ProductDetails from "./Pages/ProductDetails";
import Profile from "./Pages/Profile";

import { LanguageProvider, useLanguage } from "./context/LanguageContext";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <GoToTop />
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

  if (user.isAdmin !== true) {
    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-white px-5 py-16 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gray-100" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite] rounded-full border border-gray-300" />

        <div className="relative z-10 flex h-24 w-24 animate-[fadeIn_0.8s_ease-out] items-center justify-center rounded-full border border-gray-200 bg-white shadow-xl">
          <svg
            className="h-12 w-12 animate-[bounce_2s_ease-in-out_infinite] text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14v3" />
          </svg>
        </div>

        <p className="relative z-10 mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
          SOLEORA SECURITY
        </p>

        <h1 className="relative z-10 mt-3 animate-[fadeIn_1s_ease-out] text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Admin Access Required
        </h1>

        <p className="relative z-10 mt-4 max-w-md animate-[fadeIn_1.2s_ease-out] text-sm leading-7 text-gray-500 sm:text-base">
          This area is reserved for authorized administrators.
          Please return to the store to continue shopping.
        </p>

        <Link
          to="/"
          className="relative z-10 mt-8 inline-flex items-center gap-2 bg-black px-8 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
        >
          <span>Back to Store</span>
          <span aria-hidden="true">→</span>
        </Link>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

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

      <p className="mt-3 text-gray-600">{t("notFound")}</p>

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
        <Route path="/" element={<Home />} />

        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<GetNewArrivals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/ReturnsExchangePolicy"
          element={<ReturnsExchangePolicy />}
        />

        <Route element={<AdminRoute />}>
          <Route path="/create" element={<CreateProduct />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
);

export default App;