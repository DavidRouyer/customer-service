import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import reactRefresh from '@vitejs/plugin-react';
import { createApp } from 'vinxi';

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
      handler: './src/api-server.handler.ts',
      target: 'server',
    },
    {
      type: 'spa',
      name: 'client',
      handler: './index.html',
      target: 'browser',
      plugins: () => [
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
