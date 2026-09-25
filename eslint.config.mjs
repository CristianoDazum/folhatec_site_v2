import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // O Studio é um pacote independente, com dependências e lint próprios.
    "sanity/**",
    "playwright-report/**",
    "test-results/**",
    "blob-report/**",
  ]),
]);
