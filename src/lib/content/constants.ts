import type { ArticleCategory, VisualKey } from "@/types/content";

/** Categorias de conteúdo previstas no briefing (seção 14). */
export const ARTICLE_CATEGORIES: readonly ArticleCategory[] = [
  { slug: "etiquetas", title: "Etiquetas" },
  { slug: "materiais", title: "Materiais" },
  { slug: "aplicacoes", title: "Aplicações" },
  { slug: "impressao", title: "Impressão" },
  { slug: "ribbons", title: "Ribbons" },
  { slug: "equipamentos", title: "Equipamentos" },
  { slug: "dicas-tecnicas", title: "Dicas técnicas" },
  { slug: "noticias", title: "Notícias" },
];

export const VISUAL_KEYS: readonly VisualKey[] = [
  "labels",
  "ribbons",
  "equipment",
  "special",
  "food",
  "logistics",
  "chemical",
  "industry",
];

export function isVisualKey(value: unknown): value is VisualKey {
  return typeof value === "string" && (VISUAL_KEYS as readonly string[]).includes(value);
}
