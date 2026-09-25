/**
 * Atribuição de campanhas — tipos compartilhados e sanitização server-side.
 *
 * - first_touch: primeira visita registrada neste navegador. NUNCA é
 *   sobrescrito, mesmo que o usuário volte depois por outra campanha.
 * - last_touch: última entrada com sinal de campanha (UTM, gclid, fbclid)
 *   ou referência externa. Navegação direta não apaga o último sinal.
 * - origin_url: primeira URL da sessão atual.
 * - conversion_page: URL em que o formulário foi enviado.
 *
 * Horários enviados pelo navegador são apenas informativos; o timestamp
 * oficial do lead é gerado pelo servidor.
 */

export const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export type CampaignParam = (typeof CAMPAIGN_PARAMS)[number];

export type Touch = Partial<Record<CampaignParam, string>> & {
  referrer: string | null;
  landing_page: string;
  /** Horário do navegador — informativo, não confiável. */
  client_captured_at: string | null;
};

export interface AttributionPayload {
  first_touch: Touch | null;
  last_touch: Touch | null;
  origin_url: string | null;
  conversion_page: string | null;
  referrer: string | null;
}

const MAX_PARAM_LENGTH = 300;
const MAX_URL_LENGTH = 2000;

function limitedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function httpUrl(value: unknown): string | null {
  const raw = limitedString(value, MAX_URL_LENGTH);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeTouch(value: unknown): Touch | null {
  if (!isRecord(value)) return null;
  const landing = httpUrl(value.landing_page);
  if (!landing) return null;
  const touch: Touch = {
    referrer: httpUrl(value.referrer),
    landing_page: landing,
    client_captured_at: limitedString(value.client_captured_at, 40),
  };
  for (const key of CAMPAIGN_PARAMS) {
    const param = limitedString(value[key], MAX_PARAM_LENGTH);
    if (param) touch[key] = param;
  }
  return touch;
}

/** Aceita somente as chaves conhecidas, com tamanho limitado. */
export function sanitizeAttribution(value: unknown): AttributionPayload {
  const source = isRecord(value) ? value : {};
  return {
    first_touch: sanitizeTouch(source.first_touch),
    last_touch: sanitizeTouch(source.last_touch),
    origin_url: httpUrl(source.origin_url),
    conversion_page: httpUrl(source.conversion_page),
    referrer: httpUrl(source.referrer),
  };
}
