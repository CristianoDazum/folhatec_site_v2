/**
 * Data layer — ÚNICA porta de entrada de conteúdo para páginas e componentes.
 *
 *   Página → data layer (este arquivo) → provider → Sanity (se configurado)
 *                                                  → fallback local tipado
 *
 * Páginas nunca sabem de onde o conteúdo veio.
 */
import { cache } from "react";
import { SITE_ENV } from "@/lib/config/env";
import { fallbackCompanyContent, fallbackHomeContent } from "@/data/fallback/pages";
import { fallbackPrivacyPolicy } from "@/data/fallback/privacy-policy";
import { isSanityConfigured } from "@/lib/sanity/config";
import { sanityProvider } from "@/lib/sanity/provider";
import type {
  Article,
  AuthorityContent,
  CompanyContent,
  HomeContent,
  PrivacyPolicyContent,
  Segment,
  SiteSettings,
  Solution,
} from "@/types/content";
import { fallbackProvider } from "./fallback-provider";
import type { ContentProvider } from "./provider";

const provider: ContentProvider = isSanityConfigured ? sanityProvider : fallbackProvider;

/**
 * Falha do CMS:
 * - produção: o erro é propagado (não publicar conteúdo de desenvolvimento
 *   silenciosamente; o ISR mantém a última versão válida);
 * - development/staging: registra o erro e usa o fallback local.
 */
async function load<T>(label: string, read: (source: ContentProvider) => Promise<T>): Promise<T> {
  if (provider === fallbackProvider) return read(fallbackProvider);
  try {
    return await read(provider);
  } catch (error) {
    if (SITE_ENV === "production") throw error;
    console.error(`[content] Falha ao carregar "${label}" do CMS; usando fallback local.`, error);
    return read(fallbackProvider);
  }
}

export const getContentSource = (): ContentProvider["name"] => provider.name;

export const getSiteSettings = cache(
  (): Promise<SiteSettings> => load("siteSettings", (source) => source.getSiteSettings()),
);

export const getSolutions = cache(
  (): Promise<Solution[]> => load("solutions", (source) => source.getSolutions()),
);

export const getSolutionBySlug = cache(async (slug: string): Promise<Solution | null> => {
  const solutions = await getSolutions();
  return solutions.find((solution) => solution.slug === slug) ?? null;
});

export const getSegments = cache(
  (): Promise<Segment[]> => load("segments", (source) => source.getSegments()),
);

export const getSegmentBySlug = cache(async (slug: string): Promise<Segment | null> => {
  const segments = await getSegments();
  return segments.find((segment) => segment.slug === slug) ?? null;
});

export const getArticles = cache(
  (): Promise<Article[]> => load("articles", (source) => source.getArticles()),
);

export const getArticleBySlug = cache(
  (slug: string): Promise<Article | null> =>
    load(`article:${slug}`, (source) => source.getArticleBySlug(slug)),
);

export const getAuthority = cache(
  (): Promise<AuthorityContent> => load("authority", (source) => source.getAuthority()),
);

/*
 * Textos estruturais de página. Hoje vêm do fallback; ao criar os singletons
 * correspondentes no CMS, basta trocar a implementação aqui — as páginas não
 * mudam.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => fallbackHomeContent);

export const getCompanyContent = cache(async (): Promise<CompanyContent> => fallbackCompanyContent);

export const getPrivacyPolicy = cache(
  async (): Promise<PrivacyPolicyContent> => fallbackPrivacyPolicy,
);

/** Resolve slugs relacionados preservando a ordem do CMS e ignorando órfãos. */
export function pickBySlugs<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  return slugs.flatMap((slug) => items.filter((item) => item.slug === slug));
}
