import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { TRPCReactProvider } from './providers';

import '~/styles/globals.css';

import getIntl from '~/app/i18n/server';
import ServerIntlProvider from '~/app/i18n/ServerIntlProvider';
import { ThemeProvider } from '~/components/theme-provider';

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
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </ServerIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
