import Link from "next/link";
import type { Solution } from "@/types/content";
import { buildQuoteHref } from "@/lib/contact";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { Icon } from "./Icon";
import { Media } from "./Media";

/**
 * Card de solução. O link "Conhecer" cobre o card inteiro (stretched link);
 * o CTA de cotação, quando exibido, fica acima dele (z-10).
 */
export function SolutionCard({
  solution,
  showQuoteCta = false,
  headingLevel = "h3",
}: {
  solution: Solution;
  showQuoteCta?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-3 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-card)] focus-within:border-accent/60">
      <Media
        image={solution.image}
        visual={solution.visual}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[4/3] rounded-[1.1rem]"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        {solution.eyebrow ? <p className="eyebrow">{solution.eyebrow}</p> : null}
        <Heading className="mt-2 text-2xl font-semibold tracking-tight">{solution.title}</Heading>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{solution.shortDescription}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/solucoes/${solution.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
          >
            Conhecer solução
            <span className="sr-only">: {solution.title}</span>
            <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          {showQuoteCta ? (
            <TrackedLink
              href={buildQuoteHref({ solution: solution.slug })}
              event="click_solicitar_cotacao"
              params={{ cta_location: "solution_card", solution: solution.slug }}
              className="relative z-10 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent-strong"
              ariaLabel={`Solicitar cotação de ${solution.title}`}
            >
              Solicitar cotação
            </TrackedLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
