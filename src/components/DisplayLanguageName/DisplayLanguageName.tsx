import { FC } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();

  return <>{formatLanguageName(language, i18n.language)}</>;
};
