import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductsProvider } from "./context/ProductsContext";

import Header from "./components/Header";
import Home from "./components/Home";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ProductPage from './components/ProductPage';
import Footer from "./components/Footer";
import OrderSuccess from "./components/OrderSuccess";
import Catalog from './components/Catalog';
import CategoryPage from "./components/CategoryPage";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';




export default function App() {
  const { t } = useTranslation();

  return (
    <ProductsProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <Header />
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:categorySlug" element={<CategoryPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ProductsProvider>
  );
}
