import { defineArrayMember, defineField, defineType } from "sanity";

/** Mesmas chaves de `VISUAL_KEYS` em src/lib/content/constants.ts. */
export const VISUAL_OPTIONS = [
  { title: "Etiquetas", value: "labels" },
  { title: "Ribbons", value: "ribbons" },
  { title: "Equipamentos", value: "equipment" },
  { title: "Solução especial", value: "special" },
  { title: "Alimentos", value: "food" },
  { title: "Logística", value: "logistics" },
  { title: "Químico", value: "chemical" },
  { title: "Indústria", value: "industry" },
];

/** Imagem com texto alternativo obrigatório. */
export const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Texto alternativo",
        type: "string",
        description: "Descreva a imagem para leitores de tela e SEO.",
        validation: (rule) => rule.required().max(160),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });

export const labeledValue = defineType({
  name: "labeledValue",
  title: "Item",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Título", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "description", title: "Descrição", type: "text", rows: 2, validation: (rule) => rule.max(240) }),
  ],
  preview: { select: { title: "label", subtitle: "description" } },
});

export const labeledList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "labeledValue" })],
  });

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Title (SEO)",
      type: "string",
      description: "Até ~60 caracteres. O sufixo “| FolhaTec” é adicionado automaticamente.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(170),
    }),
    imageWithAlt("ogImage", "Imagem Open Graph (1200×630)"),
    defineField({ name: "noIndex", title: "Ocultar dos buscadores (noindex)", type: "boolean", initialValue: false }),
  ],
});

export const faqReferences = defineField({
  name: "faq",
  title: "Perguntas frequentes",
  type: "array",
  of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
});

export const orderField = defineField({
  name: "order",
  title: "Ordem de exibição",
  type: "number",
  initialValue: 10,
});

export const whatsappMessageField = defineField({
  name: "whatsappMessage",
  title: "Mensagem pré-preenchida do WhatsApp",
  type: "string",
  description: "Ex.: “Olá, vim pelo site da FolhaTec e gostaria de falar sobre etiquetas.”",
  validation: (rule) => rule.max(200),
});
