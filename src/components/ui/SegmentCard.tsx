import Link from "next/link";
import type { Segment } from "@/types/content";
import { Icon } from "./Icon";
import { Media } from "./Media";

export function SegmentCard({ segment, headingLevel = "h3" }: { segment: Segment; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-3 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-card)] focus-within:border-accent/60">
      <Media
        image={segment.image}
        visual={segment.visual}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[4/3] rounded-[1.1rem]"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <Heading className="text-xl font-semibold tracking-tight">
          <Link
            href={`/segmentos/${segment.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
          >
            {segment.title}
          </Link>
        </Heading>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">{segment.shortDescription}</p>
        <span aria-hidden="true" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong">
          Ver segmento
          <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
