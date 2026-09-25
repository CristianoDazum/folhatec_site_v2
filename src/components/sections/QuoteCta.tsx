import type { ReactNode } from "react";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { buttonClassName, type ButtonSurface, type ButtonVariant } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { buildQuoteHref } from "@/lib/contact";

/** CTA principal "Solicitar cotação" com contexto e evento de clique. */
export function QuoteCta({
  location,
  solution,
  segment,
  variant = "primary",
  surface = "light",
  className,
  children = "Solicitar cotação",
}: {
  location: string;
  solution?: string | null;
  segment?: string | null;
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <TrackedLink
      href={buildQuoteHref({ solution, segment })}
      event="click_solicitar_cotacao"
      params={{ cta_location: location, solution: solution ?? undefined, segment: segment ?? undefined }}
      className={buttonClassName(variant, surface, className)}
    >
      {children}
      <Icon name="arrow" size={17} />
    </TrackedLink>
  );
}
