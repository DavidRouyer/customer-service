import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../../packages/api/src/modules/**/typeDefs.ts',
  documents: 'app/graphql/**/*.graphql',
  generates: {
    'app/graphql/generated/client.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        scalars: {
          DateTime: 'string',
        },
        reactQueryVersion: 5,
        addInfiniteQuery: true,
        exposeQueryKeys: true,
        exposeFetcher: true,
        withHooks: true,
        dedupeFragments: true,
        fetcher: {
          endpoint: `process.env.VITE_API_ENDPOINT`,
          fetchParams: {
            headers: {
              'content-type': 'application/json',
            },
          },
        },
      },
    },
  },
};

export default config;
