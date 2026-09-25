/**
 * Testes unitários (sem navegador) da configuração de URL e da normalização
 * de Home, Empresa e Authority vindas do Sanity.
 */
import { expect, test } from "@playwright/test";
import { fallbackAuthority } from "../../src/data/fallback/authority";
import { fallbackCompanyContent, fallbackHomeContent } from "../../src/data/fallback/pages";
import { isLocalHostname, resolveSiteUrl } from "../../src/lib/config/env";
import { normalizeAuthority, normalizeCompanyPage, normalizeHomePage } from "../../src/lib/sanity/normalize";

test.describe("NEXT_PUBLIC_SITE_URL", () => {
  test("production exige URL pública https válida", () => {
    const invalid = [
      undefined,
      "",
      "   ",
      "nao-e-url",
      "http://www.folhatec.com.br",
      "https://localhost",
      "https://localhost:3000",
      "https://127.0.0.1",
      "https://127.0.0.2:8080",
      "https://0.0.0.0",
      "https://[::1]",
      "https://site.localhost",
    ];
    for (const value of invalid) {
      expect(() => resolveSiteUrl(value, "production"), `valor ${JSON.stringify(value)}`).toThrow(
        /NEXT_PUBLIC_SITE_URL/,
      );
    }
  });

  test("production aceita URL pública e normaliza para a origem", () => {
    expect(resolveSiteUrl("https://www.folhatec.com.br", "production")).toBe("https://www.folhatec.com.br");
    expect(resolveSiteUrl(" https://www.folhatec.com.br/ ", "production")).toBe("https://www.folhatec.com.br");
    expect(resolveSiteUrl("https://www.folhatec.com.br/qualquer/caminho", "production")).toBe(
      "https://www.folhatec.com.br",
    );
  });

  test("development e staging usam localhost quando a URL falta ou é inválida", () => {
    for (const env of ["development", "staging"] as const) {
      expect(resolveSiteUrl(undefined, env)).toBe("http://localhost:3000");
      expect(resolveSiteUrl("nao-e-url", env)).toBe("http://localhost:3000");
      expect(resolveSiteUrl("https://staging.folhatec.com.br", env)).toBe("https://staging.folhatec.com.br");
    }
  });

  test("detecção de hosts locais", () => {
    for (const host of ["localhost", "LOCALHOST", "app.localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"]) {
      expect(isLocalHostname(host), host).toBe(true);
    }
    for (const host of ["www.folhatec.com.br", "folhatec.vercel.app", "10.0.0.1.example.com"]) {
      expect(isLocalHostname(host), host).toBe(false);
    }
  });
});

test.describe("Home (normalização Sanity → fallback)", () => {
  test("sem documento no CMS usa o fallback completo", () => {
    expect(normalizeHomePage(null, fallbackHomeContent)).toEqual(fallbackHomeContent);
  });

  test("campos do CMS substituem o fallback; vazios mantêm o texto aprovado", () => {
    const home = normalizeHomePage(
      {
        hero: {
          title: "Headline do CMS",
          description: "   ",
          primaryCtaLabel: "Pedir orçamento técnico",
          image: { url: "https://cdn.sanity.io/x.jpg", width: 1200, height: 900, alt: "Bobinas" },
        },
        positioning: { title: "Posicionamento do CMS", items: [] },
      },
      fallbackHomeContent,
    );
    expect(home.hero.title).toBe("Headline do CMS");
    expect(home.hero.highlight).toBeNull(); // destaque do fallback não acompanha outro título
    expect(home.hero.description).toBe(fallbackHomeContent.hero.description);
    expect(home.hero.primaryCtaLabel).toBe("Pedir orçamento técnico");
    expect(home.hero.secondaryCtaLabel).toBe(fallbackHomeContent.hero.secondaryCtaLabel);
    expect(home.hero.image).toMatchObject({ url: "https://cdn.sanity.io/x.jpg", alt: "Bobinas" });
    expect(home.positioning.title).toBe("Posicionamento do CMS");
    expect(home.positioning.items).toEqual(fallbackHomeContent.positioning.items);
    expect(home.finalCta).toEqual(fallbackHomeContent.finalCta);
  });
});

test.describe("Empresa (normalização Sanity → fallback)", () => {
  test("sem documento no CMS usa o fallback, com história e estrutura ocultas", () => {
    const company = normalizeCompanyPage(null, fallbackCompanyContent);
    expect(company).toEqual(fallbackCompanyContent);
    expect(company.history).toBeNull();
    expect(company.structure).toBeNull();
  });

  test("história e estrutura só existem com conteúdo real do CMS", () => {
    const empty = normalizeCompanyPage(
      { history: { title: "Nossa história", paragraphs: [] }, structure: { title: "  " } },
      fallbackCompanyContent,
    );
    expect(empty.history).toBeNull();
    expect(empty.structure).toBeNull();

    const filled = normalizeCompanyPage(
      {
        history: { title: "Nossa história", paragraphs: ["Parágrafo validado.", null, " "] },
        structure: { title: "Estrutura", images: [{ url: "https://cdn.sanity.io/y.jpg", width: 10, height: 10, alt: "" }] },
      },
      fallbackCompanyContent,
    );
    expect(filled.history).toEqual({ title: "Nossa história", paragraphs: ["Parágrafo validado."] });
    expect(filled.structure?.images).toHaveLength(1);
  });
});

test.describe("Authority (normalização)", () => {
  test("fallback e CMS vazio: tudo desativado", () => {
    for (const block of Object.values(fallbackAuthority)) expect(block.enabled).toBe(false);
    for (const block of Object.values(normalizeAuthority(null))) {
      expect(block.enabled).toBe(false);
      expect(block.items).toEqual([]);
    }
  });

  test("itens cadastrados não habilitam o bloco sozinhos", () => {
    const authority = normalizeAuthority({
      settings: { statistics: { enabled: false } },
      statistics: [{ value: "100", label: "Exemplo" }],
    });
    expect(authority.statistics.enabled).toBe(false);
  });

  test("bloco habilitado descarta itens inválidos e certificações vencidas", () => {
    const authority = normalizeAuthority(
      {
        settings: { testimonials: { enabled: true, title: "Depoimentos" }, certifications: { enabled: true } },
        testimonials: [{ quote: "Texto", author: "Pessoa" }, { quote: "Sem autor" }],
        certifications: [
          { name: "Vigente", validUntil: "2030-01-01" },
          { name: "Vencida", validUntil: "2020-01-01" },
          { name: "Sem validade" },
        ],
      },
      new Date("2026-09-25T00:00:00Z"),
    );
    expect(authority.testimonials).toMatchObject({ enabled: true, title: "Depoimentos" });
    expect(authority.testimonials.items).toHaveLength(1);
    expect(authority.certifications.items.map((item) => item.name)).toEqual(["Vigente", "Sem validade"]);
  });
});
