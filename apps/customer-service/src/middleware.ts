import { NextRequest } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

import i18nConfig from '~/app/i18n/config.mjs';

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
