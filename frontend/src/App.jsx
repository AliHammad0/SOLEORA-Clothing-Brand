import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";

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

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <GoToTop />
  </>
);

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
        <Route path="/" element={<Home />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<GetNewArrivals />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/ReturnsExchangePolicy"
          element={<ReturnsExchangePolicy />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </LanguageProvider>
);

export default App;