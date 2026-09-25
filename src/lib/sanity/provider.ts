import type { ContentProvider } from "@/lib/content/provider";
import { fallbackSiteSettings } from "@/data/fallback/site-settings";
import { fallbackAuthority } from "@/data/fallback/authority";
import { sanityFetch } from "./client";
import {
  compact,
  normalizeArticle,
  normalizeSegment,
  normalizeSiteSettings,
  normalizeSolution,
} from "./normalize";
import {
  articleBySlugQuery,
  articlesQuery,
  segmentsQuery,
  siteSettingsQuery,
  solutionsQuery,
} from "./queries";
import type { RawArticle, RawSegment, RawSiteSettings, RawSolution } from "./types";

/**
 * Provider Sanity. Só é usado quando o projeto está configurado.
 * Retorna sempre tipos normalizados do frontend.
 */
export const sanityProvider: ContentProvider = {
  name: "sanity",

  async getSiteSettings() {
    const raw = await sanityFetch<RawSiteSettings | null>(siteSettingsQuery, {}, ["siteSettings"]);
    return normalizeSiteSettings(raw, fallbackSiteSettings);
  },

  async getSolutions() {
    const raw = await sanityFetch<RawSolution[] | null>(solutionsQuery, {}, ["solution"]);
    return compact((raw ?? []).map(normalizeSolution));
  },

  async getSegments() {
    const raw = await sanityFetch<RawSegment[] | null>(segmentsQuery, {}, ["segment"]);
    return compact((raw ?? []).map(normalizeSegment));
  },

  async getArticles() {
    const raw = await sanityFetch<RawArticle[] | null>(articlesQuery, {}, ["article"]);
    return compact((raw ?? []).map((item) => normalizeArticle(item, false)));
  },

  async getArticleBySlug(slug) {
    const raw = await sanityFetch<RawArticle | null>(articleBySlugQuery, { slug }, ["article"]);
    return raw ? normalizeArticle(raw, true) : null;
  },

  // Provas de autoridade ainda não publicadas no CMS (schemas preparados e
  // desativados). Mantém o fallback, que está todo com enabled: false.
  async getAuthority() {
    return fallbackAuthority;
  },
};
