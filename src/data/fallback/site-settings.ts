import type { SiteSettings } from "@/types/content";

/**
 * Configurações institucionais — fonte única para Header, Footer, Contato,
 * formulário, JSON-LD e WhatsApp.
 *
 * NÃO preencher com dados do folder antigo (2011) nem de cadastros públicos.
 * O briefing registra divergências de endereço/contato em fontes públicas.
 * Cada campo só deve ser preenchido após confirmação da FolhaTec
 * (ver docs/client-content-checklist.md). Campos `null` ficam ocultos.
 */
export const fallbackSiteSettings: SiteSettings = {
  name: "FolhaTec",
  legalName: null,
  cnpj: null,
  tagline: "Soluções de identificação para operações industriais",
  description:
    "Soluções em etiquetas e identificação para operações industriais, com conhecimento técnico, atendimento consultivo e compromisso com prazo.",
  logo: null,
  contact: {
    phone: null,
    whatsapp: null,
    email: null,
    address: null,
    businessHours: null,
  },
  socialLinks: [],
  showFloatingWhatsApp: false,
};
