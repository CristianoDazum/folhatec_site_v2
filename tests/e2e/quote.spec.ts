import { expect, test, type Page } from "@playwright/test";
import { getEvents } from "./helpers";

async function fillValidForm(page: Page) {
  await page.getByLabel("Nome").fill("Maria Teste");
  await page.getByLabel("Empresa").fill("Empresa Teste");
  await page.getByLabel("Telefone / WhatsApp").fill("(47) 99999-0000");
  await page.getByLabel("E-mail").fill("maria@example.com");
  await page.getByLabel("Mensagem").fill("Etiquetas para ambiente refrigerado.");
  await page.getByLabel(/Concordo com o tratamento/).check();
}

test.describe("Fluxos até a cotação", () => {
  test("CTA da Home leva ao formulário", async ({ page }) => {
    await page.goto("/");
    await page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first().click();
    await expect(page).toHaveURL(/\/solicitar-cotacao$/);
    await expect(page.locator("h1")).toHaveText("Solicitar cotação");
    await expect(page.getByTestId("quote-context")).toHaveCount(0);
  });

  test("solução → cotação com contexto amigável", async ({ page }) => {
    await page.goto("/solucoes/etiquetas");
    await page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first().click();
    await expect(page).toHaveURL(/\/solicitar-cotacao\?solucao=etiquetas$/);
    const context = page.getByTestId("quote-context");
    await expect(context).toContainText("Solução: Etiquetas");
  });

  test("segmento → cotação com contexto amigável", async ({ page }) => {
    await page.goto("/segmentos/alimentos");
    await page.locator("main").getByRole("link", { name: "Solicitar cotação" }).first().click();
    await expect(page).toHaveURL(/\/solicitar-cotacao\?segmento=alimentos$/);
    await expect(page.getByTestId("quote-context")).toContainText("Segmento: Alimentos e pescados");
  });

  test("solução + segmento via query string; item removível", async ({ page }) => {
    await page.goto("/solicitar-cotacao?solucao=etiquetas&segmento=alimentos");
    const context = page.getByTestId("quote-context");
    await expect(context).toContainText("Solução: Etiquetas");
    await expect(context).toContainText("Segmento: Alimentos e pescados");
    await page.getByRole("button", { name: "Remover segmento Alimentos e pescados" }).click();
    await expect(context).not.toContainText("Alimentos");
    await expect(context).toContainText("Etiquetas");
  });

  test("contexto desconhecido é ignorado", async ({ page }) => {
    await page.goto("/solicitar-cotacao?solucao=inexistente&segmento=<script>");
    await expect(page.getByTestId("quote-context")).toHaveCount(0);
  });
});

test.describe("Formulário de cotação", () => {
  test("validação client-side com mensagens acessíveis", async ({ page }) => {
    await page.goto("/solicitar-cotacao");
    await page.getByRole("button", { name: "Solicitar cotação" }).click();

    await expect(page.getByText("Informe seu nome.")).toBeVisible();
    await expect(page.getByText("Informe um telefone ou WhatsApp.")).toBeVisible();
    await expect(page.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(page.getByText("É necessário concordar com a Política de Privacidade.")).toBeVisible();
    await expect(page.getByLabel("Nome")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Nome")).toBeFocused();

    await page.getByLabel("Telefone / WhatsApp").fill("123");
    await page.getByLabel("E-mail").fill("email-invalido");
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    await expect(page.getByText("Informe um telefone válido com DDD.")).toBeVisible();
    await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();

    // Nenhum envio aconteceu.
    expect(await getEvents(page, "form_submit")).toHaveLength(0);
  });

  test("stub de desenvolvimento: valida, não envia e NÃO dispara form_success", async ({ page }) => {
    await page.goto("/solicitar-cotacao?solucao=ribbons");
    await fillValidForm(page);
    const responsePromise = page.waitForResponse("**/api/quote");
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(202);
    expect(await response.json()).toEqual({ ok: true, status: "stub" });

    await expect(page.getByTestId("quote-stub-notice")).toBeVisible();
    expect(await getEvents(page, "form_submit")).toHaveLength(1);
    expect(await getEvents(page, "form_success")).toHaveLength(0);
  });

  test("sucesso real (webhook confirmado, mockado) dispara form_success", async ({ page }) => {
    await page.route("**/api/quote", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, status: "delivered" }) }),
    );
    await page.goto("/solicitar-cotacao?solucao=etiquetas&segmento=logistica");
    await fillValidForm(page);
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    await expect(page.getByRole("heading", { name: "Solicitação enviada." })).toBeVisible();
    const success = await getEvents(page, "form_success");
    expect(success).toHaveLength(1);
    expect(success[0]).toMatchObject({ form: "quote", solution: "etiquetas", segment: "logistica" });
  });

  test("double submit envia apenas uma requisição", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/quote", async (route) => {
      requests += 1;
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, status: "stub" }) });
    });
    await page.goto("/solicitar-cotacao");
    await fillValidForm(page);
    const button = page.getByRole("button", { name: "Solicitar cotação" });
    await button.click();
    await expect(page.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    await page.getByRole("button", { name: "Enviando…" }).click({ force: true }).catch(() => undefined);
    await page.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());
    await expect(page.getByTestId("quote-stub-notice")).toBeVisible();
    expect(requests).toBe(1);
    expect(await getEvents(page, "form_submit")).toHaveLength(1);
  });

  test("falha do backend mostra erro e não dispara form_success", async ({ page }) => {
    await page.route("**/api/quote", (route) =>
      route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, error: "delivery_failed" }) }),
    );
    await page.goto("/solicitar-cotacao");
    await fillValidForm(page);
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("Não foi possível enviar");
    expect(await getEvents(page, "form_success")).toHaveLength(0);
    expect(await getEvents(page, "form_error")).toHaveLength(1);
  });

  test("atribuição: first-touch preservado, last-touch atualizado, enviados ao backend", async ({ page }) => {
    const lastCampaign = () =>
      page.evaluate(() => JSON.parse(localStorage.getItem("folhatec:attribution:last") ?? "{}").utm_campaign);

    await page.goto("/?utm_source=google&utm_medium=cpc&utm_campaign=primeira&gclid=abc123");
    await expect.poll(lastCampaign).toBe("primeira");
    await page.goto("/solucoes?utm_source=linkedin&utm_medium=social&utm_campaign=segunda");
    await expect.poll(lastCampaign).toBe("segunda");

    let payload: Record<string, unknown> = {};
    await page.route("**/api/quote", async (route) => {
      payload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, status: "stub" }) });
    });
    await page.goto("/solicitar-cotacao");
    await fillValidForm(page);
    await page.getByRole("button", { name: "Solicitar cotação" }).click();
    await expect(page.getByTestId("quote-stub-notice")).toBeVisible();

    const attribution = payload.attribution as Record<string, Record<string, string> | string>;
    expect(attribution.first_touch).toMatchObject({ utm_source: "google", utm_campaign: "primeira", gclid: "abc123" });
    expect(attribution.last_touch).toMatchObject({ utm_source: "linkedin", utm_campaign: "segunda" });
    expect(attribution.conversion_page).toMatch(/\/solicitar-cotacao$/);
    expect(attribution.origin_url).toMatch(/utm_campaign=primeira/);
    expect(payload.website).toBe("");
  });
});

test.describe("API /api/quote", () => {
  const valid = {
    name: "Maria Teste",
    company: "",
    phone: "(47) 99999-0000",
    email: "maria@example.com",
    message: "",
    consent: true,
    website: "",
  };

  test("aceita payload válido em modo stub", async ({ request }) => {
    const response = await request.post("/api/quote", { data: { ...valid, solution: "etiquetas", segment: "quimico" } });
    expect(response.status()).toBe(202);
    expect(await response.json()).toEqual({ ok: true, status: "stub" });
  });

  test("valida campos no servidor", async ({ request }) => {
    const response = await request.post("/api/quote", {
      data: { ...valid, name: "   ", email: "x", phone: "abc", consent: "true" },
    });
    expect(response.status()).toBe(400);
    const body = (await response.json()) as { error: string; fields: Record<string, string> };
    expect(body.error).toBe("validation");
    expect(Object.keys(body.fields).sort()).toEqual(["consent", "email", "name", "phone"]);
  });

  test("rejeita solução/segmento desconhecidos", async ({ request }) => {
    const unknown = await request.post("/api/quote", { data: { ...valid, solution: "rfid" } });
    expect(unknown.status()).toBe(400);
    expect(await unknown.json()).toEqual({ ok: false, error: "invalid_context" });
    const malformed = await request.post("/api/quote", { data: { ...valid, segment: "<script>" } });
    expect(malformed.status()).toBe(400);
  });

  test("rejeita JSON inválido, tipo errado e corpo grande", async ({ request }) => {
    const invalid = await request.post("/api/quote", { data: "{nope", headers: { "content-type": "application/json" } });
    expect(invalid.status()).toBe(400);
    const array = await request.post("/api/quote", { data: [valid] });
    expect(array.status()).toBe(400);
    const form = await request.post("/api/quote", { form: { name: "x" } });
    expect(form.status()).toBe(415);
    const large = await request.post("/api/quote", { data: { ...valid, message: "x".repeat(20_000) } });
    expect(large.status()).toBe(413);
  });

  test("honeypot: resposta indistinguível de sucesso, sem entrega", async ({ request }) => {
    const response = await request.post("/api/quote", { data: { ...valid, website: "https://spam.example" } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true, status: "delivered" });
  });

  test("apenas POST é aceito", async ({ request }) => {
    const response = await request.get("/api/quote");
    expect(response.status()).toBe(405);
  });
});
