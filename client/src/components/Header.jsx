import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold"><Link to="/">itshop</Link></h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-blue-600 font-semibold hover:underline">{t('nav.home')}</Link>
            <Link to="/catalog" className="text-blue-600 font-semibold hover:underline">Каталог</Link>
            <Link to="/cart" className="text-blue-600 font-semibold hover:underline">{t('nav.cart')}</Link>
            {localStorage.getItem("token") && (
              <Link to="/profile" className="text-blue-600 font-semibold hover:underline flex items-center gap-1"><FaUser />Профиль</Link>
            )}
            {!localStorage.getItem("token") && (
              <>
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">{t('nav.login')}</Link>
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">{t('nav.register')}</Link>
              </>
            )}
          </nav>

          {/* Language and Logout */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => i18n.changeLanguage("kz")} className={i18n.language === 'kz' ? 'font-bold underline' : ''}>KZ</button>
            <button onClick={() => i18n.changeLanguage("ru")} className={i18n.language === 'ru' ? 'font-bold underline' : ''}>RU</button>
            <button onClick={() => i18n.changeLanguage("en")} className={i18n.language === 'en' ? 'font-bold underline' : ''}>EN</button>
            {localStorage.getItem("token") && (
              <button onClick={handleLogout} className="ml-4 text-red-600 hover:underline">{t('buttons.logout')}</button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-blue-600 font-semibold hover:underline">{t('nav.home')}</Link>
              <Link to="/catalog" className="text-blue-600 font-semibold hover:underline">Каталог</Link>
              <Link to="/cart" className="text-blue-600 font-semibold hover:underline">{t('nav.cart')}</Link>
              {localStorage.getItem("token") && (
                <Link to="/profile" className="text-blue-600 font-semibold hover:underline flex items-center gap-1"><FaUser />Профиль</Link>
              )}
              {!localStorage.getItem("token") && (
                <>
                  <Link to="/login" className="text-blue-600 font-semibold hover:underline">{t('nav.login')}</Link>
                  <Link to="/register" className="text-blue-600 font-semibold hover:underline">{t('nav.register')}</Link>
                </>
              )}
            </nav>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button onClick={() => i18n.changeLanguage("kz")} className={i18n.language === 'kz' ? 'font-bold underline' : ''}>KZ</button>
              <button onClick={() => i18n.changeLanguage("ru")} className={i18n.language === 'ru' ? 'font-bold underline' : ''}>RU</button>
              <button onClick={() => i18n.changeLanguage("en")} className={i18n.language === 'en' ? 'font-bold underline' : ''}>EN</button>
              {localStorage.getItem("token") && (
                <button onClick={handleLogout} className="ml-4 text-red-600 hover:underline">{t('buttons.logout')}</button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
