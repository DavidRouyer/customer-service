import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { Logo } from '~/components/logo';

function NotFound() {
  return (
    <div className="flex size-full">
      <div className="contents">
        <div className="flex grow flex-col">
          <div>
            <div className="p-6">
              <Logo />
            </div>
            <div
              data-orientation="horizontal"
              role="none"
              className="h-px w-full shrink-0 bg-border"
            ></div>
          </div>
          <div className="flex grow flex-col items-center justify-center">
            <div className="flex size-full grow items-center justify-center">
              <div>
                <h1 className="text-3xl font-bold">404</h1>
                <p className="text-xl text-muted-foreground">Page not found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      <div>
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
