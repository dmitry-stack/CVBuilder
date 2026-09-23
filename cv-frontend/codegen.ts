import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../cv-backend/src/**/*.graphql",
  documents: ["src/**/*.{ts,tsx,graphql}", "!src/graphql/__generated__/**"],
  generates: {
    "./src/graphql/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
