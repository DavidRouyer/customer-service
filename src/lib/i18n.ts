import { initReactI18next } from 'react-i18next';

import English from '@/lang/en.json';
import French from '@/lang/fr.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: English,
      },
      fr: {
        translation: French,
      },
    },
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });
