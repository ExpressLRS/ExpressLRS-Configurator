import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // For auto-detecting language
import Backend from 'i18next-http-backend'; // For loading translations from backend

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './i18n/{{lng}}/translation.json',
    },
    debug:
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true',
  });

// i18n.changeLanguage('en')

export default i18n;
