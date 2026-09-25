import { createHmac } from "node:crypto";
import { SITE_ENV, SITE_URL } from "@/lib/config/env";
import type { AttributionPayload } from "../attribution";
import type { QuoteData } from "../validation";

/** Timeout do webhook: a requisição nunca espera indefinidamente. */
export const WEBHOOK_TIMEOUT_MS = 8000;

export interface QuoteLead {
  /** Timestamp oficial — gerado pelo servidor. */
  submitted_at: string;
  site: { url: string; env: string };
  contact: {
    name: string;
    company: string | null;
    phone: string;
    email: string;
  };
  message: string | null;
  context: { solution: string | null; segment: string | null };
  consent: { privacy_policy: true; accepted_at: string };
  attribution: AttributionPayload;
}

export type DeliveryResult =
  | { status: "delivered" }
  | { status: "stub" }
  | { status: "not_configured" }
  | { status: "failed"; reason: "timeout" | "http_error" | "network_error"; httpStatus?: number };

export function buildLead(data: QuoteData, attribution: AttributionPayload, now = new Date()): QuoteLead {
  const timestamp = now.toISOString();
  return {
    submitted_at: timestamp,
    site: { url: SITE_URL, env: SITE_ENV },
    contact: { name: data.name, company: data.company, phone: data.phone, email: data.email },
    message: data.message,
    context: { solution: data.solution, segment: data.segment },
    consent: { privacy_policy: true, accepted_at: timestamp },
    attribution,
  };
}

function webhookConfig(): { url: string; secret: string | null } | null {
  const url = process.env.QUOTE_WEBHOOK_URL?.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  } catch {
    return null;
  }
  return { url, secret: process.env.QUOTE_WEBHOOK_SECRET?.trim() || null };
}

/**
 * Entrega o lead ao webhook configurado.
 * - Com QUOTE_WEBHOOK_URL: POST JSON assinado (HMAC SHA-256), com timeout.
 * - Sem webhook em development/staging: stub (nada é enviado).
 * - Sem webhook em production: `not_configured` (a API retorna erro).
 * Nenhum dado pessoal ou credencial é registrado em log.
 */
export async function deliverQuote(lead: QuoteLead): Promise<DeliveryResult> {
  const config = webhookConfig();

  if (!config) {
    if (SITE_ENV === "production") {
      console.error("[quote] QUOTE_WEBHOOK_URL ausente ou inválida em produção. Lead não entregue.");
      return { status: "not_configured" };
    }
    console.info("[quote] Webhook não configurado — stub de desenvolvimento (nenhum envio realizado).");
    return { status: "stub" };
  }

  const body = JSON.stringify(lead);
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "user-agent": "folhatec-site/quote-webhook",
  };
  if (config.secret) {
    headers["x-folhatec-signature"] = `sha256=${createHmac("sha256", config.secret).update(body).digest("hex")}`;
  }

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[quote] Webhook respondeu HTTP ${response.status}.`);
      return { status: "failed", reason: "http_error", httpStatus: response.status };
    }
    return { status: "delivered" };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error(`[quote] Falha ao chamar webhook (${timedOut ? "timeout" : "erro de rede"}).`);
    return { status: "failed", reason: timedOut ? "timeout" : "network_error" };
  }
}
