import { createClient, type SanityClient } from "@sanity/client";
import { CONTENT_REVALIDATE_SECONDS, sanityConfig } from "./config";

let client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!sanityConfig) return null;
  client ??= createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    token: sanityConfig.token ?? undefined,
    // Com token (dataset privado) o CDN não é usado.
    useCdn: !sanityConfig.token,
    perspective: "published",
  });
  return client;
}

/**
 * Executa uma query GROQ com revalidação ISR.
 * Lança erro se o Sanity não estiver configurado — o data layer só chama
 * esta função quando `isSanityConfigured` é verdadeiro.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string> = {},
  tags: string[] = [],
): Promise<T> {
  const sanity = getClient();
  if (!sanity) throw new Error("Sanity não configurado.");
  return sanity.fetch<T>(query, params, {
    next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: ["sanity", ...tags] },
  });
}
