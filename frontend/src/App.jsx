
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
import NewArrivals from "./Pages/NewArrival";
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

import { LanguageProvider, useLanguage } from "./context/LanguageContext";

import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminCustomers from "./Pages/AdminCustomers";
import AdminSettings from "./Pages/AdminSettings";
import AboutUs from "./Pages/AboutUs";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <GoToTop />
  </>
);

// Admin Access Protection
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Access Denied
        </h1>

        <p className="mt-4 text-gray-600">
          You can't access dashboard because you are not an admin.
        </p>

        <Link
          to="/"
          className="mt-6 bg-black px-6 py-3 text-white transition hover:bg-gray-800"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return <Outlet />;
};

const Home = () => (
  <>
    <GetAllProducts />
    <GetNewArrivals />
    {/* <NewArrivals /> */}
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
        {/* Public Pages */}
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
        <Route path="/about" element={<AboutUs/>} />

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
          <Route path="/create" element={<CreateProduct />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
);

export default App;
