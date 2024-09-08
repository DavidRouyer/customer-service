import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

export const Route = createFileRoute('/_authed/_layout/my-inbox')({
  component: () => (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">
        <FormattedMessage id="page.my_inbox" />
      </h2>
    </div>
  ),
});
