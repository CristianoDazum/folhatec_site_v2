import { getSiteSettings, getSolutions } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/contact";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./Logo";

export async function SiteHeader() {
  const [settings, solutions] = await Promise.all([getSiteSettings(), getSolutions()]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Logo name={settings.name} logo={settings.logo} />
        <HeaderNav
          solutions={solutions.map(({ slug, title, shortDescription }) => ({ slug, title, shortDescription }))}
          whatsappUrl={buildWhatsAppUrl(settings.contact.whatsapp)}
        />
      </div>
    </header>
  );
}
