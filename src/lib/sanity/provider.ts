import type { ContentProvider } from "@/lib/content/provider";
import { fallbackSiteSettings } from "@/data/fallback/site-settings";
import { fallbackCompanyContent, fallbackHomeContent } from "@/data/fallback/pages";
import { sanityFetch } from "./client";
import {
  compact,
  normalizeArticle,
  normalizeAuthority,
  normalizeCompanyPage,
  normalizeHomePage,
  normalizeSegment,
  normalizeSiteSettings,
  normalizeSolution,
} from "./normalize";
import {
  articleBySlugQuery,
  articlesQuery,
  authorityQuery,
  companyPageQuery,
  homePageQuery,
  segmentsQuery,
  siteSettingsQuery,
  solutionsQuery,
} from "./queries";
import type {
  RawArticle,
  RawAuthority,
  RawCompanyPage,
  RawHomePage,
  RawSegment,
  RawSiteSettings,
  RawSolution,
} from "./types";

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

  async getAuthority() {
    const raw = await sanityFetch<RawAuthority | null>(authorityQuery, {}, [
      "authoritySettings",
      "clientLogo",
      "testimonial",
      "caseStudy",
      "statistic",
      "certification",
    ]);
    return normalizeAuthority(raw);
  },

  // Singletons: documento ausente no CMS → textos aprovados do fallback.
  async getHomeContent() {
    const raw = await sanityFetch<RawHomePage | null>(homePageQuery, {}, ["homePage"]);
    return normalizeHomePage(raw, fallbackHomeContent);
  },

  async getCompanyContent() {
    const raw = await sanityFetch<RawCompanyPage | null>(companyPageQuery, {}, ["companyPage"]);
    return normalizeCompanyPage(raw, fallbackCompanyContent);
  },
};
