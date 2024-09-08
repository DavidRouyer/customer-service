import baseConfig from '@cs/eslint-config/base';
import reactConfig from '@cs/eslint-config/react';
import tailwindConfig from '@cs/eslint-config/tailwind';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default [
  {
    ignores: ['.vinxi/**', 'src/graphql/generated/client.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...tailwindConfig,
];
