import { expect, test } from "@playwright/test";
import { expectEvent, getEvents, settle } from "./helpers";

test.describe("Tracking (dataLayer)", () => {
  test("sem IDs configurados, nenhum script GTM/GA4 é carregado", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (request) => {
      if (/googletagmanager|google-analytics/.test(request.url())) thirdParty.push(request.url());
    });
    await page.goto("/");
    await settle(page);
    expect(thirdParty).toEqual([]);
    await expect(page.locator("script[src*='googletagmanager']")).toHaveCount(0);
  });

  test("view_solution ao abrir uma solução (uma vez)", async ({ page }) => {
    await page.goto("/solucoes/etiquetas");
    await expectEvent(page, "view_solution", { solution: "etiquetas" });
    expect(await getEvents(page, "view_solution")).toHaveLength(1);
  });

  test("view_segment ao abrir um segmento", async ({ page }) => {
    await page.goto("/segmentos/logistica");
    await expectEvent(page, "view_segment", { segment: "logistica" });
  });

  test("click_solicitar_cotacao com local e contexto", async ({ page }) => {
    await page.goto("/solucoes/ribbons");
    await page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first().click();
    await expect(page).toHaveURL(/solicitar-cotacao/);
    await expectEvent(page, "click_solicitar_cotacao", { cta_location: "solution_hero", solution: "ribbons" });
  });

  test("click_solicitar_cotacao no header", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/");
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Solicitar cotação" }).click();
    await expectEvent(page, "click_solicitar_cotacao", { cta_location: "header" });
  });

  test("form_start dispara uma única vez na primeira interação", async ({ page }) => {
    await page.goto("/solicitar-cotacao?segmento=quimico");
    expect(await getEvents(page, "form_start")).toHaveLength(0);
    await page.getByLabel("Nome").fill("Maria");
    await page.getByLabel("Empresa").fill("Empresa");
    await expectEvent(page, "form_start", { form: "quote", segment: "quimico" });
    expect(await getEvents(page, "form_start")).toHaveLength(1);
  });

  test("form_submit só após validação client-side", async ({ page }) => {
    await page.goto("/solicitar-cotacao");
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    expect(await getEvents(page, "form_submit")).toHaveLength(0);

    await page.getByLabel("Nome").fill("Maria Teste");
    await page.getByLabel("Telefone / WhatsApp").fill("47999990000");
    await page.getByLabel("E-mail").fill("maria@example.com");
    await page.getByLabel(/Concordo com o tratamento/).check();
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    await expectEvent(page, "form_submit", { form: "quote" });
  });

  test("WhatsApp, telefone e e-mail: eventos testados apenas quando configurados", async ({ page }) => {
    await page.goto("/contato");
    const channels = [
      { selector: "a[href^='https://wa.me/']", event: "click_whatsapp" },
      { selector: "a[href^='tel:']", event: "click_phone" },
      { selector: "a[href^='mailto:']", event: "click_email" },
    ];
    for (const channel of channels) {
      const link = page.locator(`main ${channel.selector}`).first();
      if ((await link.count()) === 0) continue; // canal ainda não configurado — não renderizado
      await link.evaluate((anchor: HTMLAnchorElement) => anchor.addEventListener("click", (e) => e.preventDefault()));
      await link.click();
      await expectEvent(page, channel.event);
    }
    // Sem dados institucionais, a página não pode renderizar links de canal vazios.
    await expect(page.locator("a[href='tel:'], a[href='mailto:']")).toHaveCount(0);
  });
});
