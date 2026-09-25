import { article } from "./article";
import { faq } from "./faq";
import { segment } from "./segment";
import { labeledValue, seo } from "./shared";
import { siteSettings } from "./siteSettings";
import { solution } from "./solution";

/**
 * Tipos ativos no Studio.
 * Provas de autoridade (testimonial, caseStudy, certification, clientLogo,
 * statistic) estão em ./authority.ts e permanecem desativadas.
 */
export const schemaTypes = [siteSettings, solution, segment, article, faq, labeledValue, seo];
