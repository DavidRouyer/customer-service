import baseConfig from '@kyaku/eslint-config/base';
import reactConfig from '@kyaku/eslint-config/react';
import tailwindConfig from '@kyaku/eslint-config/tailwind';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [
      '.vinxi/**',
      'app/routeTree.gen.ts',
      'app/graphql/generated/client.ts',
    ],
  },
  ...baseConfig,
  ...reactConfig,
  ...tailwindConfig,
];
