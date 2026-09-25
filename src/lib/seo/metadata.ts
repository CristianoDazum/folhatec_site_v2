import type { Metadata } from "next";
import { IS_INDEXABLE, absoluteUrl } from "@/lib/config/env";
import type { ContentImage, SeoFields } from "@/types/content";

export const SITE_NAME = "FolhaTec";

/**
 * Metadata da página 404. O Next injeta <meta name="robots" content="noindex">
 * automaticamente; `robots: null` remove o valor herdado do layout para não
 * duplicar a tag. Usada no not-found e nas rotas dinâmicas sem conteúdo.
 */
export const NOT_FOUND_METADATA: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procura não existe ou foi movida.",
  robots: null,
};

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Caminho canônico, ex.: "/solucoes/etiquetas". */
  path: string;
  seo?: SeoFields | null;
  image?: ContentImage | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  /** Título já completo (sem o sufixo " | FolhaTec"). */
  absoluteTitle?: boolean;
}

/**
 * Metadata padrão de página pública: title, description, canonical absoluto,
 * Open Graph, Twitter e robots conforme ambiente.
 * Campos SEO do CMS (quando existirem) têm precedência.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const title = input.seo?.title ?? input.title;
  const description = input.seo?.description ?? input.description;
  const url = absoluteUrl(input.path);
  const ogImage = input.seo?.ogImage ?? input.image ?? null;
  const index = IS_INDEXABLE && !input.seo?.noIndex;

  return {
    title: input.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      url,
      title,
      description,
      ...(ogImage
        ? { images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] }
        : {}),
      ...(input.type === "article" && input.publishedTime
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime ?? undefined }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  };
}
