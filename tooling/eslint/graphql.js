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
      '@graphql-eslint/naming-convention': [
        'error',
        {
          types: 'PascalCase',
          FieldDefinition: 'camelCase',
          InputValueDefinition: 'camelCase',
          Argument: 'camelCase',
          DirectiveDefinition: 'camelCase',
          EnumValueDefinition: 'UPPER_CASE',
          'FieldDefinition[parent.name.value=Query]': {
            forbiddenPrefixes: ['query', 'get'],
            forbiddenSuffixes: ['Query'],
          },
          'FieldDefinition[parent.name.value=Mutation]': {
            forbiddenPrefixes: ['mutation'],
            forbiddenSuffixes: ['Mutation'],
          },
          'FieldDefinition[parent.name.value=Subscription]': {
            forbiddenPrefixes: ['subscription'],
            forbiddenSuffixes: ['Subscription'],
          },
          'EnumTypeDefinition,EnumTypeExtension': {
            forbiddenPrefixes: ['Enum'],
            forbiddenSuffixes: ['Enum'],
          },
          'InterfaceTypeDefinition,InterfaceTypeExtension': {
            forbiddenPrefixes: ['Interface'],
            forbiddenSuffixes: ['Interface'],
          },
          'UnionTypeDefinition,UnionTypeExtension': {
            forbiddenPrefixes: ['Union'],
            forbiddenSuffixes: ['Union'],
          },
          'ObjectTypeDefinition,ObjectTypeExtension': {
            forbiddenPrefixes: ['Type'],
            forbiddenSuffixes: ['Type'],
            ignorePattern: 'LabelType',
          },
        },
      ],
      '@graphql-eslint/no-typename-prefix': 'warn',
      '@graphql-eslint/strict-id-in-types': [
        'error',
        {
          exceptions: {
            suffixes: [
              'Connection',
              'Edge',
              'Entry',
              'PageInfo',
              'Payload',
              'Error',
            ],
          },
        },
      ],
    },
  },
];
