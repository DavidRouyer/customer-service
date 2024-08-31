import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { Provider } from 'jotai';

import NotFound from '~/components/not-found';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: 'intent',
      context: {
        queryClient,
      },
      defaultPendingComponent: () => <div className={`p-2 text-2xl`}>Spin</div>,
      defaultNotFoundComponent: NotFound,
      Wrap: function WrapComponent({ children }) {
        return <Provider>{children}</Provider>;
      },
    }),
    queryClient
  );
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
