import type { AuthorityContent } from "@/types/content";

/**
 * Provas de autoridade — TODAS desativadas.
 *
 * - Logos de clientes: não há autorização contratual (kickoff).
 * - Depoimentos, cases e números: dependem de autorização/validação.
 * - Certificações: somente após validação (folder de 2011 não é fonte atual).
 *
 * Para ativar: preencher `items`, definir `enabled: true` (ou via CMS).
 */
export const fallbackAuthority: AuthorityContent = {
  clientLogos: { enabled: false, title: null, items: [] },
  testimonials: { enabled: false, title: null, items: [] },
  cases: { enabled: false, title: null, items: [] },
  statistics: { enabled: false, title: null, items: [] },
  certifications: { enabled: false, title: null, items: [] },
};
