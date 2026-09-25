/**
 * Normalização Sanity → tipos do frontend.
 * Remove itens inválidos, converte slugs/referências em strings e imagens
 * em `ContentImage`. Nada de objeto cru do Sanity passa daqui.
 */
import type {
  Article,
  AuthorityBlock,
  AuthorityContent,
  CallToAction,
  CompanyContent,
  ContentImage,
  HomeContent,
  TextSection,
  FaqItem,
  LabeledValue,
  PostalAddress,
  RichTextBlock,
  RichTextNode,
  Segment,
  SeoFields,
  SiteSettings,
  Solution,
  VisualKey,
} from "@/types/content";
import { ARTICLE_CATEGORIES, isVisualKey } from "@/lib/content/constants";
import type {
  RawArticle,
  RawAuthority,
  RawAuthorityBlockSettings,
  RawCallToAction,
  RawCompanyPage,
  RawHomePage,
  RawTextSection,
  RawFaq,
  RawImage,
  RawLabeledValue,
  RawPortableNode,
  RawSegment,
  RawSeo,
  RawSiteSettings,
  RawSlug,
  RawSolution,
} from "./types";

export function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeSlug(value: RawSlug): string | null {
  if (typeof value === "string") return text(value);
  if (value && typeof value === "object") return text(value.current);
  return null;
}

export function normalizeSlugList(values: RawSlug[] | null | undefined): string[] {
  if (!Array.isArray(values)) return [];
  const slugs = values.map(normalizeSlug).filter((slug): slug is string => slug !== null);
  return Array.from(new Set(slugs));
}

export function normalizeImage(raw: RawImage | null | undefined, fallbackAlt = ""): ContentImage | null {
  const url = text(raw?.url);
  const width = raw?.width;
  const height = raw?.height;
  if (!url || typeof width !== "number" || typeof height !== "number") return null;
  return {
    url,
    alt: text(raw?.alt) ?? fallbackAlt,
    width,
    height,
    blurDataUrl: text(raw?.lqip),
  };
}

export function normalizeSeo(raw: RawSeo | null | undefined): SeoFields {
  return {
    title: text(raw?.title),
    description: text(raw?.description),
    ogImage: normalizeImage(raw?.ogImage),
    noIndex: raw?.noIndex === true,
  };
}

export function normalizeLabeled(values: RawLabeledValue[] | null | undefined): LabeledValue[] {
  if (!Array.isArray(values)) return [];
  return values.flatMap((item) => {
    const label = text(item?.label);
    return label ? [{ label, description: text(item?.description) }] : [];
  });
}

export function normalizeFaq(values: RawFaq[] | null | undefined): FaqItem[] {
  if (!Array.isArray(values)) return [];
  return values.flatMap((item) => {
    const question = text(item?.question);
    const answer = text(item?.answer);
    return question && answer ? [{ question, answer }] : [];
  });
}

function normalizeVisual(value: unknown, fallback: VisualKey): VisualKey {
  return isVisualKey(value) ? value : fallback;
}

function normalizeDate(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  return Number.isNaN(Date.parse(raw)) ? null : raw;
}

function normalizeAddress(raw: RawSiteSettings["address"]): PostalAddress | null {
  if (!raw) return null;
  const address: PostalAddress = {
    street: text(raw.street),
    city: text(raw.city),
    state: text(raw.state),
    postalCode: text(raw.postalCode),
    country: text(raw.country),
  };
  return Object.values(address).some(Boolean) ? address : null;
}

function normalizeWhatsApp(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

function normalizeHttpUrl(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeSiteSettings(raw: RawSiteSettings | null, fallback: SiteSettings): SiteSettings {
  if (!raw) return fallback;
  return {
    name: text(raw.name) ?? fallback.name,
    legalName: text(raw.legalName),
    cnpj: text(raw.cnpj),
    tagline: text(raw.tagline),
    description: text(raw.description) ?? fallback.description,
    logo: normalizeImage(raw.logo, text(raw.name) ?? fallback.name),
    contact: {
      phone: text(raw.phone),
      whatsapp: normalizeWhatsApp(raw.whatsapp),
      email: text(raw.email),
      address: normalizeAddress(raw.address),
      businessHours: text(raw.businessHours),
    },
    socialLinks: (raw.socialLinks ?? []).flatMap((link) => {
      const label = text(link?.label);
      const url = normalizeHttpUrl(link?.url);
      return label && url ? [{ label, url }] : [];
    }),
    showFloatingWhatsApp: raw.showFloatingWhatsApp === true,
  };
}

export function normalizeSolution(raw: RawSolution): Solution | null {
  const slug = normalizeSlug(raw.slug);
  const title = text(raw.title);
  const shortDescription = text(raw.shortDescription);
  if (!slug || !title || !shortDescription) return null;
  return {
    slug,
    title,
    eyebrow: text(raw.eyebrow),
    shortDescription,
    description: text(raw.description) ?? shortDescription,
    image: normalizeImage(raw.image, title),
    visual: normalizeVisual(raw.visual, "labels"),
    applications: normalizeLabeled(raw.applications),
    technicalOptions: normalizeLabeled(raw.technicalOptions),
    relatedSegmentSlugs: normalizeSlugList(raw.relatedSegments),
    differentiators: normalizeLabeled(raw.differentiators),
    faq: normalizeFaq(raw.faq),
    whatsappMessage: text(raw.whatsappMessage),
    order: typeof raw.order === "number" ? raw.order : 999,
    updatedAt: normalizeDate(raw._updatedAt),
    seo: normalizeSeo(raw.seo),
  };
}

export function normalizeSegment(raw: RawSegment): Segment | null {
  const slug = normalizeSlug(raw.slug);
  const title = text(raw.title);
  const shortDescription = text(raw.shortDescription);
  if (!slug || !title || !shortDescription) return null;
  return {
    slug,
    title,
    shortDescription,
    description: text(raw.description) ?? shortDescription,
    image: normalizeImage(raw.image, title),
    visual: normalizeVisual(raw.visual, "industry"),
    challenges: normalizeLabeled(raw.challenges),
    applications: normalizeLabeled(raw.applications),
    relatedSolutionSlugs: normalizeSlugList(raw.relatedSolutions),
    differentiators: normalizeLabeled(raw.differentiators),
    faq: normalizeFaq(raw.faq),
    whatsappMessage: text(raw.whatsappMessage),
    order: typeof raw.order === "number" ? raw.order : 999,
    updatedAt: normalizeDate(raw._updatedAt),
    seo: normalizeSeo(raw.seo),
  };
}

/**
 * Mantém blocos de texto e imagens (já achatadas pela query) do Portable
 * Text. Tipos desconhecidos são descartados.
 */
function normalizeBody(nodes: RawPortableNode[] | null | undefined): RichTextNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.flatMap((node, index): RichTextNode[] => {
    if (!node || typeof node !== "object") return [];
    const key = typeof node._key === "string" ? node._key : `node-${index}`;
    if (node._type === "block" && Array.isArray(node.children)) {
      // Estrutura validada acima; o restante do bloco segue o padrão
      // Portable Text produzido pelo próprio Sanity.
      return [{ ...node, _key: key } as unknown as RichTextBlock];
    }
    if (node._type === "image") {
      const url = text(node.url);
      if (!url || typeof node.width !== "number" || typeof node.height !== "number") return [];
      return [
        { _type: "image", _key: key, url, alt: text(node.alt) ?? "", width: node.width, height: node.height },
      ];
    }
    return [];
  });
}

export function normalizeArticle(raw: RawArticle, withBody: boolean): Article | null {
  const slug = normalizeSlug(raw.slug);
  const title = text(raw.title);
  const publishedAt = normalizeDate(raw.publishedAt);
  if (!slug || !title || !publishedAt) return null;
  const categorySlug = text(raw.category);
  return {
    slug,
    title,
    excerpt: text(raw.excerpt) ?? "",
    category: ARTICLE_CATEGORIES.find((category) => category.slug === categorySlug) ?? null,
    publishedAt,
    updatedAt: normalizeDate(raw._updatedAt),
    image: normalizeImage(raw.image, title),
    body: withBody ? normalizeBody(raw.body) : [],
    author: text(raw.author),
    faq: normalizeFaq(raw.faq),
    seo: normalizeSeo(raw.seo),
  };
}

export function compact<T>(values: Array<T | null>): T[] {
  return values.filter((value): value is T => value !== null);
}

/* ------------------------------------------------------------------ */
/* Singletons de página (Home, Empresa)                                */
/* ------------------------------------------------------------------ */
/*
 * Regras:
 * - documento inexistente → fallback completo;
 * - título/texto obrigatório vazio → texto do fallback (evita layout quebrado);
 * - lista vazia → lista do fallback, exceto em seções opcionais (história,
 *   estrutura, relacionamento), que só existem com conteúdo do CMS;
 * - imagem vazia → null (mantém a composição visual neutra).
 */

function stringList(values: Array<string | null> | null | undefined): string[] {
  if (!Array.isArray(values)) return [];
  return values.map(text).filter((value): value is string => value !== null);
}

function normalizeTextSection(raw: RawTextSection | null | undefined, fallback: TextSection): TextSection {
  if (!raw) return fallback;
  const items = normalizeLabeled(raw.items);
  return {
    eyebrow: text(raw.eyebrow) ?? fallback.eyebrow,
    title: text(raw.title) ?? fallback.title,
    description: text(raw.description) ?? fallback.description,
    items: items.length ? items : fallback.items,
  };
}

/** Seção opcional: só existe se o CMS tiver ao menos título. */
function normalizeOptionalSection(raw: RawTextSection | null | undefined): TextSection | null {
  const title = text(raw?.title);
  if (!raw || !title) return null;
  return { eyebrow: text(raw.eyebrow), title, description: text(raw.description), items: normalizeLabeled(raw.items) };
}

function normalizeCta(raw: RawCallToAction | null | undefined, fallback: CallToAction): CallToAction {
  if (!raw) return fallback;
  return {
    eyebrow: text(raw.eyebrow) ?? fallback.eyebrow,
    title: text(raw.title) ?? fallback.title,
    description: text(raw.description) ?? fallback.description,
  };
}

export function normalizeHomePage(raw: RawHomePage | null, fallback: HomeContent): HomeContent {
  if (!raw) return fallback;
  const hero = raw.hero;
  const heroTitle = text(hero?.title);
  const highlights = stringList(hero?.highlights);
  return {
    hero: {
      eyebrow: text(hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: heroTitle ?? fallback.hero.title,
      // Destaque do fallback só acompanha o título do fallback.
      highlight: text(hero?.highlight) ?? (heroTitle ? null : fallback.hero.highlight),
      description: text(hero?.description) ?? fallback.hero.description,
      highlights: highlights.length ? highlights : fallback.hero.highlights,
      image: normalizeImage(hero?.image, heroTitle ?? fallback.hero.title),
      primaryCtaLabel: text(hero?.primaryCtaLabel) ?? fallback.hero.primaryCtaLabel,
      secondaryCtaLabel: text(hero?.secondaryCtaLabel) ?? fallback.hero.secondaryCtaLabel,
    },
    positioning: normalizeTextSection(raw.positioning, fallback.positioning),
    solutionsIntro: normalizeTextSection(raw.solutionsIntro, fallback.solutionsIntro),
    applications: {
      ...normalizeTextSection(raw.applications, fallback.applications),
      image: normalizeImage(raw.applications?.image),
    },
    segmentsIntro: normalizeTextSection(raw.segmentsIntro, fallback.segmentsIntro),
    differentiators: normalizeTextSection(raw.differentiators, fallback.differentiators),
    finalCta: normalizeCta(raw.finalCta, fallback.finalCta),
  };
}

export function normalizeCompanyPage(raw: RawCompanyPage | null, fallback: CompanyContent): CompanyContent {
  if (!raw) return fallback;
  const hero = raw.hero;
  const historyTitle = text(raw.history?.title);
  const historyParagraphs = stringList(raw.history?.paragraphs);
  const structure = normalizeOptionalSection(raw.structure);

  return {
    hero: {
      eyebrow: text(hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: text(hero?.title) ?? fallback.hero.title,
      description: text(hero?.description) ?? fallback.hero.description,
      image: normalizeImage(hero?.image, text(hero?.title) ?? fallback.hero.title),
    },
    // História só aparece com título e texto vindos do CMS — nunca inventada.
    history: historyTitle && historyParagraphs.length ? { title: historyTitle, paragraphs: historyParagraphs } : null,
    pillars: normalizeTextSection(raw.pillars, fallback.pillars),
    service: normalizeTextSection(raw.service, fallback.service),
    commitment: normalizeTextSection(raw.commitment, fallback.commitment),
    relationship: raw.relationship ? normalizeOptionalSection(raw.relationship) : fallback.relationship,
    structure: structure
      ? {
          ...structure,
          images: (raw.structure?.images ?? [])
            .map((item) => normalizeImage(item))
            .filter((item): item is ContentImage => item !== null),
        }
      : null,
    finalCta: normalizeCta(raw.finalCta, fallback.finalCta),
  };
}

/* ------------------------------------------------------------------ */
/* Provas de autoridade                                                */
/* ------------------------------------------------------------------ */

function authorityBlock<T>(settings: RawAuthorityBlockSettings | null | undefined, items: T[]): AuthorityBlock<T> {
  return { enabled: settings?.enabled === true, title: text(settings?.title), items };
}

function isNotExpired(date: string | null | undefined, now: Date): boolean {
  const raw = text(date);
  if (!raw) return true;
  const end = Date.parse(`${raw}T23:59:59Z`);
  return Number.isNaN(end) || end >= now.getTime();
}

/**
 * Cada bloco só é exibido com `enabled: true` no singleton
 * `authoritySettings` e itens válidos. Sem configuração, tudo desativado.
 */
export function normalizeAuthority(raw: RawAuthority | null, now = new Date()): AuthorityContent {
  const settings = raw?.settings;
  return {
    clientLogos: authorityBlock(
      settings?.clientLogos,
      (raw?.clientLogos ?? []).flatMap((item) => {
        const name = text(item?.name);
        const logo = normalizeImage(item?.logo, name ?? "");
        return name && logo ? [{ name, logo, url: normalizeHttpUrl(item?.url) }] : [];
      }),
    ),
    testimonials: authorityBlock(
      settings?.testimonials,
      (raw?.testimonials ?? []).flatMap((item) => {
        const quote = text(item?.quote);
        const author = text(item?.author);
        return quote && author ? [{ quote, author, role: text(item?.role), company: text(item?.company) }] : [];
      }),
    ),
    cases: authorityBlock(
      settings?.cases,
      (raw?.cases ?? []).flatMap((item) => {
        const title = text(item?.title);
        const summary = text(item?.summary);
        return title && summary
          ? [
              {
                title,
                summary,
                segmentSlug: text(item?.segmentSlug),
                solutionSlug: text(item?.solutionSlug),
                image: normalizeImage(item?.image, title),
              },
            ]
          : [];
      }),
    ),
    statistics: authorityBlock(
      settings?.statistics,
      (raw?.statistics ?? []).flatMap((item) => {
        const value = text(item?.value);
        const label = text(item?.label);
        return value && label ? [{ value, label }] : [];
      }),
    ),
    certifications: authorityBlock(
      settings?.certifications,
      (raw?.certifications ?? []).flatMap((item) => {
        const name = text(item?.name);
        return name && isNotExpired(item?.validUntil, now)
          ? [{ name, description: text(item?.description), image: normalizeImage(item?.image, name) }]
          : [];
      }),
    ),
  };
}
