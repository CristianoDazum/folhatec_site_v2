import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeAttribution } from "@/features/quote/attribution";
import { buildLead, deliverQuote } from "@/features/quote/server/deliver";
import { getRateLimiter } from "@/features/quote/server/rate-limit";
import type { QuoteApiResponse } from "@/features/quote/types";
import { QUOTE_MAX_BODY_BYTES, validateQuote } from "@/features/quote/validation";
import { getSegments, getSolutions } from "@/lib/content";

export const dynamic = "force-dynamic";

function reply(body: QuoteApiResponse, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Identificador não pessoal para rate limit (hash do IP, nunca logado). */
function clientKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reply({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > QUOTE_MAX_BODY_BYTES) {
    return reply({ ok: false, error: "payload_too_large" }, 413);
  }

  // O content-length pode estar ausente ou incorreto: mede o corpo real.
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > QUOTE_MAX_BODY_BYTES) {
    return reply({ ok: false, error: "payload_too_large" }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "invalid_json" }, 400);
  }
  if (!isRecord(body)) return reply({ ok: false, error: "invalid_json" }, 400);

  const rate = await getRateLimiter().check(clientKey(request));
  if (!rate.allowed) {
    return reply(
      { ok: false, error: "rate_limited" },
      429,
      rate.retryAfterSeconds ? { "retry-after": String(rate.retryAfterSeconds) } : undefined,
    );
  }

  // Honeypot: resposta idêntica à de sucesso, sem encaminhar o lead.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply({ ok: true, status: "delivered" }, 200);
  }

  const { data, errors } = validateQuote({
    name: body.name,
    company: body.company,
    phone: body.phone,
    email: body.email,
    message: body.message,
    consent: body.consent,
    solution: body.solution,
    segment: body.segment,
  });
  if (!data) return reply({ ok: false, error: "validation", fields: errors }, 400);

  // Contexto precisa corresponder a uma solução/segmento existente.
  const [solutions, segments] = await Promise.all([getSolutions(), getSegments()]);
  const unknownSolution = data.solution && !solutions.some((item) => item.slug === data.solution);
  const unknownSegment = data.segment && !segments.some((item) => item.slug === data.segment);
  const rawSolution = body.solution;
  const rawSegment = body.segment;
  const malformedContext =
    (typeof rawSolution === "string" && rawSolution.trim() !== "" && !data.solution) ||
    (typeof rawSegment === "string" && rawSegment.trim() !== "" && !data.segment);
  if (unknownSolution || unknownSegment || malformedContext) {
    return reply({ ok: false, error: "invalid_context" }, 400);
  }

  const lead = buildLead(data, sanitizeAttribution(body.attribution));
  const result = await deliverQuote(lead);

  switch (result.status) {
    case "delivered":
      return reply({ ok: true, status: "delivered" }, 200);
    case "stub":
      return reply({ ok: true, status: "stub" }, 202);
    case "not_configured":
      return reply({ ok: false, error: "delivery_not_configured" }, 503);
    case "failed":
      return reply({ ok: false, error: "delivery_failed" }, 502);
  }
}
