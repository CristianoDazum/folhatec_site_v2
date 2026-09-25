import type { ReactNode } from "react";
import type { ContentImage, VisualKey } from "@/types/content";
import type { BreadcrumbItem } from "@/types/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Media } from "@/components/ui/Media";

/** Hero de páginas internas: contém o único H1 da página. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  visual,
  image = null,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  visual?: VisualKey;
  image?: ContentImage | null;
}) {
  const hasMedia = Boolean(visual || image);
  return (
    <section className="border-b border-line bg-background">
      <div className="container-site py-10 sm:py-14 lg:py-16">
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={hasMedia ? "mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16" : "mt-8"}>
          <div className="reveal min-w-0 max-w-3xl">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="heading-page mt-4">{title}</h1>
            {description ? <p className="text-lead mt-6 max-w-2xl">{description}</p> : null}
            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>
          {hasMedia ? (
            <div className="reveal reveal-delay min-w-0">
              <Media
                image={image}
                visual={visual ?? "labels"}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/3] rounded-[var(--radius-panel)] border border-line"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
