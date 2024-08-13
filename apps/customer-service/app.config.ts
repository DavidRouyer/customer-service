import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import reactRefresh from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { createApp } from 'vinxi';
import viteTsconfigPaths from 'vite-tsconfig-paths';

dotenv.config({
  path: '../../.env',
});

export default createApp({
  server: {
    preset: 'vercel',
    experimental: {
      asyncContext: true,
    },
    // Fixes https://github.com/nuxt/nuxt/issues/27784
    externals: {
      traceInclude: ['node_modules/lexical/Lexical.prod.mjs'],
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
