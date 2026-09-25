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
