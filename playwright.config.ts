import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * E2E contra o build de produção (`next build` + `next start`), sem nenhuma
 * credencial externa: sem Sanity (fallback local), sem webhook (stub), sem
 * GTM/GA4. Nenhum dado é enviado para serviços externos.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // Paralelismo limitado: em Windows, 4+ instâncias Chromium iniciando ao
  // mesmo tempo travavam no carregamento de assets locais (o servidor
  // respondia normalmente via curl). A cobertura não muda.
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 7_500 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "pt-BR",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: "pipe",
    env: {
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      NEXT_PUBLIC_SITE_ENV: "development",
      NEXT_PUBLIC_GTM_ID: "",
      NEXT_PUBLIC_GA4_ID: "",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "",
      NEXT_PUBLIC_SANITY_DATASET: "",
      SANITY_API_TOKEN: "",
      QUOTE_WEBHOOK_URL: "",
      QUOTE_WEBHOOK_SECRET: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
