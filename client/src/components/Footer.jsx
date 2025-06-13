import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-8 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-2">
        <div className="text-lg font-bold">itshop &copy; {new Date().getFullYear()}</div>
        <div className="text-sm">Все права защищены</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="mailto:support@itshop.kz" className="hover:underline">support@itshop.kz</a>
          <a href="tel:+77001234567" className="hover:underline">+7 (700) 123-45-67</a>
          <a href="https://t.me/itshop" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
        </div>
      </div>
    </footer>
  );
} 