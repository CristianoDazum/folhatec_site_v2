import { defineArrayMember, defineField, defineType } from "sanity";
import {
  VISUAL_OPTIONS,
  faqReferences,
  imageWithAlt,
  labeledList,
  orderField,
  whatsappMessageField,
} from "./shared";

export const solution = defineType({
  name: "solution",
  title: "Solução",
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
    defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
    defineField({
      name: "shortDescription",
      title: "Descrição curta (cards e hero)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({ name: "description", title: "Descrição completa", type: "text", rows: 5 }),
    imageWithAlt("image", "Imagem principal"),
    defineField({
      name: "visual",
      title: "Composição visual (sem foto)",
      type: "string",
      options: { list: VISUAL_OPTIONS },
      initialValue: "labels",
    }),
    labeledList("applications", "Aplicações", "Para que serve, onde é utilizada, que problema resolve."),
    labeledList(
      "technicalOptions",
      "Possibilidades técnicas",
      "Somente dados validados: material, adesivo, resistência, dimensões, acabamento, temperatura etc.",
    ),
    defineField({
      name: "relatedSegments",
      title: "Segmentos relacionados",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "segment" }] })],
    }),
    labeledList("differentiators", "Diferencial FolhaTec"),
    faqReferences,
    whatsappMessageField,
    orderField,
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Ordem", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "shortDescription", media: "image" } },
});
