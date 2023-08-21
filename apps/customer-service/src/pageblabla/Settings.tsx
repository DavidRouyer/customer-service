import { FC } from 'react';
import { Trans } from 'react-i18next';

export const Component: FC = () => {
  return (
    <main className="py-10 lg:pl-60">
      <div className="px-4 sm:px-6 lg:px-8">
        <Trans i18nKey="layout.settings" />
      </div>
    </main>
  );
};

Component.displayName = 'Settings';
