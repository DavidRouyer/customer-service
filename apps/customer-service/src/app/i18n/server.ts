'server-only';

import { createIntl } from '@formatjs/intl';
import { currentLocale } from 'next-i18n-router';

const getMessages = async (lang: string) => {
  return (await import(`../../locales/${lang}.json`)).default;
};

export default async function getIntl() {
  const lang = currentLocale();

  return createIntl({
    locale: lang!,
    messages: await getMessages(lang!),
  });
}
