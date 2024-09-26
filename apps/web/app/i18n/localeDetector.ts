import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import type { Config } from '~/i18n/config';

function localeDetector(request: Request, config: Config): string {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Handle no language header
  if (languages.length === 1 && languages[0] === '*') {
    return config.defaultLocale;
  }

  return match(languages, config.locales, config.defaultLocale);
}

export default localeDetector;
