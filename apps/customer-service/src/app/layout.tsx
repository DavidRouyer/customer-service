import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { TRPCReactProvider } from './providers';

import '~/styles/globals.css';

import getIntl from '~/app/i18n/server';
import ServerIntlProvider from '~/app/i18n/ServerIntlProvider';

const fontSans = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

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

  return (
    <html lang={intl.locale} className="h-full">
      <body className={['font-sans', 'h-full', fontSans.variable].join(' ')}>
        <ServerIntlProvider
          intl={{ messages: intl.messages, locale: intl.locale }}
        >
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </ServerIntlProvider>
      </body>
    </html>
  );
}
