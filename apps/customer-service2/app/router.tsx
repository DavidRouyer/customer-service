import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { QueryProvider } from '~/api/providers';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

export const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {},
    defaultPendingComponent: () => <div className={`p-2 text-2xl`}>Spin</div>,
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </QueryProvider>
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
