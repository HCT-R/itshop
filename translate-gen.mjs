import fs from "fs";
import fetch from "node-fetch";

const baseText = {
  welcome: "Добро пожаловать в itshop!",
  description: "Это онлайн-магазин для любителей техники.",
  cart: "Корзина",
  checkout: "Оформление",
  products: "Товары",
  total: "Итого",
  name: "Имя",
  phone: "Телефон",
  place_order: "Оформить заказ"
};

const languages = {
  ru: "Русский",
  en: "English",
  kz: "Kazakh"
};

const API_URL = "https://libretranslate.de/translate";

async function translateText(text, lang) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "ru",
        target: lang,
        format: "text"
      }),
    });

    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("❌ Ошибка перевода:", err);
    return text;
  }
}

async function run() {
  if (!fs.existsSync("client/src/i18n")) {
    fs.mkdirSync("client/src/i18n", { recursive: true });
  }

  for (const [langCode, langName] of Object.entries(languages)) {
    const translated = {};

    for (const key in baseText) {
      const original = baseText[key];

      if (langCode === "ru") {
        translated[key] = original;
      } else {
        console.log(`🔁 Перевожу: "${original}" → ${langName}`);
        translated[key] = await translateText(original, langCode);
      }
    }

    fs.writeFileSync(
      `client/src/i18n/${langCode}.json`,
      JSON.stringify(translated, null, 2)
    );

    console.log(`✅ Сохранено: ${langCode}.json`);
  }
}

run();
