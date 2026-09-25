"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { buttonClassName } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/cn";
import { getAttributionPayload } from "./attribution-client";
import type { QuoteApiResponse, QuoteContextOption } from "./types";
import { QUOTE_LIMITS, validateQuote, type QuoteErrors, type QuoteField } from "./validation";

type Status = "idle" | "submitting" | "success" | "stub" | "error";

const FIELD_ORDER: QuoteField[] = ["name", "company", "phone", "email", "message", "consent"];

const inputClass =
  "block w-full min-w-0 rounded-[var(--radius-field)] border bg-surface px-4 py-3 text-base text-ink transition placeholder:text-muted/70 focus:outline-none focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

function fieldClass(hasError: boolean) {
  return cn(inputClass, hasError ? "border-error" : "border-line-strong");
}

export function QuoteForm({
  solution: initialSolution,
  segment: initialSegment,
  location,
}: {
  solution: QuoteContextOption | null;
  segment: QuoteContextOption | null;
  /** Página/área onde o formulário está (parâmetro de tracking). */
  location: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const [solution, setSolution] = useState(initialSolution);
  const [segment, setSegment] = useState(initialSegment);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const trackingContext = {
    form: "quote",
    form_location: location,
    solution: solution?.slug,
    segment: segment?.slug,
  };

  const handleFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_start", trackingContext);
  };

  const focusField = (field: QuoteField) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = new FormData(event.currentTarget);
    const values = {
      name: form.get("name"),
      company: form.get("company"),
      phone: form.get("phone"),
      email: form.get("email"),
      message: form.get("message"),
      consent: form.get("consent") === "on",
      solution: solution?.slug ?? null,
      segment: segment?.slug ?? null,
    };

    const { data, errors: clientErrors } = validateQuote(values);
    setErrors(clientErrors);
    if (!data) {
      const first = FIELD_ORDER.find((field) => clientErrors[field]);
      if (first) focusField(first);
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    trackEvent("form_submit", trackingContext);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: form.get("website") ?? "",
          attribution: getAttributionPayload(),
        }),
      });
      const result = (await response.json()) as QuoteApiResponse;

      if (result.ok && result.status === "delivered") {
        // Único ponto que dispara form_success: entrega confirmada pelo backend.
        trackEvent("form_success", trackingContext);
        setStatus("success");
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      if (result.ok && result.status === "stub") {
        setStatus("stub");
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      if (!result.ok && result.error === "validation") {
        setErrors(result.fields);
        setStatus("idle");
        trackEvent("form_error", { ...trackingContext, reason: "server_validation" });
        const first = FIELD_ORDER.find((field) => result.fields[field]);
        if (first) focusField(first);
        return;
      }
      setStatus("error");
      trackEvent("form_error", { ...trackingContext, reason: result.ok ? "unexpected" : result.error });
    } catch {
      setStatus("error");
      trackEvent("form_error", { ...trackingContext, reason: "network" });
    } finally {
      submittingRef.current = false;
    }
  };

  if (status === "success" || status === "stub") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="rounded-[var(--radius-panel)] border border-line bg-surface p-8 sm:p-10"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <Icon name="check" size={22} />
        </span>
        {status === "success" ? (
          <>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">Solicitação enviada.</h2>
            <p className="mt-3 leading-7 text-muted">
              Recebemos suas informações. A equipe da FolhaTec vai analisar a sua aplicação e retornar pelo
              contato informado.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">Solicitação validada.</h2>
            <p className="mt-3 leading-7 text-muted" data-testid="quote-stub-notice">
              Ambiente de homologação: os dados foram validados, mas nenhum envio real foi realizado.
            </p>
          </>
        )}
        <Link href="/" className={buttonClassName("secondary", "light", "mt-8")}>
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const submitting = status === "submitting";
  const errorId = (field: QuoteField) => `quote-${field}-error`;
  const describedBy = (field: QuoteField, hint?: string) =>
    [errors[field] ? errorId(field) : null, hint].filter(Boolean).join(" ") || undefined;

  const renderError = (field: QuoteField) =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-error">
        <span aria-hidden="true">!</span>
        {errors[field]}
      </p>
    ) : null;

  const contextItems = [
    solution ? { key: "solution" as const, label: "Solução", item: solution } : null,
    segment ? { key: "segment" as const, label: "Segmento", item: segment } : null,
  ].filter((entry) => entry !== null);

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      onInput={handleFirstInteraction}
      aria-describedby="quote-required-note"
      className="grid gap-6 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8"
    >
      {contextItems.length ? (
        <div className="rounded-2xl bg-accent-soft p-4" data-testid="quote-context">
          <p className="text-sm font-semibold text-ink">Sua solicitação é sobre:</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {contextItems.map((entry) => (
              <li
                key={entry.key}
                className="inline-flex min-w-0 items-center gap-2 rounded-full border border-accent/30 bg-surface py-1 pl-3 pr-1 text-sm"
              >
                <span className="min-w-0 truncate">
                  <span className="text-muted">{entry.label}: </span>
                  <strong className="font-semibold">{entry.item.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => (entry.key === "solution" ? setSolution(null) : setSegment(null))}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-accent-soft hover:text-ink"
                  aria-label={`Remover ${entry.label.toLowerCase()} ${entry.item.title}`}
                >
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p id="quote-required-note" className="text-sm text-muted">
        Campos marcados com <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> são obrigatórios.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="quote-name" className="mb-2 block text-sm font-semibold">
            Nome <span aria-hidden="true">*</span>
          </label>
          <input
            id="quote-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={QUOTE_LIMITS.name.max}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={fieldClass(Boolean(errors.name))}
          />
          {renderError("name")}
        </div>

        <div className="min-w-0">
          <label htmlFor="quote-company" className="mb-2 block text-sm font-semibold">
            Empresa
          </label>
          <input
            id="quote-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={QUOTE_LIMITS.company.max}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
            className={fieldClass(Boolean(errors.company))}
          />
          {renderError("company")}
        </div>

        <div className="min-w-0">
          <label htmlFor="quote-phone" className="mb-2 block text-sm font-semibold">
            Telefone / WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={QUOTE_LIMITS.phone.max}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone", "quote-phone-hint")}
            className={fieldClass(Boolean(errors.phone))}
          />
          <p id="quote-phone-hint" className="mt-2 text-xs text-muted">
            Com DDD, por exemplo: (47) 99999-9999
          </p>
          {renderError("phone")}
        </div>

        <div className="min-w-0">
          <label htmlFor="quote-email" className="mb-2 block text-sm font-semibold">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={QUOTE_LIMITS.email.max}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={fieldClass(Boolean(errors.email))}
          />
          {renderError("email")}
        </div>
      </div>

      <div className="min-w-0">
        <label htmlFor="quote-message" className="mb-2 block text-sm font-semibold">
          Mensagem
        </label>
        <textarea
          id="quote-message"
          name="message"
          rows={5}
          maxLength={QUOTE_LIMITS.message.max}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", "quote-message-hint")}
          className={cn(fieldClass(Boolean(errors.message)), "min-h-36 resize-y")}
        />
        <p id="quote-message-hint" className="mt-2 text-xs text-muted">
          Conte sobre a aplicação: produto, ambiente, quantidade estimada e prazo desejado.
        </p>
        {renderError("message")}
      </div>

      {/* Honeypot: invisível para pessoas; se preenchido, o lead é descartado. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <input
            id="quote-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
          />
          <label htmlFor="quote-consent" className="text-sm leading-6 text-muted">
            Concordo com o tratamento dos meus dados para retorno desta solicitação, conforme a{" "}
            <Link href="/politica-de-privacidade" className="font-semibold text-accent-strong underline underline-offset-2">
              Política de Privacidade
            </Link>
            . <span aria-hidden="true">*</span>
          </label>
        </div>
        {renderError("consent")}
      </div>

      {status === "error" ? (
        <div role="alert" className="rounded-2xl border border-error/30 bg-error-soft p-4 text-sm text-error">
          Não foi possível enviar sua solicitação agora. Tente novamente em instantes.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className={buttonClassName("primary", "light", "w-full sm:w-auto")}
        >
          {submitting ? "Enviando…" : "Solicitar cotação"}
          {!submitting ? <Icon name="arrow" size={17} /> : null}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {submitting ? "Enviando sua solicitação…" : ""}
        </p>
      </div>
    </form>
  );
}
