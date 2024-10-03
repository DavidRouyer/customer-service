import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/modules/**/typeDefs.ts',
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
    scalars: {
      DateTime: 'Date',
    },
    contextType: '../graphql#Context',
    useTypeImports: true,
    enumValues: {
      TicketStatusDetail: '@kyaku/kyaku/models#TicketStatusDetail',
    },
  },
};

export default config;
