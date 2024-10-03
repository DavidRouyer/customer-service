import baseConfig from '@kyaku/eslint-config/base';
import graphqlConfig from '@kyaku/eslint-config/graphql';

export default [
  {
    ignores: ['codegen.ts'],
  },
  ...baseConfig,
  ...graphqlConfig,
];
