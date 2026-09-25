import { expect, test } from "@playwright/test";
import { ALL_ROUTES, FORBIDDEN_TEXT, settle, watchPageErrors } from "./helpers";

test.describe("Rotas públicas", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} responde 200, sem erros e sem texto proibido`, async ({ page }) => {
      const errors = watchPageErrors(page);
      const response = await page.goto(route);
      expect(response?.status(), `status de ${route}`).toBe(200);
      await settle(page);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header nav[aria-label='Navegação principal']")).toHaveCount(1);
      await expect(page.locator("footer")).toBeVisible();

      const text = await page.locator("body").innerText();
      for (const pattern of FORBIDDEN_TEXT) {
        expect(text, `texto proibido ${pattern} em ${route}`).not.toMatch(pattern);
      }

      expect(errors, `erros de console/página em ${route}`).toEqual([]);
    });
  }

  for (const route of ["/rota-inexistente", "/solucoes/inexistente", "/segmentos/inexistente", "/conteudos/inexistente"]) {
    test(`${route} retorna 404 real com página personalizada`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText("Página não encontrada.");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Ir para a página inicial" })).toBeVisible();
      // Exatamente uma meta robots, com noindex.
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveCount(1);
      expect(await robots.getAttribute("content")).toContain("noindex");
    });
  }

  test("/conteudos exibe estado vazio profissional", async ({ page }) => {
    await page.goto("/conteudos");
    await expect(page.getByRole("heading", { name: "Novos conteúdos em breve." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Solicitar cotação/ }).first()).toBeVisible();
  });
});

test.describe("Links internos", () => {
  test("todos os links internos das páginas principais respondem sem erro", async ({ page, request }) => {
    test.setTimeout(120_000);
    const hrefs = new Set<string>();
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const links = await page.locator("a[href^='/']").evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
      );
      for (const href of links) hrefs.add(href.split("#")[0] ?? href);
    }

    expect(hrefs.size).toBeGreaterThan(10);
    const broken: string[] = [];
    for (const href of hrefs) {
      const response = await request.get(href || "/");
      if (response.status() >= 400) broken.push(`${href} → ${response.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test("nenhum link externo quebrado (wa.me/tel/mailto) é renderizado sem dados", async ({ page }) => {
    for (const route of ["/", "/contato", "/solicitar-cotacao", "/solucoes/etiquetas"]) {
      await page.goto(route);
      const hrefs = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        expect(href).not.toMatch(/^(tel:|mailto:)$/);
        expect(href).not.toMatch(/wa\.me\/(\?|$)/);
        expect(href).not.toContain("undefined");
        expect(href).not.toContain("null");
      }
    }
  });
});
