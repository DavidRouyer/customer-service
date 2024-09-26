export interface Config {
  locales: string[];
  defaultLocale: string;
  localeCookie?: string;
}

const i18nConfig: Config = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
};

export default i18nConfig;
