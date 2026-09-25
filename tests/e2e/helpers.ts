import { expect, type Page } from "@playwright/test";

export const STATIC_ROUTES = [
  "/",
  "/empresa",
  "/solucoes",
  "/segmentos",
  "/conteudos",
  "/contato",
  "/solicitar-cotacao",
  "/politica-de-privacidade",
] as const;

export const SOLUTION_SLUGS = ["etiquetas", "ribbons", "equipamentos", "solucoes-especiais"] as const;
export const SEGMENT_SLUGS = ["alimentos", "logistica", "quimico", "industria"] as const;

export const DETAIL_ROUTES = [
  ...SOLUTION_SLUGS.map((slug) => `/solucoes/${slug}`),
  ...SEGMENT_SLUGS.map((slug) => `/segmentos/${slug}`),
];

export const ALL_ROUTES = [...STATIC_ROUTES, ...DETAIL_ROUTES];

/** Textos que nunca podem aparecer no conteúdo visível. */
export const FORBIDDEN_TEXT = [/\bTODO\b/, /lorem ipsum/i, /\bundefined\b/, /\bnull\b/, /\bNaN\b/, /PLACEHOLDER/i];

/**
 * Aguarda carregamento, fontes e animações de entrada (.reveal) — mede o
 * estado final que o usuário vê. Não usa "networkidle": o prefetch de links
 * do Next mantém requisições em segundo plano.
 */
export async function settle(page: Page) {
  await page.waitForLoadState("load");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
  });
}

export interface DataLayerEntry {
  event?: string;
  [key: string]: unknown;
}

export async function getDataLayer(page: Page): Promise<DataLayerEntry[]> {
  return page.evaluate(() => (window.dataLayer ?? []) as DataLayerEntry[]);
}

export async function getEvents(page: Page, name: string): Promise<DataLayerEntry[]> {
  const layer = await getDataLayer(page);
  return layer.filter((entry) => entry.event === name);
}

export async function expectEvent(page: Page, name: string, match: Record<string, unknown> = {}) {
  await expect
    .poll(async () => (await getEvents(page, name)).some((entry) => Object.entries(match).every(([k, v]) => entry[k] === v)), {
      message: `evento ${name} ${JSON.stringify(match)} no dataLayer`,
    })
    .toBe(true);
}

/** Coleta console.error e pageerror durante o teste. */
export function watchPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

/**
 * Mede overflow horizontal e, se houver, identifica os elementos que
 * ultrapassam a viewport (para corrigir a causa, não mascarar).
 */
export async function measureOverflow(page: Page) {
  return page.evaluate(() => {
    const viewport = window.innerWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const offenders: string[] = [];
    if (scrollWidth > viewport + 1) {
      for (const element of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && (rect.right > viewport + 1 || rect.left < -1)) {
          const id = element.id ? `#${element.id}` : "";
          const classes = typeof element.className === "string" ? `.${element.className.split(/\s+/).slice(0, 4).join(".")}` : "";
          offenders.push(`${element.tagName.toLowerCase()}${id}${classes} [${Math.round(rect.left)}→${Math.round(rect.right)}]`);
        }
        if (offenders.length >= 8) break;
      }
    }
    return { viewport, scrollWidth, offenders };
  });
}
