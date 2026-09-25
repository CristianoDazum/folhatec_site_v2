import { defineField, defineType } from "sanity";

/** Pergunta reutilizável — referenciada por soluções, segmentos e artigos. */
export const faq = defineType({
  name: "faq",
  title: "Pergunta frequente",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Pergunta", type: "string", validation: (rule) => rule.required().max(160) }),
    defineField({ name: "answer", title: "Resposta", type: "text", rows: 5, validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});
