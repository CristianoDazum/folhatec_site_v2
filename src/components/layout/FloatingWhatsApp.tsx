import { TrackedLink } from "@/components/tracking/TrackedLink";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsAppUrl } from "@/lib/contact";
import type { SiteSettings } from "@/types/content";

/** Botão flutuante opcional — exige número configurado e flag ativa. */
export function FloatingWhatsApp({ settings }: { settings: SiteSettings }) {
  const url = settings.showFloatingWhatsApp ? buildWhatsAppUrl(settings.contact.whatsapp) : null;
  if (!url) return null;
  return (
    <TrackedLink
      href={url}
      external
      newTab
      event="click_whatsapp"
      params={{ cta_location: "floating_button" }}
      ariaLabel="Conversar com a FolhaTec pelo WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-pop)] transition hover:-translate-y-0.5 hover:bg-accent-strong"
    >
      <Icon name="message" size={24} />
    </TrackedLink>
  );
}
