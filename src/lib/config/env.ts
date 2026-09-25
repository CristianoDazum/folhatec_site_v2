/**
 * Leitura centralizada de variáveis de ambiente públicas.
 * Em development/staging nenhuma variável é obrigatória: sem valores, o site
 * roda sem tracking e com fallback local de conteúdo.
 *
 * Em production, NEXT_PUBLIC_SITE_URL é OBRIGATÓRIA e precisa ser uma URL
 * pública https — caso contrário o build/inicialização falha (nunca publicar
 * canonical, sitemap, Open Graph ou JSON-LD apontando para localhost).
 *
 * Variáveis NEXT_PUBLIC_* são embutidas no bundle em tempo de build.
 */

export type SiteEnv = "development" | "staging" | "production";

const DEFAULT_SITE_URL = "http://localhost:3000";

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function parseSiteEnv(value: string | undefined): SiteEnv {
  const raw = clean(value);
  if (raw === "production" || raw === "staging") return raw;
  return "development";
}

/** Hosts que nunca podem ser a URL pública de produção. */
export function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    /^127\./.test(host)
  );
}

/**
 * Resolve a URL pública do site (origem, sem barra final).
 * - development/staging: URL inválida ou ausente → http://localhost:3000.
 * - production: ausente, inválida, sem https ou local → lança erro.
 */
export function resolveSiteUrl(value: string | undefined, env: SiteEnv): string {
  const raw = clean(value);
  let url: URL | null = null;
  if (raw) {
    try {
      url = new URL(raw);
    } catch {
      url = null;
    }
  }

  if (env !== "production") {
    return url && (url.protocol === "http:" || url.protocol === "https:") ? url.origin : DEFAULT_SITE_URL;
  }

  if (!url) {
    throw new Error(
      `[config] NEXT_PUBLIC_SITE_URL ${raw ? `inválida ("${raw}")` : "ausente"} com NEXT_PUBLIC_SITE_ENV=production. ` +
        "Defina a URL pública do site, ex.: https://www.dominio.com.br",
    );
  }
  if (url.protocol !== "https:") {
    throw new Error(`[config] NEXT_PUBLIC_SITE_URL precisa usar https em produção (recebido "${raw}").`);
  }
  if (isLocalHostname(url.hostname)) {
    throw new Error(`[config] NEXT_PUBLIC_SITE_URL não pode ser local em produção (recebido "${raw}").`);
  }
  return url.origin;
}

function matchOrNull(value: string | undefined, pattern: RegExp): string | null {
  const raw = clean(value);
  return raw && pattern.test(raw) ? raw : null;
}

export const SITE_ENV: SiteEnv = parseSiteEnv(process.env.NEXT_PUBLIC_SITE_ENV);

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, SITE_ENV);

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
