/**
 * Helper central de tracking. Componentes NUNCA chamam gtag/GTM diretamente.
 *
 * Todo evento é enviado para `window.dataLayer` como `{ event, ...params }`
 * (formato consumido pelo GTM). Quando o GA4 é carregado diretamente (sem
 * GTM), o evento também é repassado a `gtag('event', ...)`.
 *
 * Sem GTM/GA4 configurados, os eventos continuam indo para o dataLayer —
 * isso permite inspecionar e testar o tracking sem scripts de terceiros.
 */

export type TrackingEventName =
  | "form_start"
  | "form_submit"
  | "form_success"
  | "form_error"
  | "click_whatsapp"
  | "click_phone"
  | "click_email"
  | "click_solicitar_cotacao"
  | "view_solution"
  | "view_segment"
  | "download_material";

export type TrackingParams = Record<string, string | number | boolean | null | undefined>;

export interface DataLayerEvent extends TrackingParams {
  event: TrackingEventName;
}

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    /** Definido pelo snippet de tracking: "gtm" | "ga4". */
    __folhatecAnalyticsMode?: "gtm" | "ga4";
  }
}

function cleanParams(params: TrackingParams): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") result[key] = value;
  }
  return result;
}

export function trackEvent(name: TrackingEventName, params: TrackingParams = {}): void {
  if (typeof window === "undefined") return;
  const payload = cleanParams(params);

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...payload });

  if (window.__folhatecAnalyticsMode === "ga4" && typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
}
