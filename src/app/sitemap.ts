import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/config/env";
import { getArticles, getSegments, getSolutions } from "@/lib/content";

export const revalidate = 300;

const STATIC_PATHS = [
  "/",
  "/empresa",
  "/solucoes",
  "/segmentos",
  "/conteudos",
  "/contato",
  "/solicitar-cotacao",
  "/politica-de-privacidade",
];

/**
 * Gerado a partir do data layer. `lastModified` só é informado quando o
 * conteúdo tem data real (CMS); páginas estáticas não recebem data inventada.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, segments, articles] = await Promise.all([getSolutions(), getSegments(), getArticles()]);

  const entry = (path: string, lastModified?: string | null): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...solutions.filter((item) => !item.seo.noIndex).map((item) => entry(`/solucoes/${item.slug}`, item.updatedAt)),
    ...segments.filter((item) => !item.seo.noIndex).map((item) => entry(`/segmentos/${item.slug}`, item.updatedAt)),
    ...articles
      .filter((item) => !item.seo.noIndex)
      .map((item) => entry(`/conteudos/${item.slug}`, item.updatedAt ?? item.publishedAt)),
  ];
}
