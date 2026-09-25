import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_ROUTES, settle } from "./helpers";

/** Acessibilidade básica automatizada (WCAG 2.x A/AA via axe-core). */
for (const viewport of [
  { name: "desktop", width: 1366, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`axe — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ALL_ROUTES) {
      test(route, async ({ page }) => {
        await page.goto(route);
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`,
        );
        expect(summary).toEqual([]);
      });
    }
  });
}

test("formulário: todos os campos possuem rótulo e erros associados", async ({ page }) => {
  await page.goto("/solicitar-cotacao");
  await page.getByRole("button", { name: "Solicitar cotação" }).click();
  const results = await new AxeBuilder({ page }).include("form").analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
  const describedBy = await page.getByLabel("E-mail").getAttribute("aria-describedby");
  expect(describedBy).toContain("quote-email-error");
});

test("menu mobile aberto é acessível", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const results = await new AxeBuilder({ page }).include("header").analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
