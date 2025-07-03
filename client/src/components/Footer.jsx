import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-8 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4 md:gap-2">
        <div className="text-base sm:text-lg font-bold text-center md:text-left">itshop &copy; {new Date().getFullYear()}</div>
        <div className="text-xs sm:text-sm text-center md:text-left">Все права защищены</div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 md:mt-0 items-center">
          <a href="mailto:support@itshop.kz" className="hover:underline">support@itshop.kz</a>
          <a href="tel:+77001234567" className="hover:underline">+7 (700) 123-45-67</a>
          <a href="https://t.me/itshop" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
        </div>
      </div>
    </footer>
  );
} 