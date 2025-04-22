const fs = require("fs");
const fetch = require("node-fetch");

const baseText = {
  welcome: "Добро пожаловать в itshop!",
  description: "Это онлайн-магазин для любителей техники."
};

const languages = {
  en: "Ағылшын",
  ru: "Русский",
  kz: "Қазақ"
};

async function translateText(text, lang) {
  const res = await fetch("https://libretranslate.de/translate", {
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
}

(async () => {
  for (const [langCode, langName] of Object.entries(languages)) {
    const translated = {};

    for (const key of Object.keys(baseText)) {
      const original = baseText[key];

      if (langCode === "ru") {
        translated[key] = original;
      } else {
        console.log(`🔁 Перевожу "${original}" → ${langName}...`);
        translated[key] = await translateText(original, langCode);
      }
    }

    fs.writeFileSync(`client/src/i18n/${langCode}.json`, JSON.stringify(translated, null, 2));
    console.log(`✅ Сохранено: ${langCode}.json`);
  }
})();
