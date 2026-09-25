import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

/**
 * Provas de autoridade — PREPARADAS E DESATIVADAS.
 *
 * Não estão registradas em `schemaTypes/index.ts` porque não há autorização
 * para logos/depoimentos nem validação de números/certificações.
 * Para ativar: adicionar a `authoritySchemaTypes` em index.ts, implementar a
 * query/normalização em src/lib/sanity e mudar `getAuthority` no provider.
 */

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

export const authoritySchemaTypes = [testimonial, caseStudy, certification, clientLogo, statistic];
