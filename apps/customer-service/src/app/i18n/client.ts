'use client';

import { useEffect, useState } from 'react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next';

import { getOptions, languages } from '~/app/i18n/settings';
import English from '~/lang/en';
import French from '~/lang/fr';

const runsOnServerSide = typeof window === 'undefined';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    ...getOptions(),
    resources: {
      en: {
        translation: English,
      },
      fr: {
        translation: French,
      },
    },

    lng: undefined,

    detection: { order: ['htmlTag'] },

    preload: runsOnServerSide ? languages : [],

    interpolation: {
      escapeValue: false,
    },
  });

export function useTranslation(lng: string) {
  const ret = useTranslationOrg();
  const { i18n } = ret;
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return;
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
  }
  return ret;
}
