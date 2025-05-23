import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './ru.json';
import en from './en.json';
import kz from './kz.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    kz: { translation: kz },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
