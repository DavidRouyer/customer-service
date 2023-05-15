import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "backend/src/**/*.graphql",
  documents: ["frontend/src/**/*.{ts,tsx}"],
  generates: {
    "backend/src/gql/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
    "frontend/src/gql/": {
      preset: "client",
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
};

export default config;
