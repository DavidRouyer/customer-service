import 'server-only';

import { cookies } from 'next/headers';

import i18nConfig from '~/app/i18n/config.mjs';

const currentLocale = (): string => {
  const { defaultLocale, localeCookie = 'NEXT_LOCALE' } = i18nConfig;
  return cookies().get(localeCookie)?.value ?? defaultLocale;
};

export default currentLocale;
