import { expect, test } from "@playwright/test";
import { ALL_ROUTES, DETAIL_ROUTES, STATIC_ROUTES } from "./helpers";

const BASE_URL = "http://localhost:3100";

test.describe("Metadata por página", () => {
  for (const route of ALL_ROUTES) {
    test(`${route}: title, description, canonical, OG, H1 e headings`, async ({ page }) => {
      await page.goto(route);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title).toContain("FolhaTec");

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);

      // O Next normaliza a URL raiz sem barra final ("https://dominio").
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe(route === "/" ? BASE_URL : `${BASE_URL}${route}`);

      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
      expect(await page.locator('meta[property="og:url"]').getAttribute("content")).toBe(canonical);
      expect(await page.locator('meta[property="og:locale"]').getAttribute("content")).toBe("pt_BR");

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

      // Hierarquia: primeiro heading é o H1 e nenhum nível é pulado.
      const levels = await page
        .locator("main :is(h1, h2, h3, h4, h5, h6)")
        .evaluateAll((els) => els.map((el) => Number(el.tagName.substring(1))));
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i += 1) {
        const previous = levels[i - 1] ?? 1;
        const current = levels[i] ?? 1;
        expect(current - previous, `salto de h${previous} para h${current} em ${route}`).toBeLessThanOrEqual(1);
      }
    });
  }

  test("titles e descriptions são únicos entre páginas", async ({ page }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(titles.get(title), `title duplicado: ${title}`).toBeUndefined();
      expect(descriptions.get(description), `description duplicada em ${route}`).toBeUndefined();
      titles.set(title, route);
      descriptions.set(description, route);
    }
  });

  test("ambiente de desenvolvimento não é indexável", async ({ page }) => {
    await page.goto("/");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(1);
    expect(await robots.getAttribute("content")).toContain("noindex");
  });
});

test.describe("JSON-LD", () => {
  test("Organization na Home sem dados inventados", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const organization = blocks.map((b) => JSON.parse(b) as Record<string, unknown>).find((b) => b["@type"] === "Organization");
    expect(organization).toBeDefined();
    expect(organization?.url).toBe(`${BASE_URL}/`);
    expect(organization?.name).toBe("FolhaTec");
    // Dados institucionais ainda não validados não podem aparecer.
    for (const field of ["telephone", "email", "address", "taxID", "legalName"]) {
      expect(organization?.[field], field).toBeUndefined();
    }
  });

  test("BreadcrumbList com URLs absolutas nas páginas internas", async ({ page }) => {
    await page.goto("/solucoes/etiquetas");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const breadcrumb = blocks
      .map((b) => JSON.parse(b) as { "@type": string; itemListElement?: Array<{ item: string; position: number }> })
      .find((b) => b["@type"] === "BreadcrumbList");
    expect(breadcrumb?.itemListElement?.map((item) => item.item)).toEqual([
      `${BASE_URL}/`,
      `${BASE_URL}/solucoes`,
      `${BASE_URL}/solucoes/etiquetas`,
    ]);
  });

  test("sem Product schema e sem FAQPage quando não há FAQ", async ({ page }) => {
    for (const route of DETAIL_ROUTES) {
      await page.goto(route);
      const html = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("");
      expect(html).not.toContain('"Product"');
      expect(html).not.toContain('"FAQPage"');
    }
  });
});

test.describe("robots.txt e sitemap.xml", () => {
  test("robots.txt bloqueia indexação fora de produção", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toMatch(/Disallow: \/\s*$/m);
    expect(body).not.toMatch(/Sitemap:/i);
  });

  test("sitemap.xml lista páginas estáticas, soluções e segmentos com URLs absolutas", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const route of [...STATIC_ROUTES, ...DETAIL_ROUTES]) {
      const url = route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`;
      expect(xml, route).toContain(`<loc>${url}</loc>`);
    }
    // Sem datas reais no fallback, nenhuma data é inventada.
    expect(xml).not.toContain("<lastmod>");
  });
});
