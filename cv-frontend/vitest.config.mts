import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    pool: "threads",
    coverage: {
      provider: "v8",
      exclude: [
        "shared/components/ui/**",
        "graphql/__generated__/**",
        "**/icons.tsx",
        "**/*.svg",
        "**/*.d.ts",
        "**/index.ts",
      ],
    },
  },
});
