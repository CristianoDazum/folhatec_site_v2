/**
 * Captura de atribuição no navegador (localStorage/sessionStorage).
 * Falhas de storage (modo privado, bloqueio) são ignoradas: o formulário
 * continua funcionando, apenas sem dados de origem.
 */
import { CAMPAIGN_PARAMS, type AttributionPayload, type Touch } from "./attribution";

const FIRST_KEY = "folhatec:attribution:first";
const LAST_KEY = "folhatec:attribution:last";
const ORIGIN_KEY = "folhatec:attribution:origin";

let initialLoadHandled = false;

function read(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(storage: Storage | undefined, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // Storage indisponível — seguir sem persistir.
  }
}

function readTouch(key: string): Touch | null {
  const raw = read(window.localStorage, key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as Touch) : null;
  } catch {
    return null;
  }
}

function externalReferrer(): string | null {
  if (!document.referrer) return null;
  try {
    const referrer = new URL(document.referrer);
    return referrer.host === window.location.host ? null : referrer.toString();
  } catch {
    return null;
  }
}

/**
 * Registra a visita atual. Chamada no carregamento e a cada navegação
 * client-side; o referrer externo só é considerado no carregamento inicial.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const isInitialLoad = !initialLoadHandled;
  initialLoadHandled = true;

  const referrer = isInitialLoad ? externalReferrer() : null;
  const touch: Touch = {
    referrer,
    landing_page: url.toString(),
    client_captured_at: new Date().toISOString(),
  };
  let hasCampaign = false;
  for (const key of CAMPAIGN_PARAMS) {
    const value = url.searchParams.get(key)?.trim();
    if (value) {
      touch[key] = value.slice(0, 300);
      hasCampaign = true;
    }
  }

  if (!isInitialLoad && !hasCampaign) return;

  const serialized = JSON.stringify(touch);
  if (!read(window.localStorage, FIRST_KEY)) write(window.localStorage, FIRST_KEY, serialized);
  if (hasCampaign || referrer || !read(window.localStorage, LAST_KEY)) {
    write(window.localStorage, LAST_KEY, serialized);
  }
  if (!read(window.sessionStorage, ORIGIN_KEY)) write(window.sessionStorage, ORIGIN_KEY, url.toString());
}

export function getAttributionPayload(): AttributionPayload {
  return {
    first_touch: readTouch(FIRST_KEY),
    last_touch: readTouch(LAST_KEY),
    origin_url: read(window.sessionStorage, ORIGIN_KEY),
    conversion_page: window.location.href,
    referrer: externalReferrer(),
  };
}
