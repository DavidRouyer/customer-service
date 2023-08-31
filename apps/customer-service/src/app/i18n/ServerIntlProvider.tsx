'use client';

import { IntlProvider, IntlShape } from 'react-intl';

export default function ServerIntlProvider({ intl, children }: { intl: IntlShape; children: React.ReactNode }) {
  return <IntlProvider {...intl}>{children}</IntlProvider>;
}
