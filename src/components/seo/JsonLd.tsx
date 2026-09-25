import type { JsonLdObject } from "@/lib/seo/json-ld";

/**
 * Serializa JSON-LD com escape de "<" para impedir fechamento prematuro
 * da tag <script> caso algum conteúdo do CMS contenha HTML.
 */
export function JsonLd({ data }: { data: JsonLdObject | null }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
