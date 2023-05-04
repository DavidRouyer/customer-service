import { FC } from 'react';
import { Trans } from 'react-i18next';
import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

import { LayoutWithSidebar } from '@/app/LayoutWithSidebar';
import { LayoutWithTicketList } from '@/app/LayoutWithTicketList';
import '@/lib/i18n';

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
            lazy: () => import('@/pages/Ticket'),
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
        lazy: () => import('@/pages/Reports'),
      },
      {
        path: 'settings',
        lazy: () => import('@/pages/Settings'),
      },
    ],
  },
]);

export const App: FC = () => {
  return <RouterProvider router={router} />;
};

App.displayName = 'App';
