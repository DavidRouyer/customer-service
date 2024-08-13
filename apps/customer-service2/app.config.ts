import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import reactRefresh from '@vitejs/plugin-react';
import { createApp } from 'vinxi';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default createApp({
  server: {
    preset: 'vercel',
    experimental: {
      asyncContext: true,
    },
  },
  routers: [
    {
      type: 'static',
      name: 'public',
      dir: './public',
    },
    {
      type: 'http',
      name: 'graphql',
      base: '/graphql',
      handler: './api-server.handler.ts',
      target: 'server',
      plugins: () => [reactRefresh()],
    },
    {
      type: 'spa',
      name: 'client',
      handler: './index.html',
      target: 'browser',
      plugins: () => [
        viteTsconfigPaths(),
        TanStackRouterVite({
          routesDirectory: './app/routes',
          generatedRouteTree: './app/routeTree.gen.ts',
          experimental: {
            enableCodeSplitting: true,
          },
        }),
        reactRefresh(),
      ],
    },
  ],
});
