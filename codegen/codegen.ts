import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "apps/backend/src/**/*.graphql",
  documents: ["apps/frontend/src/**/*.{ts,tsx}"],
  generates: {
    "apps/backend/src/gql/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
    "apps/frontend/src/gql/": {
      preset: "client",
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
};

export default config;
