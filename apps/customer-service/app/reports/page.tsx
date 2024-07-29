'use client';

import { FormattedMessage } from 'react-intl';

export default function ReportsPage() {
  return (
    <main className="py-10 lg:pl-60">
      <div className="px-4 sm:px-6 lg:px-8">
        <FormattedMessage id="layout.reports" />
      </div>
    </main>
  );
}

ReportsPage.displayName = 'ReportsPage';
