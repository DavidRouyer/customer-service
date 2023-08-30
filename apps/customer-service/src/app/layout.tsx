import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { TRPCReactProvider } from './providers';

import '~/styles/globals.css';

import { languages } from '~/app/i18n/settings';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: 'Create T3 Turbo',
  description: 'Simple monorepo with shared backend for web & mobile apps',
  openGraph: {
    title: 'Create T3 Turbo',
    description: 'Simple monorepo with shared backend for web & mobile apps',
    url: 'https://create-t3-turbo.vercel.app',
    siteName: 'Create T3 Turbo',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jullerino',
    creator: '@jullerino',
  },
};

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  return (
    <html lang={lang} className="h-full">
      <body className={['font-sans', 'h-full', fontSans.variable].join(' ')}>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
