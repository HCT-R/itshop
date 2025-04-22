import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ru from "./ru.json";
import kz from "./kz.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kz: { translation: kz },
  },
  lng: "ru", // язык по умолчанию
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
