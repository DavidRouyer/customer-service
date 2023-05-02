import { FC } from 'react';
import { Trans } from 'react-i18next';

import { Layout } from '@/app/Layout';
import '@/lib/i18n';

export const App: FC = () => {
  return (
    <Layout>
      <div>
        <Trans i18nKey="app.content" />
      </div>
    </Layout>
  );
};

App.displayName = 'App';
