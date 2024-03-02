import type { Metadata, Viewport } from 'next';

import { TRPCReactProvider } from '~/trpc/react';

import '~/app/globals.css';

import { ThemeProvider } from '~/app/_components/theme-provider';
import getIntl from '~/app/i18n/server';
import ServerIntlProvider from '~/app/i18n/ServerIntlProvider';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kyaku',
  description: 'Customer Service Software',
  openGraph: {
    title: 'Kyaku',
    description: 'Customer Service Software',
    url: 'https://github.com/DavidRouyer/customer-service',
    siteName: 'Kyaku',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const intl = await getIntl();

  return (
    <html lang={intl.locale} className="h-full" suppressHydrationWarning>
      <body className={['font-sans', 'h-full'].join(' ')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServerIntlProvider
            intl={{ messages: intl.messages, locale: intl.locale }}
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ServerIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
