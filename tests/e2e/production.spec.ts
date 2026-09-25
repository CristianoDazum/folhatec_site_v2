/**
 * Build REAL de produção em pasta separada (NEXT_DIST_DIR), sem credenciais:
 * 1. com NEXT_PUBLIC_SITE_URL local, o build precisa falhar;
 * 2. com URL pública, nenhuma URL pública (canonical, OG, JSON-LD, robots,
 *    sitemap) pode conter localhost, e a página é indexável;
 * 3. sem webhook em produção, a API de cotação retorna 503.
 */
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const ROOT = path.resolve(__dirname, "../..");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const DIST_DIR = ".next-prod-check";
const PORT = 3101;
const LOCAL = `http://127.0.0.1:${PORT}`;
const PUBLIC_URL = "https://www.folhatec-verificacao.example";

test.describe.configure({ mode: "serial", timeout: 420_000 });

function productionEnv(siteUrl: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    NODE_ENV: "production",
    NEXT_DIST_DIR: DIST_DIR,
    NEXT_TELEMETRY_DISABLED: "1",
    NEXT_PUBLIC_SITE_ENV: "production",
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_GTM_ID: "",
    NEXT_PUBLIC_GA4_ID: "",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "",
    NEXT_PUBLIC_SANITY_DATASET: "",
    SANITY_API_TOKEN: "",
    QUOTE_WEBHOOK_URL: "",
    QUOTE_WEBHOOK_SECRET: "",
    VERCEL_ENV: "",
  };
}

function build(siteUrl: string) {
  return spawnSync(process.execPath, [NEXT_BIN, "build"], {
    cwd: ROOT,
    env: productionEnv(siteUrl),
    encoding: "utf8",
    timeout: 300_000,
  });
}

let server: ChildProcess | null = null;

test.afterAll(() => {
  server?.kill();
  try {
    rmSync(path.join(ROOT, DIST_DIR), { recursive: true, force: true });
  } catch {
    // Arquivos ainda travados no Windows — pasta está no .gitignore.
  }
  // O build acima aponta next-env.d.ts para DIST_DIR; restaura o padrão (.next).
  const env = { ...process.env };
  delete env.NEXT_DIST_DIR;
  spawnSync(process.execPath, [NEXT_BIN, "typegen"], { cwd: ROOT, env, encoding: "utf8" });
});

test("build de produção falha com NEXT_PUBLIC_SITE_URL local", () => {
  const result = build("http://localhost:3000");
  expect(result.status, "o build deveria falhar").not.toBe(0);
  expect(`${result.stdout}${result.stderr}`).toMatch(/NEXT_PUBLIC_SITE_URL/);
});

test("produção com URL pública nunca publica localhost", async () => {
  const result = build(PUBLIC_URL);
  expect(result.status, `${result.stdout}\n${result.stderr}`.slice(-3000)).toBe(0);

  server = spawn(process.execPath, [NEXT_BIN, "start", "--port", String(PORT), "--hostname", "127.0.0.1"], {
    cwd: ROOT,
    env: productionEnv(PUBLIC_URL),
    stdio: "ignore",
  });
  await expect
    .poll(async () => (await fetch(`${LOCAL}/robots.txt`).catch(() => null))?.status ?? 0, { timeout: 60_000 })
    .toBe(200);

  // Páginas: canonical, og:url, JSON-LD e ausência total de localhost.
  for (const route of ["/", "/solucoes/etiquetas", "/segmentos/alimentos", "/empresa"]) {
    const html = await (await fetch(`${LOCAL}${route}`)).text();
    expect(html, `localhost em ${route}`).not.toMatch(/localhost|127\.0\.0\.1/);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, `canonical de ${route}`).toBe(route === "/" ? PUBLIC_URL : `${PUBLIC_URL}${route}`);
    expect(html).toContain(`property="og:url" content="${canonical}"`);
    expect(html, `robots de ${route}`).not.toMatch(/name="robots" content="[^"]*noindex/);
    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => m[1] ?? "");
    expect(jsonLd.length).toBeGreaterThan(0);
    for (const block of jsonLd) {
      for (const url of block.match(/https?:\/\/[^"\\]+/g) ?? []) {
        if (url.startsWith("https://schema.org")) continue;
        expect(url.startsWith(PUBLIC_URL), `URL no JSON-LD de ${route}: ${url}`).toBe(true);
      }
    }
  }

  const robots = await (await fetch(`${LOCAL}/robots.txt`)).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toContain(`Sitemap: ${PUBLIC_URL}/sitemap.xml`);
  expect(robots).not.toMatch(/localhost/);

  const sitemap = await (await fetch(`${LOCAL}/sitemap.xml`)).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
  expect(locs.length).toBeGreaterThanOrEqual(16);
  for (const loc of locs) expect(loc.startsWith(PUBLIC_URL), loc).toBe(true);

  // Produção sem webhook: erro explícito, nunca "sucesso".
  const quote = await fetch(`${LOCAL}/api/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Maria Teste",
      phone: "(47) 99999-0000",
      email: "maria@example.com",
      consent: true,
      website: "",
    }),
  });
  expect(quote.status).toBe(503);
  expect(await quote.json()).toEqual({ ok: false, error: "delivery_not_configured" });
});
