import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../../packages/api/src/modules/**/*.graphql',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/graphql/generated/client.ts': {
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
          endpoint: `http://localhost:${process.env.PORT ?? 3000}/api/graphql`,
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
