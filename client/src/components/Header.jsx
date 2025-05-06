import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">itshop</h1>
      <div className="flex items-center gap-2">
        <button onClick={() => changeLang("kz")} className="mx-1">KZ</button>
        <button onClick={() => changeLang("ru")} className="mx-1">RU</button>
        <button onClick={() => changeLang("en")} className="mx-1">EN</button>
        {localStorage.getItem("token") && (
          <button onClick={handleLogout} className="ml-4 text-red-600 hover:underline">Выйти</button>
        )}
      </div>
    </header>
  );
}
