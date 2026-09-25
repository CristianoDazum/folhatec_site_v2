import type { ReactNode } from "react";
import type { SiteSettings } from "@/types/content";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { buildEmailHref, buildPhoneHref, buildWhatsAppUrl, formatAddress } from "@/lib/contact";
import { cn } from "@/lib/cn";

/**
 * Canais de contato a partir de SiteSettings. Cada canal só aparece quando
 * configurado. Retorna null se nenhum existir.
 */
export function ContactChannels({
  settings,
  location,
  whatsappMessage,
  surface = "light",
  layout = "list",
}: {
  settings: SiteSettings;
  location: string;
  whatsappMessage?: string | null;
  surface?: "light" | "dark";
  layout?: "list" | "cards";
}) {
  const { contact } = settings;
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, whatsappMessage ?? undefined);
  const phoneHref = buildPhoneHref(contact.phone);
  const emailHref = buildEmailHref(contact.email);
  const address = formatAddress(contact.address);

  const channels: Array<{ key: string; icon: IconName; label: string; value: string; node?: ReactNode }> = [];
  const linkClass = "break-words font-semibold hover:text-accent-strong";

  if (whatsappUrl && contact.whatsapp) {
    channels.push({
      key: "whatsapp",
      icon: "message",
      label: "WhatsApp",
      value: contact.whatsapp,
      node: (
        <TrackedLink href={whatsappUrl} external newTab event="click_whatsapp" params={{ cta_location: location }} className={linkClass}>
          Conversar pelo WhatsApp
        </TrackedLink>
      ),
    });
  }
  if (phoneHref && contact.phone) {
    channels.push({
      key: "phone",
      icon: "phone",
      label: "Telefone",
      value: contact.phone,
      node: (
        <TrackedLink href={phoneHref} external event="click_phone" params={{ cta_location: location }} className={linkClass}>
          {contact.phone}
        </TrackedLink>
      ),
    });
  }
  if (emailHref && contact.email) {
    channels.push({
      key: "email",
      icon: "mail",
      label: "E-mail",
      value: contact.email,
      node: (
        <TrackedLink href={emailHref} external event="click_email" params={{ cta_location: location }} className={linkClass}>
          {contact.email}
        </TrackedLink>
      ),
    });
  }
  if (address) channels.push({ key: "address", icon: "pin", label: "Endereço", value: address });
  if (contact.businessHours) {
    channels.push({ key: "hours", icon: "clock", label: "Horário de atendimento", value: contact.businessHours });
  }

  if (!channels.length) return null;
  const dark = surface === "dark";

  return (
    <ul className={cn(layout === "cards" ? "grid gap-4 sm:grid-cols-2" : "grid gap-4")}>
      {channels.map((channel) => (
        <li
          key={channel.key}
          className={cn(
            "flex min-w-0 gap-3",
            layout === "cards" && "rounded-2xl border border-line bg-surface p-5",
          )}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              dark ? "bg-white/10 text-accent-on-dark" : "bg-accent-soft text-accent-strong",
            )}
          >
            <Icon name={channel.icon} size={17} />
          </span>
          <div className="min-w-0 text-sm">
            <p className={cn("text-xs font-semibold uppercase tracking-[0.12em]", dark ? "text-white/70" : "text-muted")}>
              {channel.label}
            </p>
            <div className="mt-1 break-words">{channel.node ?? channel.value}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
