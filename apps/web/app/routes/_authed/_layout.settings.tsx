import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

export const Route = createFileRoute('/_authed/_layout/settings')({
  component: () => (
    <div className="px-4 sm:px-6 lg:px-8">
      <FormattedMessage id="layout.settings" />
    </div>
  ),
});
