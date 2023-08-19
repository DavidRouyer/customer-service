import { FC, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { LayoutWithSidebar } from '~/app/LayoutWithSidebar';
import { LayoutWithTicketList } from '~/app/LayoutWithTicketList';
import { TicketProvider, useTicket } from '~/hooks/useTicket/TicketProvider';
import { User } from '~/hooks/useTicket/User';

import '~/lib/i18n';

import { useSetupAgentList } from '~/stores/useSetupAgentList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithSidebar />,
    children: [
      {
        index: true,
        element: <Navigate to="/tickets?filter=me" />,
      },
      {
        path: 'tickets',
        element: <LayoutWithTicketList />,
        children: [
          {
            path: ':ticketId?',
            lazy: () => import('~/app/Ticket'),
          },
        ],
      },
      {
        path: 'reports',
        lazy: () => import('~/app/Reports'),
      },
      {
        path: 'settings',
        lazy: () => import('~/app/Settings'),
      },
    ],
  },
]);

export const SetupStores = () => {
  useSetupAgentList();
  const { setCurrentUser } = useTicket();

  useEffect(() => {
    setCurrentUser(
      new User(
        '1',
        'Tom',
        'Cook',
        'tom.cook@example.com',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80'
      )
    );
  }, [setCurrentUser]);

  return null;
};

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <TicketProvider>
          <SetupStores />
          <RouterProvider router={router} />
        </TicketProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

App.displayName = 'App';
