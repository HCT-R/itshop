import React from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">itshop</h1>
      <div>
        <button onClick={() => changeLang("kz")} className="mx-1">KZ</button>
        <button onClick={() => changeLang("ru")} className="mx-1">RU</button>
        <button onClick={() => changeLang("en")} className="mx-1">EN</button>
      </div>
    </header>
  );
}
