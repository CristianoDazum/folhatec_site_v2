import type { CallToAction } from "@/types/content";
import { QuoteCta } from "./QuoteCta";
import { SpecialistCta } from "./SpecialistCta";

/** Bloco final de conversão. Contexto opcional de solução/segmento. */
export function CtaSection({
  content,
  whatsapp,
  whatsappMessage,
  location,
  solution,
  segment,
}: {
  content: CallToAction;
  whatsapp: string | null;
  whatsappMessage?: string | null;
  location: string;
  solution?: string | null;
  segment?: string | null;
}) {
  const headingId = `cta-${location}`;
  return (
    <section aria-labelledby={headingId} className="container-site py-16 sm:py-20 lg:py-24">
      <div className="relative isolate overflow-clip rounded-[var(--radius-panel)] bg-ink px-6 py-12 text-white sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0 max-w-3xl">
            {content.eyebrow ? <p className="eyebrow text-accent-on-dark">{content.eyebrow}</p> : null}
            <h2 id={headingId} className="heading-section mt-4">
              {content.title}
            </h2>
            {content.description ? (
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{content.description}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <QuoteCta location={location} solution={solution} segment={segment} surface="dark" />
            <SpecialistCta whatsapp={whatsapp} message={whatsappMessage} location={location} surface="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
