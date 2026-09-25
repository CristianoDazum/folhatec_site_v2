import { defineArrayMember, defineField, defineType } from "sanity";
import {
  VISUAL_OPTIONS,
  faqReferences,
  imageWithAlt,
  labeledList,
  orderField,
  whatsappMessageField,
} from "./shared";

export const segment = defineType({
  name: "segment",
  title: "Segmento",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Descrição curta (cards e hero)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({ name: "description", title: "Contexto da indústria", type: "text", rows: 5 }),
    imageWithAlt("image", "Imagem principal"),
    defineField({
      name: "visual",
      title: "Composição visual (sem foto)",
      type: "string",
      options: { list: VISUAL_OPTIONS },
      initialValue: "industry",
    }),
    labeledList("challenges", "Desafios de identificação"),
    labeledList("applications", "Aplicações frequentes"),
    defineField({
      name: "relatedSolutions",
      title: "Soluções relacionadas",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "solution" }] })],
    }),
    labeledList("differentiators", "Diferenciais"),
    faqReferences,
    whatsappMessageField,
    orderField,
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Ordem", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "shortDescription", media: "image" } },
});
