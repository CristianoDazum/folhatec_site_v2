/**
 * Configuração do Sanity. O site funciona sem ela (fallback local).
 */

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token: string | null;
}

const projectId = clean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const dataset = clean(process.env.NEXT_PUBLIC_SANITY_DATASET);

export const sanityConfig: SanityConfig | null =
  projectId && dataset && /^[a-z0-9-]+$/.test(projectId)
    ? {
        projectId,
        dataset,
        apiVersion: clean(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? "2025-02-19",
        // Token opcional e apenas server-side (sem prefixo NEXT_PUBLIC).
        token: clean(process.env.SANITY_API_TOKEN),
      }
    : null;

export const isSanityConfigured = sanityConfig !== null;

/** Intervalo de revalidação (ISR) do conteúdo vindo do CMS, em segundos. */
export const CONTENT_REVALIDATE_SECONDS = 300;
