import { fallbackArticles } from "@/data/fallback/articles";
import { fallbackAuthority } from "@/data/fallback/authority";
import { fallbackSegments } from "@/data/fallback/segments";
import { fallbackSiteSettings } from "@/data/fallback/site-settings";
import { fallbackSolutions } from "@/data/fallback/solutions";
import type { ContentProvider } from "./provider";

const byOrder = <T extends { order: number; title: string }>(a: T, b: T) =>
  a.order - b.order || a.title.localeCompare(b.title, "pt-BR");

/** Conteúdo local tipado — usado sem credenciais do Sanity. */
export const fallbackProvider: ContentProvider = {
  name: "fallback",
  async getSiteSettings() {
    return fallbackSiteSettings;
  },
  async getSolutions() {
    return [...fallbackSolutions].sort(byOrder);
  },
  async getSegments() {
    return [...fallbackSegments].sort(byOrder);
  },
  async getArticles() {
    return [...fallbackArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  async getArticleBySlug(slug) {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  },
  async getAuthority() {
    return fallbackAuthority;
  },
};
