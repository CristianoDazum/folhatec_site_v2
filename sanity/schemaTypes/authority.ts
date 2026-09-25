import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

/**
 * Provas de autoridade — conectadas ao site, DESATIVADAS por padrão.
 *
 * Um bloco só aparece no site quando:
 * 1. está com "Exibir no site" ativo em `authoritySettings`; e
 * 2. há itens válidos (logos, depoimentos e cases exigem `authorized`).
 * Não há autorização para logos/depoimentos nem validação de números e
 * certificações no lançamento — manter tudo desativado até lá.
 */

const blockSettings = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "enabled", title: "Exibir no site", type: "boolean", initialValue: false }),
      defineField({ name: "title", title: "Título do bloco", type: "string" }),
    ],
  });

export const authoritySettings = defineType({
  name: "authoritySettings",
  title: "Provas de autoridade — exibição",
  type: "document",
  fields: [
    blockSettings("statistics", "Números"),
    blockSettings("clientLogos", "Logos de clientes"),
    blockSettings("testimonials", "Depoimentos"),
    blockSettings("cases", "Cases"),
    blockSettings("certifications", "Certificações"),
  ],
  preview: { prepare: () => ({ title: "Provas de autoridade — exibição" }) },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Depoimento",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Depoimento", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "author", title: "Nome", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Cargo", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({
      name: "authorized",
      title: "Publicação autorizada por escrito",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Resumo", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "segment", title: "Segmento", type: "reference", to: [{ type: "segment" }] }),
    defineField({ name: "solution", title: "Solução", type: "reference", to: [{ type: "solution" }] }),
    imageWithAlt("image", "Imagem"),
    defineField({ name: "authorized", title: "Publicação autorizada", type: "boolean", initialValue: false }),
  ],
});

export const certification = defineType({
  name: "certification",
  title: "Certificação",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Descrição", type: "text" }),
    imageWithAlt("image", "Selo"),
    defineField({ name: "validUntil", title: "Validade", type: "date" }),
  ],
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Logo de cliente",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Empresa", type: "string", validation: (rule) => rule.required() }),
    imageWithAlt("logo", "Logo", true),
    defineField({ name: "url", title: "Site", type: "url" }),
    defineField({
      name: "authorized",
      title: "Uso da marca autorizado contratualmente",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
});

export const statistic = defineType({
  name: "statistic",
  title: "Número",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Valor", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "label", title: "Legenda", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "source", title: "Fonte/validação interna", type: "string" }),
  ],
});

export const authoritySchemaTypes = [authoritySettings, testimonial, caseStudy, certification, clientLogo, statistic];
