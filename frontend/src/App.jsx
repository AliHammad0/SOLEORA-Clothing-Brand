
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
import CategoryProducts from "./Pages/CategoryProducts";

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

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <GoToTop />
    <AdminUsers/>
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
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<ProductSearch />} />
          <Route path="/users" element={<AdminUsers />} />

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
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/users"
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
