import baseConfig from '@cs/eslint-config/base';
import nextjsConfig from '@cs/eslint-config/nextjs';
import reactConfig from '@cs/eslint-config/react';
import tailwindConfig from '@cs/eslint-config/tailwind';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default [
  {
    ignores: ['.next/**', 'src/graphql/generated/client.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...tailwindConfig,
];
