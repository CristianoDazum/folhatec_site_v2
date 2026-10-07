import type { SiteSettings } from "@/types/content";

/**
 * Configurações institucionais — fonte única para Header, Footer, Contato,
 * formulário, JSON-LD e WhatsApp.
 *
 * Contatos (e-mail, telefone, endereço) enviados pela agência em 06/10/2026,
 * idênticos aos publicados hoje em folhatec.com.br. NÃO usar dados do folder
 * antigo (2011). Razão social, CNPJ, WhatsApp, horário e redes sociais
 * continuam pendentes (docs/client-content-checklist.md). Campos `null`
 * ficam ocultos.
 */
export const fallbackSiteSettings: SiteSettings = {
  name: "FolhaTec",
  legalName: null,
  cnpj: null,
  tagline: "Soluções de identificação para operações industriais",
  description:
    "Soluções em etiquetas e identificação para operações industriais, com conhecimento técnico, atendimento consultivo e compromisso com prazo.",
  // Logos extraídos dos arquivos da agência (Elementos PNG, 07/10/2026).
  logo: {
    url: "/brand/folhatec-logo.png",
    alt: "FolhaTec — Etiquetas de qualidade. Parceria de sucesso.",
    width: 1000,
    height: 218,
    blurDataUrl: null,
  },
  logoOnDark: {
    url: "/brand/folhatec-logo-branco.png",
    alt: "FolhaTec",
    width: 406,
    height: 61,
    blurDataUrl: null,
  },
  contact: {
    phone: "+55 (47) 3374-5146",
    // O número acima é fixo; WhatsApp só com número comercial confirmado.
    whatsapp: null,
    email: "folhatec@folhatec.com.br",
    address: {
      street: "Rua José Brunner, 283, Galpão 06",
      district: "Czerniewicz",
      city: "Jaraguá do Sul",
      state: "SC",
      postalCode: "89255-380",
      country: "BR",
    },
    businessHours: null,
  },
  socialLinks: [],
  showFloatingWhatsApp: false,
};
