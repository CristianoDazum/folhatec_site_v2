import type { ContactSettings, PostalAddress } from "@/types/content";

/** Mensagem padrão do WhatsApp quando a página não define uma contextual. */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, vim pelo site da FolhaTec e gostaria de falar com um especialista.";

/**
 * Link wa.me com mensagem pré-preenchida. Retorna `null` quando o número
 * não está configurado — o componente não renderiza link quebrado.
 */
export function buildWhatsAppUrl(whatsapp: string | null, message = DEFAULT_WHATSAPP_MESSAGE): string | null {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildPhoneHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.replace(/\D/g, "").length >= 8 ? `tel:${digits}` : null;
}

export function buildEmailHref(email: string | null): string | null {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return `mailto:${email}`;
}

export function formatAddress(address: PostalAddress | null): string | null {
  if (!address) return null;
  const cityState = [address.city, address.state].filter(Boolean).join(" – ");
  const parts = [address.street, cityState, address.postalCode].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function hasAnyContactChannel(contact: ContactSettings): boolean {
  return Boolean(
    buildWhatsAppUrl(contact.whatsapp) ||
      buildPhoneHref(contact.phone) ||
      buildEmailHref(contact.email) ||
      formatAddress(contact.address),
  );
}

/** Link da cotação com contexto opcional de solução/segmento. */
export function buildQuoteHref(context: { solution?: string | null; segment?: string | null } = {}): string {
  const params = new URLSearchParams();
  if (context.solution) params.set("solucao", context.solution);
  if (context.segment) params.set("segmento", context.segment);
  const query = params.toString();
  return query ? `/solicitar-cotacao?${query}` : "/solicitar-cotacao";
}
