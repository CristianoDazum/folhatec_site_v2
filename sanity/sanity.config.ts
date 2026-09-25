import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const SINGLETONS = new Set(["siteSettings"]);

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
            S.listItem()
              .title("Configurações do site")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("solution").title("Soluções"),
            S.documentTypeListItem("segment").title("Segmentos"),
            S.documentTypeListItem("article").title("Conteúdos"),
            S.documentTypeListItem("faq").title("Perguntas frequentes"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singleton: não aparece em "criar novo documento".
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, context) =>
      SINGLETONS.has(context.schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
