'use client';

import { FormattedMessage } from 'react-intl';

export default function UnassignedPage() {
  return (
    <main className="py-10 lg:pl-60">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">
          <FormattedMessage id="page.unassigned" />
        </h2>
      </div>
    </main>
  );
}

UnassignedPage.displayName = 'UnassignedPage';
