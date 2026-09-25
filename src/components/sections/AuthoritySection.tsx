import Image from "next/image";
import type { AuthorityContent } from "@/types/content";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Provas de autoridade (números, logos, depoimentos, cases, certificações).
 * Cada bloco só aparece com `enabled: true` e itens cadastrados.
 * No lançamento todos estão desativados (sem autorização/validação).
 */
export function AuthoritySection({ content }: { content: AuthorityContent }) {
  const { statistics, certifications, testimonials, cases, clientLogos } = content;
  const show = {
    statistics: statistics.enabled && statistics.items.length > 0,
    clientLogos: clientLogos.enabled && clientLogos.items.length > 0,
    testimonials: testimonials.enabled && testimonials.items.length > 0,
    cases: cases.enabled && cases.items.length > 0,
    certifications: certifications.enabled && certifications.items.length > 0,
  };
  if (!Object.values(show).some(Boolean)) return null;

  return (
    <section aria-labelledby="autoridade" className="section-y bg-surface">
      <div className="container-site grid gap-14">
        <SectionHeading id="autoridade" eyebrow="Confiança" title="Referências e resultados" />

        {show.statistics ? (
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.items.map((item) => (
              <div key={item.label} className="min-w-0 border-t border-line pt-5">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-2 font-display text-4xl font-semibold tracking-tight">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {show.clientLogos ? (
          <div>
            <h3 className="text-lg font-semibold">{clientLogos.title ?? "Empresas atendidas"}</h3>
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {clientLogos.items.map((item) => (
                <li key={item.name} className="flex h-16 items-center justify-center">
                  <Image
                    src={item.logo.url}
                    alt={item.name}
                    width={item.logo.width}
                    height={item.logo.height}
                    className="max-h-12 w-auto"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {show.testimonials ? (
          <div>
            <h3 className="text-lg font-semibold">{testimonials.title ?? "Depoimentos"}</h3>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {testimonials.items.map((item) => {
                const detail = [item.role, item.company].filter(Boolean).join(", ");
                return (
                  <li key={item.quote} className="rounded-[var(--radius-card)] border border-line p-6">
                    <figure>
                      <blockquote className="leading-7">{item.quote}</blockquote>
                      <figcaption className="mt-4 text-sm text-muted">
                        <strong className="text-ink">{item.author}</strong>
                        {detail ? ` — ${detail}` : null}
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {show.cases ? (
          <div>
            <h3 className="text-lg font-semibold">{cases.title ?? "Cases"}</h3>
            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {cases.items.map((item) => (
                <li key={item.title} className="rounded-[var(--radius-card)] border border-line p-6">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {show.certifications ? (
          <div>
            <h3 className="text-lg font-semibold">{certifications.title ?? "Certificações"}</h3>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.items.map((item) => (
                <li key={item.name} className="rounded-[var(--radius-card)] border border-line p-6">
                  <h4 className="font-semibold">{item.name}</h4>
                  {item.description ? <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
