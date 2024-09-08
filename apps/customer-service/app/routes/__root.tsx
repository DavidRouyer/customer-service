import type { Session } from '@auth/core/types';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import {
  Body,
  createServerFn,
  Head,
  Html,
  Meta,
  Scripts,
} from '@tanstack/start';
import { IntlProvider } from 'react-intl';
import { getWebRequest } from 'vinxi/http';

import i18nConfig from '~/i18n/config';
import localeDetector from '~/i18n/localeDetector';
import appCss from '~/styles/app.css?url';
import { getAuth } from '~/utils/getAuth';

const fetchSession = createServerFn('GET', async (_) => {
  const request = getWebRequest();
  const session = await getAuth(request);

  return {
    session,
  };
});

const fetchLocale = createServerFn('GET', async (_) => {
  const request = getWebRequest();
  const locale = localeDetector(request, i18nConfig);
  const { default: keys, ...rest } = (await import(
    `../locales/${locale}.json`
  )) as Record<string, string> & { default: Record<string, string> };

  return {
    locale,
    messages: { ...keys, ...rest },
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Session | null;
  locale?: string;
  messages?: Record<string, string>;
}>()({
  meta: () => [
    {
      title: 'Kyaku',
    },
    {
      description: 'Customer Service Software',
    },
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'og:title',
      content: 'Kyaku',
    },
    {
      name: 'og:description',
      content: 'Customer Service Software',
    },
    {
      name: 'og:url',
      content: 'https://github.com/DavidRouyer/customer-service',
    },
    {
      name: 'og:site_name',
      content: 'Kyaku',
    },
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
    { rel: 'icon', href: '/favicon.ico' },
  ],
  beforeLoad: async () => {
    const { session } = await fetchSession();
    const { locale, messages } = await fetchLocale();

    return {
      session,
      locale,
      messages,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { locale, messages } = Route.useRouteContext();

  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>

        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}
