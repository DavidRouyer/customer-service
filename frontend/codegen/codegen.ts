import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
};

export default config;
