import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "apps/backend/src/**/*.ts",
  documents: ["apps/frontend/src/**/*.{ts,tsx}"],
  generates: {
    "apps/backend/src/gql/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
        enumsAsTypes: true,
        scalars: {
          Json: "string",
          Date: "string",
        },
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
    "apps/frontend/src/gql/": {
      preset: "client",
      config: {
        scalars: {
          Json: "string",
          Date: "string",
        },
      },
    },
  },
  hooks: {
    afterOneFileWrite: ["prettier --write"],
  },
};

export default config;
