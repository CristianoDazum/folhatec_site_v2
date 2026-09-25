/**
 * Builders tipados de JSON-LD (schema.org). URLs sempre absolutas.
 * Dados institucionais vêm de SiteSettings; campos ausentes são omitidos.
 * Não há Product schema (o site não é e-commerce).
 */
import { absoluteUrl } from "@/lib/config/env";
import type { Article, FaqItem, SiteSettings } from "@/types/content";
import type { BreadcrumbItem } from "@/types/navigation";

type JsonLdValue = string | number | boolean | JsonLdObject | JsonLdValue[];
export interface JsonLdObject {
  [key: string]: JsonLdValue | undefined;
}

export function organizationJsonLd(settings: SiteSettings): JsonLdObject {
  const { contact } = settings;
  const address = contact.address;
  const hasAddress = Boolean(address?.street && address.city);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: settings.name,
    url: absoluteUrl("/"),
    description: settings.description,
    legalName: settings.legalName ?? undefined,
    taxID: settings.cnpj ?? undefined,
    logo: settings.logo?.url,
    email: contact.email ?? undefined,
    telephone: contact.phone ?? undefined,
    address:
      hasAddress && address
        ? {
            "@type": "PostalAddress",
            streetAddress: address.street ?? undefined,
            addressLocality: address.city ?? undefined,
            addressRegion: address.state ?? undefined,
            postalCode: address.postalCode ?? undefined,
            addressCountry: address.country ?? "BR",
          }
        : undefined,
    sameAs: settings.socialLinks.length ? settings.socialLinks.map((link) => link.url) : undefined,
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(article: Article, settings: SiteSettings): JsonLdObject {
  const url = absoluteUrl(`/conteudos/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo.description ?? (article.excerpt || undefined),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    mainEntityOfPage: url,
    url,
    image: article.image?.url,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: settings.name, url: absoluteUrl("/") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function faqJsonLd(items: FaqItem[]): JsonLdObject | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
