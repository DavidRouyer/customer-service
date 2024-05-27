'use client';

import type { IntlShape } from 'react-intl';
import { IntlProvider } from 'react-intl';

export default function ServerIntlProvider({
  intl,
  children,
}: {
  intl: IntlShape;
  children: React.ReactNode;
}) {
  return <IntlProvider {...intl}>{children}</IntlProvider>;
}
