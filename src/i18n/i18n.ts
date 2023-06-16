import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // For auto-detecting language
import Bankend from 'i18next-http-backend'; // For loading translations from backend

i18n
  .use(Bankend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: './i18n/{{lng}}/translation.json',
    },
  });

// i18n.changeLanguage('en')

export default i18n;
