import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import i18nConfig from '~/app/i18n/config.mjs';
import localeDetector from '~/app/i18n/localeDetector';

export const middleware = (request: NextRequest) => {
  const { defaultLocale, locales, localeCookie = 'NEXT_LOCALE' } = i18nConfig;

  let locale;
  if (localeCookie) {
    const cookieValue = request.cookies.get(localeCookie)?.value;

    if (cookieValue && locales.includes(cookieValue)) {
      locale = cookieValue;
    }
  }

  if (!locale) {
    locale = localeDetector(request, i18nConfig);
  }

  if (!locales.includes(locale)) {
    console.warn(
      'The localeDetector callback must return a locale included in your locales array. Reverting to using defaultLocale.'
    );

    locale = defaultLocale;
  }

  const response = NextResponse.next();

  response.cookies.set(localeCookie, locale);

  return response;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
