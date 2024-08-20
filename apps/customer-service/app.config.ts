import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import reactRefresh from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';
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
    rollupConfig: {
      plugins: [
        copy({
          targets: [
            {
              src: '../../node_modules/@lexical/headless/LexicalHeadless.node.mjs',
              dest: '.vercel/output/functions/__nitro.func/node_modules/@lexical/headless',
            },
            {
              src: '../../node_modules/lexical/Lexical.node.mjs',
              dest: '.vercel/output/functions/__nitro.func/node_modules/lexical',
            },
          ],
          verbose: true,
        }),
      ],
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
      name: 'auth',
      base: '/api/auth',
      handler: './auth-server.handler.ts',
      target: 'server',
      plugins: () => [reactRefresh()],
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
