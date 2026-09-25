/**
 * Formatos crus retornados pelas queries GROQ.
 * Uso restrito a `src/lib/sanity`. Nunca importar em componentes/páginas.
 * Todos os campos são opcionais/nulos: o CMS pode ter documentos incompletos.
 */

export type RawSlug = string | { current?: string | null } | null | undefined;

export interface RawImage {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  lqip?: string | null;
}

export interface RawSeo {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean | null;
  ogImage?: RawImage | null;
}

export interface RawLabeledValue {
  label?: string | null;
  description?: string | null;
}

export interface RawFaq {
  question?: string | null;
  answer?: string | null;
}

export interface RawSiteSettings {
  name?: string | null;
  legalName?: string | null;
  cnpj?: string | null;
  tagline?: string | null;
  description?: string | null;
  logo?: RawImage | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  businessHours?: string | null;
  socialLinks?: Array<{ label?: string | null; url?: string | null }> | null;
  showFloatingWhatsApp?: boolean | null;
}

interface RawCatalogBase {
  _updatedAt?: string | null;
  title?: string | null;
  slug?: RawSlug;
  shortDescription?: string | null;
  description?: string | null;
  image?: RawImage | null;
  visual?: string | null;
  applications?: RawLabeledValue[] | null;
  differentiators?: RawLabeledValue[] | null;
  faq?: RawFaq[] | null;
  whatsappMessage?: string | null;
  order?: number | null;
  seo?: RawSeo | null;
}

export interface RawSolution extends RawCatalogBase {
  eyebrow?: string | null;
  technicalOptions?: RawLabeledValue[] | null;
  relatedSegments?: RawSlug[] | null;
}

export interface RawSegment extends RawCatalogBase {
  challenges?: RawLabeledValue[] | null;
  relatedSolutions?: RawSlug[] | null;
}

export interface RawPortableNode {
  _type?: string;
  _key?: string;
  [key: string]: unknown;
}

export interface RawArticle {
  _updatedAt?: string | null;
  title?: string | null;
  slug?: RawSlug;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  image?: RawImage | null;
  body?: RawPortableNode[] | null;
  author?: string | null;
  faq?: RawFaq[] | null;
  seo?: RawSeo | null;
}

/* ------------------------------------------------------------------ */
/* Singletons de página e provas de autoridade                          */
/* ------------------------------------------------------------------ */

export interface RawTextSection {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  items?: RawLabeledValue[] | null;
}

export interface RawCallToAction {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
}

export interface RawHomePage {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    highlight?: string | null;
    description?: string | null;
    highlights?: Array<string | null> | null;
    image?: RawImage | null;
    primaryCtaLabel?: string | null;
    secondaryCtaLabel?: string | null;
  } | null;
  positioning?: RawTextSection | null;
  solutionsIntro?: RawTextSection | null;
  applications?: (RawTextSection & { image?: RawImage | null }) | null;
  segmentsIntro?: RawTextSection | null;
  differentiators?: RawTextSection | null;
  finalCta?: RawCallToAction | null;
}

export interface RawCompanyPage {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    image?: RawImage | null;
  } | null;
  history?: { title?: string | null; paragraphs?: Array<string | null> | null } | null;
  pillars?: RawTextSection | null;
  service?: RawTextSection | null;
  commitment?: RawTextSection | null;
  relationship?: RawTextSection | null;
  structure?: (RawTextSection & { images?: RawImage[] | null }) | null;
  finalCta?: RawCallToAction | null;
}

export interface RawAuthorityBlockSettings {
  enabled?: boolean | null;
  title?: string | null;
}

export interface RawAuthority {
  settings?: {
    clientLogos?: RawAuthorityBlockSettings | null;
    testimonials?: RawAuthorityBlockSettings | null;
    cases?: RawAuthorityBlockSettings | null;
    statistics?: RawAuthorityBlockSettings | null;
    certifications?: RawAuthorityBlockSettings | null;
  } | null;
  clientLogos?: Array<{ name?: string | null; logo?: RawImage | null; url?: string | null }> | null;
  testimonials?: Array<{
    quote?: string | null;
    author?: string | null;
    role?: string | null;
    company?: string | null;
  }> | null;
  cases?: Array<{
    title?: string | null;
    summary?: string | null;
    segmentSlug?: string | null;
    solutionSlug?: string | null;
    image?: RawImage | null;
  }> | null;
  statistics?: Array<{ value?: string | null; label?: string | null }> | null;
  certifications?: Array<{
    name?: string | null;
    description?: string | null;
    image?: RawImage | null;
    validUntil?: string | null;
  }> | null;
}
