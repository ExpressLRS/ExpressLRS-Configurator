import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // For auto-detecting language
import Backend from 'i18next-http-backend'; // For loading translations from backend

const searchParams = new URLSearchParams(window.location.search.slice(1));
const loadPath = `${
  searchParams.get('base_url') ?? 'http://localhost:3500/'
}/locales/{{lng}}/messages.json`;

// Keep the document direction and language in sync (e.g. RTL for Arabic)
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir(lng);
  document.documentElement.lang = lng;
});

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath,
    },
    debug:
      process.env.NODE_ENV === 'development'
      || process.env.DEBUG_PROD === 'true',
  });

// i18n.changeLanguage('en')

export default i18n;
