import { FC } from 'react';
import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { LayoutWithSidebar } from '@/app/LayoutWithSidebar';
import { LayoutWithTicketList } from '@/app/LayoutWithTicketList';
import '@/lib/i18n';
import { useSetupAgentList } from '@/stores/useSetupAgentList';
import { useSetupCurrentUser } from '@/stores/useSetupCurrentUser';
import { useSetupMessageList } from '@/stores/useSetupMessageList';
import { useSetupTicketList } from '@/stores/useSetupTicketList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithSidebar />,
    children: [
      {
        index: true,
        element: <Navigate to="/tickets/1&filter=me" />,
      },
      {
        path: 'tickets',
        element: <LayoutWithTicketList />,
        children: [
          {
            path: ':ticketId?',
            lazy: () => import('@/app/Ticket'),
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
  useSetupAgentList();
  useSetupCurrentUser();
  useSetupMessageList();
  useSetupTicketList();

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
