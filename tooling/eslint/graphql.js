import * as graphqlESLint from '@graphql-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts'],
    // Setup processor for operations/fragments definitions on code-files
    processor: graphqlESLint.processors.graphql,
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  {
    // Setup GraphQL Parser
    files: ['**/*.{graphql,gql}'],
    plugins: {
      '@graphql-eslint': graphqlESLint,
    },
    languageOptions: {
      parser: graphqlESLint,
    },
  },
  {
    files: ['**/*.graphql'],
    ...graphqlESLint.flatConfigs['schema-recommended'],
    rules: {
      ...graphqlESLint.flatConfigs['schema-recommended'].rules,
      '@graphql-eslint/strict-id-in-types': [
        'error',
        {
          exceptions: {
            suffixes: ['Connection', 'Edge', 'PageInfo', 'Payload', 'Error'],
          },
        },
      ],
    },
  },
];
