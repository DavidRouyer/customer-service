import { defineConfig } from '@tanstack/start/config';
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
  name: 'graphql',
  base: '/api/graphql',
  handler: './app/api.graphql.ts',
  target: 'server',
});

// Fixes https://github.com/nuxt/nuxt/issues/27784
if (
  app.config.server.rollupConfig &&
  Array.isArray(app.config.server.rollupConfig.plugins)
) {
  app.config.server.rollupConfig?.plugins?.push(
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
  );
}

export default app;
