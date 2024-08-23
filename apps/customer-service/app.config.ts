import { defineConfig } from '@tanstack/start/config';
import reactRefresh from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';
import tsConfigPaths from 'vite-tsconfig-paths';

dotenv.config({
  path: '../../.env',
});

const app = defineConfig({
  deployment: {
    preset: 'vercel',
  },
  vite: {
    plugins: () => [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
});

app.addRouter({
  type: 'http',
  name: 'auth',
  base: '/api/auth',
  handler: './auth-server.handler.ts',
  target: 'server',
  plugins: () => [reactRefresh()],
});

app.addRouter({
  type: 'http',
  name: 'graphql',
  base: '/graphql',
  handler: './api-server.handler.ts',
  target: 'server',
  plugins: () => [reactRefresh()],
});

// Fixes https://github.com/nuxt/nuxt/issues/27784
/*config.server.rollupConfig.plugins.push(
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
  })
);*/

export default app;
