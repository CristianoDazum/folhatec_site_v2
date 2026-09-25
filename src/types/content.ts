/**
 * Tipos de conteúdo consumidos pelo frontend.
 *
 * Tudo que vem do Sanity ou do fallback local é normalizado para estes tipos
 * antes de chegar às páginas. Nenhum tipo específico do Sanity deve ser
 * importado fora de `src/lib/sanity`.
 *
 * Convenção: campo ausente/não validado = `null` (ou lista vazia). Componentes
 * não renderizam o elemento correspondente nesse caso.
 */
import type { PortableTextBlock } from "@portabletext/react";

export type RichTextBlock = PortableTextBlock;

/** Imagem inserida no corpo de um artigo (já normalizada). */
export interface RichTextImage {
  _type: "image";
  _key: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export type RichTextNode = RichTextBlock | RichTextImage;

export interface ContentImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Data URL de baixa resolução (LQIP) quando disponível. */
  blurDataUrl: string | null;
}

export interface SeoFields {
  title: string | null;
  description: string | null;
  ogImage: ContentImage | null;
  noIndex: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface PostalAddress {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface ContactSettings {
  /** Telefone para exibição, ex.: "(47) 0000-0000". */
  phone: string | null;
  /** WhatsApp em formato internacional apenas com dígitos, ex.: "5547900000000". */
  whatsapp: string | null;
  email: string | null;
  address: PostalAddress | null;
  businessHours: string | null;
}

export interface SiteSettings {
  name: string;
  legalName: string | null;
  cnpj: string | null;
  tagline: string | null;
  description: string;
  logo: ContentImage | null;
  contact: ContactSettings;
  socialLinks: SocialLink[];
  /** Botão flutuante de WhatsApp (só aparece se o número existir). */
  showFloatingWhatsApp: boolean;
}

/** Chave da composição visual neutra usada enquanto não há foto real. */
export type VisualKey =
  | "labels"
  | "ribbons"
  | "equipment"
  | "special"
  | "food"
  | "logistics"
  | "chemical"
  | "industry";

export interface LabeledValue {
  label: string;
  description: string | null;
}

export interface Solution {
  slug: string;
  title: string;
  eyebrow: string | null;
  shortDescription: string;
  description: string;
  image: ContentImage | null;
  visual: VisualKey;
  /** Para que serve / onde é utilizado / que problema resolve. */
  applications: LabeledValue[];
  /** Fatores ou possibilidades técnicas. Vazio = seção oculta. */
  technicalOptions: LabeledValue[];
  relatedSegmentSlugs: string[];
  differentiators: LabeledValue[];
  faq: FaqItem[];
  /** Mensagem pré-preenchida do WhatsApp para esta solução. */
  whatsappMessage: string | null;
  order: number;
  updatedAt: string | null;
  seo: SeoFields;
}

export interface Segment {
  slug: string;
  title: string;
  shortDescription: string;
  /** Contexto da indústria. */
  description: string;
  image: ContentImage | null;
  visual: VisualKey;
  challenges: LabeledValue[];
  applications: LabeledValue[];
  relatedSolutionSlugs: string[];
  differentiators: LabeledValue[];
  faq: FaqItem[];
  whatsappMessage: string | null;
  order: number;
  updatedAt: string | null;
  seo: SeoFields;
}

export interface ArticleCategory {
  slug: string;
  title: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory | null;
  publishedAt: string;
  updatedAt: string | null;
  image: ContentImage | null;
  body: RichTextNode[];
  author: string | null;
  faq: FaqItem[];
  seo: SeoFields;
}

/* ------------------------------------------------------------------ */
/* Provas de autoridade — todas desativadas até autorização/validação. */
/* ------------------------------------------------------------------ */

export interface AuthorityBlock<T> {
  enabled: boolean;
  title: string | null;
  items: T[];
}

export interface ClientLogo {
  name: string;
  logo: ContentImage;
  url: string | null;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string | null;
  company: string | null;
}

export interface CaseStudy {
  title: string;
  summary: string;
  segmentSlug: string | null;
  solutionSlug: string | null;
  image: ContentImage | null;
}

export interface Statistic {
  value: string;
  label: string;
}

export interface Certification {
  name: string;
  description: string | null;
  image: ContentImage | null;
}

export interface AuthorityContent {
  clientLogos: AuthorityBlock<ClientLogo>;
  testimonials: AuthorityBlock<Testimonial>;
  cases: AuthorityBlock<CaseStudy>;
  statistics: AuthorityBlock<Statistic>;
  certifications: AuthorityBlock<Certification>;
}

/* ------------------------------------------------------------------ */
/* Textos estruturais de páginas (Home, Empresa, Contato).             */
/* ------------------------------------------------------------------ */

export interface CallToAction {
  eyebrow: string | null;
  title: string;
  description: string | null;
}

export interface TextSection {
  eyebrow: string | null;
  title: string;
  description: string | null;
  items: LabeledValue[];
}

export interface HomeContent {
  hero: {
    eyebrow: string | null;
    title: string;
    highlight: string | null;
    description: string;
    highlights: string[];
    image: ContentImage | null;
    /** Rótulo do CTA principal (leva à cotação). */
    primaryCtaLabel: string;
    /** Rótulo do CTA secundário (WhatsApp ou página de contato). */
    secondaryCtaLabel: string;
  };
  positioning: TextSection;
  solutionsIntro: TextSection;
  applications: TextSection & { image: ContentImage | null };
  segmentsIntro: TextSection;
  differentiators: TextSection;
  finalCta: CallToAction;
}

export interface CompanyContent {
  hero: {
    eyebrow: string | null;
    title: string;
    description: string;
    image: ContentImage | null;
  };
  /** História oficial. `null` até a FolhaTec enviar o texto validado. */
  history: { title: string; paragraphs: string[] } | null;
  pillars: TextSection;
  service: TextSection;
  commitment: TextSection;
  relationship: TextSection | null;
  /** Estrutura/operação. `null` até haver fotos e dados validados. */
  structure: (TextSection & { images: ContentImage[] }) | null;
  finalCta: CallToAction;
}

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyPolicyContent {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Data da última revisão jurídica aprovada (ISO). */
  updatedAt: string | null;
}
