import type { ReactNode } from "react";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { buttonClassName, type ButtonSurface, type ButtonVariant } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsAppUrl } from "@/lib/contact";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * CTA secundário "Falar com um especialista".
 * Com WhatsApp configurado → abre conversa com mensagem contextual.
 * Sem WhatsApp → leva à página de contato (nunca link quebrado).
 */
export function SpecialistCta({
  whatsapp,
  message,
  location,
  variant = "secondary",
  surface = "light",
  className,
  children = "Falar com um especialista",
}: {
  whatsapp: string | null;
  message?: string | null;
  location: string;
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  className?: string;
  children?: ReactNode;
}) {
  const url = buildWhatsAppUrl(whatsapp, message ?? undefined);

  if (!url) {
    return (
      <ButtonLink href="/contato" variant={variant} surface={surface} className={className}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <TrackedLink
      href={url}
      external
      newTab
      event="click_whatsapp"
      params={{ cta_location: location }}
      className={buttonClassName(variant, surface, className)}
    >
      <Icon name="message" size={17} />
      {children}
    </TrackedLink>
  );
}
