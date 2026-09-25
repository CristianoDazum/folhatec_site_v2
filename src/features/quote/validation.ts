/**
 * Validação do formulário de cotação — módulo puro, usado no cliente
 * (feedback imediato) e no servidor (fonte de verdade).
 */

export const QUOTE_LIMITS = {
  name: { min: 2, max: 120 },
  company: { max: 120 },
  phone: { minDigits: 10, maxDigits: 13, max: 30 },
  email: { max: 160 },
  message: { max: 2000 },
  slug: { max: 80 },
} as const;

/** Tamanho máximo do corpo da requisição (bytes). */
export const QUOTE_MAX_BODY_BYTES = 16 * 1024;

export type QuoteField = "name" | "company" | "phone" | "email" | "message" | "consent";

export type QuoteErrors = Partial<Record<QuoteField, string>>;

export interface QuoteInput {
  name: unknown;
  company: unknown;
  phone: unknown;
  email: unknown;
  message: unknown;
  consent: unknown;
  solution?: unknown;
  segment?: unknown;
}

export interface QuoteData {
  name: string;
  company: string | null;
  phone: string;
  email: string;
  message: string | null;
  consent: true;
  solution: string | null;
  segment: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_ALLOWED = /^[\d\s()+.-]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Remove caracteres de controle (C0 e DEL). Em textos multilinha preserva
 * quebras de linha e tabulação.
 */
function stripControlChars(value: string, keepLineBreaks: boolean): string {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = code < 32 || code === 127;
    const isLineBreak = code === 9 || code === 10 || code === 13;
    if (!isControl || (keepLineBreaks && isLineBreak)) result += char;
  }
  return result;
}

/** Normaliza texto de linha única: remove controles e colapsa espaços. */
export function cleanLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripControlChars(value, false).replace(/\s+/g, " ").trim();
}

/** Normaliza texto multilinha preservando quebras de linha. */
export function cleanMultiline(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripControlChars(value, true)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanSlug(value: unknown): string | null {
  const slug = cleanLine(value).toLowerCase();
  return slug && slug.length <= QUOTE_LIMITS.slug.max && SLUG_PATTERN.test(slug) ? slug : null;
}

export function validateQuote(input: QuoteInput): { data: QuoteData | null; errors: QuoteErrors } {
  const errors: QuoteErrors = {};

  const name = cleanLine(input.name);
  if (!name) errors.name = "Informe seu nome.";
  else if (name.length < QUOTE_LIMITS.name.min) errors.name = "Informe seu nome completo.";
  else if (name.length > QUOTE_LIMITS.name.max) errors.name = `Use no máximo ${QUOTE_LIMITS.name.max} caracteres.`;

  const company = cleanLine(input.company);
  if (company.length > QUOTE_LIMITS.company.max) {
    errors.company = `Use no máximo ${QUOTE_LIMITS.company.max} caracteres.`;
  }

  const phone = cleanLine(input.phone);
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Informe um telefone ou WhatsApp.";
  else if (
    phone.length > QUOTE_LIMITS.phone.max ||
    !PHONE_ALLOWED.test(phone) ||
    phoneDigits.length < QUOTE_LIMITS.phone.minDigits ||
    phoneDigits.length > QUOTE_LIMITS.phone.maxDigits
  ) {
    errors.phone = "Informe um telefone válido com DDD.";
  }

  const email = cleanLine(input.email).toLowerCase();
  if (!email) errors.email = "Informe seu e-mail.";
  else if (email.length > QUOTE_LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  const message = cleanMultiline(input.message);
  if (message.length > QUOTE_LIMITS.message.max) {
    errors.message = `Use no máximo ${QUOTE_LIMITS.message.max} caracteres.`;
  }

  if (input.consent !== true) {
    errors.consent = "É necessário concordar com a Política de Privacidade.";
  }

  if (Object.keys(errors).length) return { data: null, errors };

  return {
    data: {
      name,
      company: company || null,
      phone,
      email,
      message: message || null,
      consent: true,
      solution: cleanSlug(input.solution),
      segment: cleanSlug(input.segment),
    },
    errors,
  };
}
