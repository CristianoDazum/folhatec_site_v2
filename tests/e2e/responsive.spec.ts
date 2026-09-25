import { expect, test } from "@playwright/test";
import { ALL_ROUTES, measureOverflow, settle } from "./helpers";

/**
 * Overflow horizontal: scrollWidth do documento não pode exceder a
 * viewport (tolerância de 1px). Em caso de falha, a mensagem lista os
 * elementos que ultrapassam a viewport para corrigir a causa real.
 */
const PAGE_VIEWPORTS = [390, 768, 1440];
const HOME_EXTRA_VIEWPORTS = [360, 430, 1024, 1366, 1920];

for (const width of PAGE_VIEWPORTS) {
  test.describe(`Sem overflow horizontal em ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of [...ALL_ROUTES, "/rota-inexistente"]) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await settle(page);
        const { viewport, scrollWidth, offenders } = await measureOverflow(page);
        expect(scrollWidth, `overflow em ${route} @${width}px: ${offenders.join(", ")}`).toBeLessThanOrEqual(viewport + 1);
      });
    }
  });
}

for (const width of HOME_EXTRA_VIEWPORTS) {
  test(`Home sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await settle(page);
    const { viewport, scrollWidth, offenders } = await measureOverflow(page);
    expect(scrollWidth, `overflow na Home @${width}px: ${offenders.join(", ")}`).toBeLessThanOrEqual(viewport + 1);
  });
}

test.describe("Mobile 360px", () => {
  test.use({ viewport: { width: 360, height: 780 }, hasTouch: true });

  test("menu mobile aberto não gera overflow", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const { viewport, scrollWidth, offenders } = await measureOverflow(page);
    expect(scrollWidth, offenders.join(", ")).toBeLessThanOrEqual(viewport + 1);
  });

  test("formulário e contexto cabem na tela", async ({ page }) => {
    await page.goto("/solicitar-cotacao?solucao=solucoes-especiais&segmento=alimentos");
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    const { viewport, scrollWidth, offenders } = await measureOverflow(page);
    expect(scrollWidth, offenders.join(", ")).toBeLessThanOrEqual(viewport + 1);
  });

  test("header mobile: CTA compacto oculto abaixo de 640px, sem quebra de linha", async ({ page }) => {
    await page.goto("/");
    const visibleHeaderCtas = page.locator("header").getByRole("link", { name: "Solicitar cotação" }).filter({ visible: true });
    await expect(visibleHeaderCtas).toHaveCount(0);
    const headerHeight = await page.locator("header").evaluate((el) => el.getBoundingClientRect().height);
    expect(headerHeight).toBeLessThanOrEqual(73);
  });

  test("CTA principal visível na primeira dobra", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first()).toBeInViewport();
  });
});
