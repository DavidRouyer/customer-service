import { FC } from 'react';
import { Trans } from 'react-i18next';
import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { LayoutWithSidebar } from '@/app/LayoutWithSidebar';
import { LayoutWithTicketList } from '@/app/LayoutWithTicketList';
import '@/lib/i18n';
import { useSetupMessageList } from '@/stores/useSetupMessageList';
import { useSetupTicketList } from '@/stores/useSetupTicketList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithSidebar />,
    children: [
      {
        index: true,
        element: <Navigate to="/tickets/me" />,
      },
      {
        path: 'tickets',
        element: <LayoutWithTicketList />,
        children: [
          {
            path: ':id',
            lazy: () => import('@/app/Ticket'),
          },
          {
            path: 'all',
            element: (
              <div>
                <Trans i18nKey="layout.tickets.all_tickets" />
              </div>
            ),
          },
          {
            path: 'unassigned',
            element: (
              <div>
                <Trans i18nKey="layout.tickets.unassigned_tickets" />
              </div>
            ),
          },
        ],
      },
      {
        path: 'reports',
        lazy: () => import('@/app/Reports'),
      },
      {
        path: 'settings',
        lazy: () => import('@/app/Settings'),
      },
    ],
  },
]);

export const SetupStores = () => {
  useSetupTicketList();
  useSetupMessageList();

  return null;
};

export const App: FC = () => {
  return (
    <RecoilRoot>
      <SetupStores />
      <RouterProvider router={router} />
    </RecoilRoot>
  );
};

App.displayName = 'App';
