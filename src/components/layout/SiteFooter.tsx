import Link from "next/link";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { getSegments, getSiteSettings, getSolutions } from "@/lib/content";
import { Logo } from "./Logo";

export async function SiteFooter() {
  const [settings, solutions, segments] = await Promise.all([getSiteSettings(), getSolutions(), getSegments()]);
  const year = new Date().getFullYear();
  const legalLine = [settings.legalName ?? settings.name, settings.cnpj ? `CNPJ ${settings.cnpj}` : null]
    .filter(Boolean)
    .join(" · ");

  const linkClass = "text-white/75 transition-colors hover:text-white";

  return (
    <footer className="bg-ink text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:py-20">
        <div className="min-w-0">
          <Logo name={settings.name} logo={settings.logo} surface="dark" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">{settings.description}</p>
        </div>

        <nav aria-label="Soluções no rodapé" className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">Soluções</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            {solutions.map((solution) => (
              <li key={solution.slug}>
                <Link href={`/solucoes/${solution.slug}`} className={linkClass}>
                  {solution.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional no rodapé" className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">Navegação</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            <li><Link href="/empresa" className={linkClass}>Empresa</Link></li>
            <li><Link href="/segmentos" className={linkClass}>Segmentos</Link></li>
            {segments.slice(0, 4).map((segment) => (
              <li key={segment.slug} className="pl-3">
                <Link href={`/segmentos/${segment.slug}`} className={linkClass}>
                  {segment.title}
                </Link>
              </li>
            ))}
            <li><Link href="/conteudos" className={linkClass}>Conteúdos</Link></li>
            <li><Link href="/contato" className={linkClass}>Contato</Link></li>
          </ul>
        </nav>

        <div className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">Atendimento</h2>
          <div className="mt-5">
            <ContactChannels settings={settings} location="footer" surface="dark" />
          </div>
          <div className="mt-6">
            <QuoteCta location="footer" surface="dark" className="min-h-11 px-5" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {legalLine}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {settings.socialLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {link.label}
              </a>
            ))}
            <Link href="/politica-de-privacidade" className="hover:text-white">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
