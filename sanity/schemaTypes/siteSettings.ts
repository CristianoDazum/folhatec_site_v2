import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./shared";

/**
 * Configurações institucionais (singleton). Fonte única para Header,
 * Footer, Contato, formulário, JSON-LD e WhatsApp.
 * Preencher somente com dados confirmados pela FolhaTec.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configurações do site",
  type: "document",
  groups: [
    { name: "company", title: "Empresa", default: true },
    { name: "contact", title: "Contato" },
    { name: "social", title: "Redes sociais" },
  ],
  fields: [
    defineField({ name: "name", title: "Nome fantasia", type: "string", group: "company", validation: (rule) => rule.required() }),
    defineField({ name: "legalName", title: "Razão social", type: "string", group: "company" }),
    defineField({
      name: "cnpj",
      title: "CNPJ",
      type: "string",
      group: "company",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value) ? true : "Use o formato 00.000.000/0000-00",
        ),
    }),
    defineField({ name: "tagline", title: "Slogan curto", type: "string", group: "company" }),
    defineField({
      name: "description",
      title: "Descrição institucional (SEO / rodapé)",
      type: "text",
      rows: 3,
      group: "company",
      validation: (rule) => rule.max(200),
    }),
    { ...imageWithAlt("logo", "Logo"), group: "company" },
    defineField({ name: "phone", title: "Telefone (exibição)", type: "string", group: "contact" }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (DDI + DDD + número, apenas dígitos)",
      type: "string",
      group: "contact",
      description: "Ex.: 5547999990000",
      validation: (rule) =>
        rule.custom((value) => (!value || /^\d{12,13}$/.test(value) ? true : "Use apenas dígitos: 55 + DDD + número")),
    }),
    defineField({ name: "email", title: "E-mail comercial", type: "string", group: "contact", validation: (rule) => rule.email() }),
    defineField({
      name: "address",
      title: "Endereço",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "street", title: "Logradouro e número", type: "string" }),
        defineField({ name: "city", title: "Cidade", type: "string" }),
        defineField({ name: "state", title: "UF", type: "string", validation: (rule) => rule.length(2) }),
        defineField({ name: "postalCode", title: "CEP", type: "string" }),
        defineField({ name: "country", title: "País", type: "string", initialValue: "BR" }),
      ],
    }),
    defineField({ name: "businessHours", title: "Horário de atendimento", type: "string", group: "contact" }),
    defineField({
      name: "showFloatingWhatsApp",
      title: "Exibir botão flutuante de WhatsApp",
      type: "boolean",
      group: "contact",
      initialValue: false,
    }),
    defineField({
      name: "socialLinks",
      title: "Redes sociais",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Rede", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["https"] }),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Configurações do site" }) },
});
