import { article } from "./article";
import { authoritySchemaTypes } from "./authority";
import { faq } from "./faq";
import { companyPage, homePage } from "./pages";
import { segment } from "./segment";
import { labeledValue, seo } from "./shared";
import { siteSettings } from "./siteSettings";
import { solution } from "./solution";

/**
 * Tipos ativos no Studio. As provas de autoridade estão registradas, mas só
 * aparecem no site quando habilitadas em `authoritySettings` (padrão: não).
 */
export const schemaTypes = [
  siteSettings,
  homePage,
  companyPage,
  solution,
  segment,
  article,
  faq,
  ...authoritySchemaTypes,
  labeledValue,
  seo,
];
