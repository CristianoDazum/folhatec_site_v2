import { expect, test } from "@playwright/test";

/**
 * Animações e microinterações: entrada no scroll, hover (somente em
 * dispositivos com mouse), sombra do header e prefers-reduced-motion.
 */

const opacityOf = (el: Element) => Number(getComputedStyle(el).opacity);

test.describe("Entrada no scroll", () => {
  test.use({ viewport: { width: 1366, height: 800 } });

  test("conteúdo acima da dobra nunca fica oculto; abaixo revela ao rolar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/js-reveal/);

    // Nenhum elemento visível no carregamento fica com opacidade reduzida.
    const hiddenInView = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0 && !el.classList.contains("is-revealed");
      }).length,
    );
    expect(hiddenInView).toBe(0);

    const segmentCard = page.locator("article", { hasText: "Logística e transporte" }).first();
    await expect(segmentCard).not.toHaveClass(/is-revealed/);
    await segmentCard.scrollIntoViewIfNeeded();
    await expect(segmentCard).toHaveClass(/is-revealed/);
    await expect.poll(() => segmentCard.evaluate(opacityOf)).toBe(1);
  });

  test("sem layout shift causado pelas animações (CLS ~ 0)", async ({ page }) => {
    await page.goto("/");
    const cls = await page.evaluate(async () => {
      let total = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!entry.hadRecentInput) total += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      return total;
    });
    expect(cls).toBeLessThan(0.02);
  });
});

test.describe("prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1366, height: 800 } });

  test("nada é ocultado nem animado", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/js-reveal/);
    const minOpacity = await page.evaluate(() =>
      Math.min(...Array.from(document.querySelectorAll("[data-reveal]")).map((el) => Number(getComputedStyle(el).opacity))),
    );
    expect(minOpacity).toBe(1);
  });
});

test.describe("Hover em dispositivos com mouse", () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test("card eleva, filete amarelo aparece e imagem aproxima", async ({ page }) => {
    await page.goto("/solucoes");
    const card = page.locator("article", { hasText: "Ribbons" }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-revealed/);
    const before = await card.evaluate((el) => el.getBoundingClientRect().top);
    await card.hover();
    await expect.poll(() => card.evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(before);
    // Tailwind 4 usa as propriedades CSS `scale`/`translate` (não `transform`).
    const bar = card.locator("span[aria-hidden='true']").first();
    expect(await bar.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^0/);
    await card.hover();
    await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^1( 1)?$/);
    const image = card.locator("svg").first();
    await expect.poll(() => image.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^1\.04/);
  });

  test("seta do CTA se desloca no hover", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first();
    const arrow = cta.locator("svg");
    expect(await arrow.evaluate((el) => getComputedStyle(el).translate)).toBe("none");
    await cta.hover();
    await expect.poll(() => arrow.evaluate((el) => getComputedStyle(el).translate)).not.toBe("none");
  });

  test("header ganha sombra ao rolar", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.site-header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-scrolled", "false");
  });
});

test.describe("Touch (sem hover)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("toque no card não deixa efeito de hover preso e navega", async ({ page }) => {
    await page.goto("/solucoes");
    expect(await page.evaluate(() => window.matchMedia("(hover: hover)").matches)).toBe(false);
    const card = page.locator("article", { hasText: "Etiquetas" }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-revealed/);
    await expect.poll(() => card.evaluate(opacityOf)).toBe(1);
    // Em touch, (hover: hover) é falso: mesmo com o ponteiro sobre o card, o
    // efeito de hover não é aplicado (nada fica "preso" após um toque).
    await card.hover();
    expect(await card.evaluate((el) => getComputedStyle(el).translate)).toBe("none");
    expect(await card.locator("span[aria-hidden='true']").first().evaluate((el) => getComputedStyle(el).scale)).toMatch(/^0/);
    await card.getByRole("link", { name: /Conhecer solução/ }).tap();
    await expect(page).toHaveURL(/\/solucoes\/etiquetas$/);
  });
});
