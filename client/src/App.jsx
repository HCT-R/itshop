import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Home from "./components/Home";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";

export default function App() {
  const { t } = useTranslation();
  
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <nav className="bg-white shadow-md p-4 flex gap-4">
          <Link className="text-blue-600 font-semibold hover:underline" to="/">Главная</Link>
          <Link className="text-blue-600 font-semibold hover:underline" to="/cart">Корзина</Link>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
