/**
 * Leitura centralizada de variáveis de ambiente públicas.
 * Nenhuma variável é obrigatória: sem valores, o site roda em modo
 * desenvolvimento, sem tracking e com fallback local de conteúdo.
 *
 * Variáveis NEXT_PUBLIC_* são embutidas no bundle em tempo de build.
 */

export type SiteEnv = "development" | "staging" | "production";

const DEFAULT_SITE_URL = "http://localhost:3000";

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseSiteUrl(value: string | undefined): string {
  const raw = clean(value);
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function parseSiteEnv(value: string | undefined): SiteEnv {
  const raw = clean(value);
  if (raw === "production" || raw === "staging") return raw;
  return "development";
}

function matchOrNull(value: string | undefined, pattern: RegExp): string | null {
  const raw = clean(value);
  return raw && pattern.test(raw) ? raw : null;
}

export const SITE_URL = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_ENV: SiteEnv = parseSiteEnv(process.env.NEXT_PUBLIC_SITE_ENV);

/**
 * Indexação só é permitida em produção explícita. Deploys de Preview da
 * Vercel (VERCEL_ENV=preview) nunca são indexados, mesmo que alguém copie
 * NEXT_PUBLIC_SITE_ENV=production para o ambiente de preview.
 */
export const IS_INDEXABLE =
  SITE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

/** IDs validados por formato para evitar injeção nos snippets de tracking. */
export const GTM_ID = matchOrNull(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]{4,12}$/);
export const GA4_ID = matchOrNull(process.env.NEXT_PUBLIC_GA4_ID, /^G-[A-Z0-9]{4,16}$/);

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
