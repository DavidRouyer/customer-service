import { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import { Config } from '~/app/i18n/Config';

function localeDetector(request: NextRequest, config: Config): string {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  console.log('languages', JSON.stringify(languages));

  return match(languages, config.locales, config.defaultLocale);
}

export default localeDetector;
