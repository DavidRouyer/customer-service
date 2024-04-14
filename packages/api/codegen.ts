import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/modules/**/*.graphql',
  generates: {
    './src/generated-types/graphql.ts': {
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        'typescript',
        'typescript-resolvers',
      ],
    },
  },
  config: {
    contextType: './context#Context',
  },
};

export default config;
