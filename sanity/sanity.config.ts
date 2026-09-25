import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

/** Documentos únicos: editados por ID fixo, sem "criar novo"/"excluir". */
const SINGLETONS = new Set(["siteSettings", "homePage", "companyPage", "authoritySettings"]);

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export default defineConfig({
  name: "folhatec",
  title: "FolhaTec",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Conteúdo")
          .items([
            singleton(S, "siteSettings", "Configurações do site"),
            singleton(S, "homePage", "Página inicial"),
            singleton(S, "companyPage", "Página Empresa"),
            S.divider(),
            S.documentTypeListItem("solution").title("Soluções"),
            S.documentTypeListItem("segment").title("Segmentos"),
            S.documentTypeListItem("article").title("Conteúdos"),
            S.documentTypeListItem("faq").title("Perguntas frequentes"),
            S.divider(),
            S.listItem()
              .title("Provas de autoridade")
              .child(
                S.list()
                  .title("Provas de autoridade")
                  .items([
                    singleton(S, "authoritySettings", "Exibição no site"),
                    S.divider(),
                    S.documentTypeListItem("statistic").title("Números"),
                    S.documentTypeListItem("clientLogo").title("Logos de clientes"),
                    S.documentTypeListItem("testimonial").title("Depoimentos"),
                    S.documentTypeListItem("caseStudy").title("Cases"),
                    S.documentTypeListItem("certification").title("Certificações"),
                  ]),
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons não aparecem em "criar novo documento".
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, context) =>
      SINGLETONS.has(context.schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
