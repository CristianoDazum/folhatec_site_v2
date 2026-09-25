import { defineArrayMember, defineField, defineType } from "sanity";
import { faqReferences, imageWithAlt } from "./shared";

/** Mesmas categorias de ARTICLE_CATEGORIES em src/lib/content/constants.ts. */
const CATEGORY_OPTIONS = [
  { title: "Etiquetas", value: "etiquetas" },
  { title: "Materiais", value: "materiais" },
  { title: "Aplicações", value: "aplicacoes" },
  { title: "Impressão", value: "impressao" },
  { title: "Ribbons", value: "ribbons" },
  { title: "Equipamentos", value: "equipamentos" },
  { title: "Dicas técnicas", value: "dicas-tecnicas" },
  { title: "Notícias", value: "noticias" },
];

export const article = defineType({
  name: "article",
  title: "Conteúdo / Artigo",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumo",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({ name: "category", title: "Categoria", type: "string", options: { list: CATEGORY_OPTIONS } }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      description: "O artigo só aparece no site a partir desta data.",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("image", "Imagem de capa"),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Parágrafo", value: "normal" },
            { title: "Título (H2)", value: "h2" },
            { title: "Subtítulo (H3)", value: "h3" },
            { title: "Citação", value: "blockquote" },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texto alternativo", type: "string", validation: (rule) => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: "author", title: "Autor (opcional)", type: "string" }),
    faqReferences,
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Mais recentes", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
