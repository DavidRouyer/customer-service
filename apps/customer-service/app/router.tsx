import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { Provider } from 'jotai';

import NotFound from '~/components/not-found';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

export const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient,
    },
    defaultPendingComponent: () => <div className={`p-2 text-2xl`}>Spin</div>,
    defaultNotFoundComponent: NotFound,
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <Provider>{children}</Provider>
        </QueryClientProvider>
      );
    },
  });

  return router;
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
