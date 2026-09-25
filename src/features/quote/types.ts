import type { QuoteErrors } from "./validation";

/** Contexto opcional exibido no formulário (via query string). */
export interface QuoteContextOption {
  slug: string;
  title: string;
}

/**
 * Respostas de POST /api/quote.
 * - delivered: entrega confirmada pelo webhook → dispara form_success.
 * - stub: ambiente sem webhook (dev/staging) → NÃO dispara form_success.
 */
export type QuoteApiResponse =
  | { ok: true; status: "delivered" }
  | { ok: true; status: "stub" }
  | { ok: false; error: "validation"; fields: QuoteErrors }
  | {
      ok: false;
      error:
        | "invalid_json"
        | "invalid_context"
        | "unsupported_media_type"
        | "payload_too_large"
        | "rate_limited"
        | "delivery_failed"
        | "delivery_not_configured";
    };
