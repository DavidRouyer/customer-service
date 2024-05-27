import 'server-only';

import { createIntl } from '@formatjs/intl';

import currentLocale from '~/app/i18n/currentLocale';

const getMessages = async (lang: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (await import(`../locales/${lang}.json`)).default as Record<
    string,
    string
  >;
};

export default async function getIntl() {
  const lang = currentLocale();

  return createIntl({
    locale: lang,
    messages: await getMessages(lang),
  });
}
