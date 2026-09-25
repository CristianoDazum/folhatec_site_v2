/**
 * Queries GROQ. As projeções já achatam slugs e referências, mas o
 * normalizador valida tudo novamente antes de entregar ao frontend.
 */

const image = /* groq */ `{
  alt,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

const seo = /* groq */ `seo{
  title,
  description,
  noIndex,
  "ogImage": ogImage${image}
}`;

const labeled = /* groq */ `{ label, description }`;

const faq = /* groq */ `"faq": faq[]->{ question, answer }`;

export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  name,
  legalName,
  cnpj,
  tagline,
  description,
  "logo": logo${image},
  phone,
  whatsapp,
  email,
  address,
  businessHours,
  socialLinks[]{ label, url },
  showFloatingWhatsApp
}`;

export const solutionsQuery = /* groq */ `*[_type == "solution" && defined(slug.current)]
  | order(coalesce(order, 999) asc, title asc){
  _updatedAt,
  title,
  "slug": slug.current,
  eyebrow,
  shortDescription,
  description,
  "image": image${image},
  visual,
  applications[]${labeled},
  technicalOptions[]${labeled},
  "relatedSegments": relatedSegments[]->slug.current,
  differentiators[]${labeled},
  ${faq},
  whatsappMessage,
  order,
  ${seo}
}`;

export const segmentsQuery = /* groq */ `*[_type == "segment" && defined(slug.current)]
  | order(coalesce(order, 999) asc, title asc){
  _updatedAt,
  title,
  "slug": slug.current,
  shortDescription,
  description,
  "image": image${image},
  visual,
  challenges[]${labeled},
  applications[]${labeled},
  "relatedSolutions": relatedSolutions[]->slug.current,
  differentiators[]${labeled},
  ${faq},
  whatsappMessage,
  order,
  ${seo}
}`;

const articleFields = /* groq */ `
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  category,
  publishedAt,
  "image": image${image},
  author,
  ${faq},
  ${seo}
`;

export const articlesQuery = /* groq */ `*[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc){ ${articleFields} }`;

export const articleBySlugQuery = /* groq */ `*[_type == "article" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
  ${articleFields},
  body[]{
    ...,
    _type == "image" => {
      _type,
      _key,
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
}`;

const textSection = /* groq */ `{ eyebrow, title, description, items[]${labeled} }`;
const callToAction = /* groq */ `{ eyebrow, title, description }`;

export const homePageQuery = /* groq */ `*[_type == "homePage"][0]{
  hero{
    eyebrow,
    title,
    highlight,
    description,
    highlights,
    "image": image${image},
    primaryCtaLabel,
    secondaryCtaLabel
  },
  "positioning": positioning${textSection},
  "solutionsIntro": solutionsIntro${textSection},
  "applications": applications{ eyebrow, title, description, items[]${labeled}, "image": image${image} },
  "segmentsIntro": segmentsIntro${textSection},
  "differentiators": differentiators${textSection},
  "finalCta": finalCta${callToAction}
}`;

export const companyPageQuery = /* groq */ `*[_type == "companyPage"][0]{
  hero{ eyebrow, title, description, "image": image${image} },
  history{ title, paragraphs },
  "pillars": pillars${textSection},
  "service": service${textSection},
  "commitment": commitment${textSection},
  "relationship": relationship${textSection},
  "structure": structure{ eyebrow, title, description, items[]${labeled}, "images": images[]${image} },
  "finalCta": finalCta${callToAction}
}`;

/**
 * Provas de autoridade: somente itens marcados como autorizados. Cada bloco
 * ainda depende de `enabled` no singleton `authoritySettings`.
 */
export const authorityQuery = /* groq */ `{
  "settings": *[_type == "authoritySettings"][0]{ clientLogos, testimonials, cases, statistics, certifications },
  "clientLogos": *[_type == "clientLogo" && authorized == true] | order(name asc){ name, url, "logo": logo${image} },
  "testimonials": *[_type == "testimonial" && authorized == true] | order(_createdAt asc){ quote, author, role, company },
  "cases": *[_type == "caseStudy" && authorized == true] | order(_createdAt asc){
    title,
    summary,
    "segmentSlug": segment->slug.current,
    "solutionSlug": solution->slug.current,
    "image": image${image}
  },
  "statistics": *[_type == "statistic"] | order(_createdAt asc){ value, label },
  "certifications": *[_type == "certification"] | order(name asc){ name, description, validUntil, "image": image${image} }
}`;
