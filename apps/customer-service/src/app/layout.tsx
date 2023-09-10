import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { TRPCReactProvider } from './providers';

import '~/styles/globals.css';

import getIntl from '~/app/i18n/server';
import ServerIntlProvider from '~/app/i18n/ServerIntlProvider';
import { ThemeProvider } from '~/components/theme-provider';
import { getCurrentUser } from '~/utils/session';

export const metadata: Metadata = {
  title: 'Customer Service',
  description: 'Prototyping a Customer Service Software',
  openGraph: {
    title: 'Customer Service',
    description: 'Prototyping a Customer Service Software',
    url: 'https://github.com/DavidRouyer/customer-service',
    siteName: 'Customer Service',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const intl = await getIntl();

  const user = await getCurrentUser();

  return (
    <html lang={intl.locale} className="h-full" suppressHydrationWarning>
      <body className={['font-sans', 'h-full'].join(' ')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServerIntlProvider
            intl={{ messages: intl.messages, locale: intl.locale }}
          >
            <TRPCReactProvider headers={headers()} user={user}>
              {children}
            </TRPCReactProvider>
          </ServerIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
