import { headers } from 'next/headers';
import acceptLanguage from 'accept-language';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

import English from '~/lang/en';
import French from '~/lang/fr';
import { fallbackLng, getOptions, languages } from './settings';

acceptLanguage.languages(languages);

export function detectLanguage() {
  const reqHeaders = headers();
  let lng = acceptLanguage.get(reqHeaders.get('Accept-Language'));
  if (!lng) lng = fallbackLng;
  return lng;
}

const initI18next = async (lng: string) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();
  await i18nInstance.use(initReactI18next).init({
    ...getOptions(lng),
    resources: {
      en: {
        translation: English,
      },
      fr: {
        translation: French,
      },
    },
  });
  return i18nInstance;
};

export async function useTranslation(lng: string) {
  const i18nextInstance = await initI18next(lng);
  return {
    t: i18nextInstance.getFixedT(lng),
    i18n: i18nextInstance,
  };
}
