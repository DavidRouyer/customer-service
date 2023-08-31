'use client';

import { FC } from 'react';
import { useCurrentLocale } from 'next-i18n-router/client';

import i18nConfig from '~/app/i18n/config.mjs';

const formatLanguageName = (language: string, locale: string) => {
  const languageNames = new Intl.DisplayNames([locale], { type: 'language' });

  return languageNames.of(language);
};

type DisplayLanguageNameProps = {
  language: string;
};

export const DisplayLanguageName: FC<DisplayLanguageNameProps> = ({
  language,
}) => {
  const locale = useCurrentLocale(i18nConfig);

  return <>{formatLanguageName(language, locale!)}</>;
};
