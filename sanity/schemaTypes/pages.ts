import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

/**
 * Singletons editoriais de Home e Empresa.
 * Somente textos e imagens — layout, grid e estilos ficam no código.
 * Campo vazio → o site usa o texto aprovado do fallback (títulos/textos)
 * ou oculta a seção (história, estrutura, relacionamento).
 */

const textSection = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
      defineField({ name: "title", title: "Título", type: "string" }),
      defineField({ name: "description", title: "Texto", type: "text", rows: 3 }),
      defineField({ name: "items", title: "Itens", type: "array", of: [defineArrayMember({ type: "labeledValue" })] }),
    ],
  });

const callToAction = defineField({
  name: "finalCta",
  title: "CTA final",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({ name: "description", title: "Texto", type: "text", rows: 2 }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Página inicial",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
        defineField({ name: "title", title: "Headline", type: "string", validation: (rule) => rule.max(120) }),
        defineField({
          name: "highlight",
          title: "Trecho destacado (continuação da headline, em verde)",
          type: "string",
        }),
        defineField({ name: "description", title: "Texto de apoio", type: "text", rows: 3 }),
        defineField({
          name: "highlights",
          title: "Destaques curtos",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.max(4),
        }),
        imageWithAlt("image", "Imagem"),
        defineField({ name: "primaryCtaLabel", title: "Rótulo do CTA principal", type: "string" }),
        defineField({ name: "secondaryCtaLabel", title: "Rótulo do CTA secundário", type: "string" }),
      ],
    }),
    textSection("positioning", "Posicionamento"),
    textSection("solutionsIntro", "Introdução de soluções", "Os cards vêm dos documentos de Solução."),
    defineField({
      name: "applications",
      title: "Aplicações industriais",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "description", title: "Texto", type: "text", rows: 3 }),
        defineField({ name: "items", title: "Itens", type: "array", of: [defineArrayMember({ type: "labeledValue" })] }),
        imageWithAlt("image", "Imagem"),
      ],
    }),
    textSection("segmentsIntro", "Introdução de segmentos", "Os cards vêm dos documentos de Segmento."),
    textSection("differentiators", "Diferenciais / forma de atendimento"),
    callToAction,
  ],
  preview: { prepare: () => ({ title: "Página inicial" }) },
});

export const companyPage = defineType({
  name: "companyPage",
  title: "Página Empresa",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Introdução",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "description", title: "Introdução", type: "text", rows: 3 }),
        imageWithAlt("image", "Imagem"),
      ],
    }),
    defineField({
      name: "history",
      title: "História",
      description: "Somente texto oficial validado. Sem título e parágrafos, a seção fica oculta.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "paragraphs", title: "Parágrafos", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })] }),
      ],
    }),
    textSection("service", "Forma de atendimento"),
    textSection("pillars", "Pilares (conhecimento técnico, qualidade, agilidade…)"),
    textSection("commitment", "Compromisso com qualidade e prazo"),
    textSection("relationship", "Relacionamento", "Sem título, a seção fica oculta."),
    defineField({
      name: "structure",
      title: "Estrutura / operação",
      description: "Sem título, a seção fica oculta. Use apenas dados e fotos reais.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Rótulo superior", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "description", title: "Texto", type: "text", rows: 3 }),
        defineField({ name: "items", title: "Itens", type: "array", of: [defineArrayMember({ type: "labeledValue" })] }),
        defineField({
          name: "images",
          title: "Fotos",
          type: "array",
          of: [
            defineArrayMember({
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Texto alternativo", type: "string", validation: (rule) => rule.required() }),
              ],
            }),
          ],
        }),
      ],
    }),
    callToAction,
  ],
  preview: { prepare: () => ({ title: "Página Empresa" }) },
});
