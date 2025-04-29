import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Home from "./components/Home";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";

export default function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <nav className="bg-white shadow-md p-4 flex gap-4 justify-center">
          <Link to="/" className="text-blue-600 font-semibold hover:underline">{t("nav.home")}</Link>
          <Link to="/cart" className="text-blue-600 font-semibold hover:underline">{t("nav.cart")}</Link>
          <Link to="/admin" className="text-blue-600 font-semibold hover:underline">Админка</Link>
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Вход</Link>
        </nav>

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
