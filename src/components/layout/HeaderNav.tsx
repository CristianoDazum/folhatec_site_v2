"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { buttonClassName } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { NavSolutionItem } from "@/types/navigation";

const LINKS = [
  { href: "/empresa", label: "Empresa" },
  { href: "/segmentos", label: "Segmentos" },
  { href: "/conteudos", label: "Conteúdos" },
  { href: "/contato", label: "Contato" },
] as const;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isSection(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = isSection(pathname, href);
  return (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      className={cn(
        "relative py-2 text-sm font-semibold transition-colors hover:text-ink",
        active ? "text-ink after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-accent" : "text-muted",
      )}
    >
      {label}
    </Link>
  );
}

export function HeaderNav({
  solutions,
  whatsappUrl,
}: {
  solutions: NavSolutionItem[];
  whatsappUrl: string | null;
}) {
  const pathname = usePathname();

  // Menus guardam a rota em que foram abertos: ao navegar, fecham sozinhos.
  const [mobileOpenAt, setMobileOpenAt] = useState<string | null>(null);
  const [dropdownOpenAt, setDropdownOpenAt] = useState<string | null>(null);
  const mobileOpen = mobileOpenAt === pathname;
  const dropdownOpen = dropdownOpenAt === pathname;

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const openedByHover = useRef(false);

  const openDropdown = () => setDropdownOpenAt(pathname);
  const closeDropdown = () => setDropdownOpenAt(null);
  const closeMobile = () => setMobileOpenAt(null);

  /* ---------------- Dropdown (desktop) ---------------- */

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setDropdownOpenAt(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropdownOpen]);

  const onDropdownKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && dropdownOpen) {
      event.preventDefault();
      closeDropdown();
      dropdownButtonRef.current?.focus();
    }
    if (event.key === "ArrowDown" && event.target === dropdownButtonRef.current) {
      event.preventDefault();
      openDropdown();
      requestAnimationFrame(() => {
        dropdownRef.current?.querySelector<HTMLAnchorElement>("[data-dropdown-item]")?.focus();
      });
    }
  };

  /* ---------------- Menu mobile ---------------- */

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobilePanelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpenAt(null);
    };
    desktop.addEventListener("change", onDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onDesktop);
    };
  }, [mobileOpen]);

  const onMobileKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!mobileOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobile();
      menuButtonRef.current?.focus();
      return;
    }
    if (event.key !== "Tab") return;

    // Mantém o foco entre o botão do menu e os itens do painel.
    const panelItems = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const cycle = [menuButtonRef.current, ...panelItems].filter((el): el is HTMLElement => el !== null);
    const first = cycle[0];
    const last = cycle[cycle.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
        <DesktopLink href="/empresa" label="Empresa" pathname={pathname} />

        <div
          ref={dropdownRef}
          className="relative"
          onMouseEnter={() => {
            if (!dropdownOpen) openedByHover.current = true;
            openDropdown();
          }}
          onMouseLeave={() => {
            openedByHover.current = false;
            closeDropdown();
          }}
          onKeyDown={onDropdownKeyDown}
          onBlur={(event) => {
            if (!dropdownRef.current?.contains(event.relatedTarget as Node | null)) closeDropdown();
          }}
        >
          <button
            ref={dropdownButtonRef}
            type="button"
            aria-expanded={dropdownOpen}
            aria-controls="menu-solucoes"
            onClick={() => {
              if (openedByHover.current) {
                openedByHover.current = false;
                return;
              }
              if (dropdownOpen) closeDropdown();
              else openDropdown();
            }}
            className={cn(
              "relative flex items-center gap-1.5 py-2 text-sm font-semibold transition-colors hover:text-ink",
              isSection(pathname, "/solucoes")
                ? "text-ink after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-accent"
                : "text-muted",
            )}
          >
            Soluções
            <Icon name="chevron" size={14} className={cn("transition-transform", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen ? (
            <div id="menu-solucoes" className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3">
              <ul className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)]">
                {solutions.map((solution) => (
                  <li key={solution.slug}>
                    <Link
                      data-dropdown-item
                      href={`/solucoes/${solution.slug}`}
                      aria-current={pathname === `/solucoes/${solution.slug}` ? "page" : undefined}
                      onClick={closeDropdown}
                      className="block rounded-xl px-4 py-3 transition hover:bg-background focus-visible:bg-background"
                    >
                      <span className="block text-sm font-semibold text-ink">{solution.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted">{solution.shortDescription}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-line pt-1">
                  <Link
                    data-dropdown-item
                    href="/solucoes"
                    onClick={closeDropdown}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-accent-strong transition hover:bg-background focus-visible:bg-background"
                  >
                    Ver todas as soluções
                    <Icon name="arrow" size={16} />
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        {LINKS.slice(1).map((link) => (
          <DesktopLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
        ))}

        <TrackedLink
          href="/solicitar-cotacao"
          event="click_solicitar_cotacao"
          params={{ cta_location: "header" }}
          className={buttonClassName("primary", "light", "min-h-11 px-5")}
        >
          Solicitar cotação
        </TrackedLink>
      </nav>

      {/* Mobile */}
      <div className="flex items-center gap-2 lg:hidden" onKeyDown={onMobileKeyDown}>
        {/* Visibilidade no wrapper: `hidden` no próprio botão conflitaria com o inline-flex da base. */}
        <div className="hidden sm:block">
          <TrackedLink
            href="/solicitar-cotacao"
            event="click_solicitar_cotacao"
            params={{ cta_location: "header_mobile" }}
            className={buttonClassName("primary", "light", "min-h-11 px-4 text-xs")}
          >
            Solicitar cotação
          </TrackedLink>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileOpenAt(mobileOpen ? null : pathname)}
          className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-ink transition hover:border-accent"
        >
          <Icon name={mobileOpen ? "close" : "menu"} />
        </button>

        <div
          ref={mobilePanelRef}
          id="menu-mobile"
          hidden={!mobileOpen}
          className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-surface"
        >
          <nav aria-label="Navegação mobile" className="container-site flex flex-col py-4">
            <ul>
              <li>
                <MobileLink href="/empresa" pathname={pathname} onNavigate={closeMobile}>
                  Empresa
                </MobileLink>
              </li>
              <li>
                <MobileLink href="/solucoes" pathname={pathname} onNavigate={closeMobile}>
                  Soluções
                </MobileLink>
                <ul className="border-b border-line pb-3 pl-4">
                  {solutions.map((solution) => (
                    <li key={solution.slug}>
                      <Link
                        href={`/solucoes/${solution.slug}`}
                        aria-current={pathname === `/solucoes/${solution.slug}` ? "page" : undefined}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center text-sm text-muted hover:text-ink"
                      >
                        {solution.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {LINKS.slice(1).map((link) => (
                <li key={link.href}>
                  <MobileLink href={link.href} pathname={pathname} onNavigate={closeMobile}>
                    {link.label}
                  </MobileLink>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3">
              <TrackedLink
                href="/solicitar-cotacao"
                event="click_solicitar_cotacao"
                params={{ cta_location: "menu_mobile" }}
                onNavigate={closeMobile}
                className={buttonClassName("primary", "light", "w-full")}
              >
                Solicitar cotação
                <Icon name="arrow" size={17} />
              </TrackedLink>
              {whatsappUrl ? (
                <TrackedLink
                  href={whatsappUrl}
                  external
                  newTab
                  event="click_whatsapp"
                  params={{ cta_location: "menu_mobile" }}
                  onNavigate={closeMobile}
                  className={buttonClassName("secondary", "light", "w-full")}
                >
                  <Icon name="message" size={17} />
                  Falar no WhatsApp
                </TrackedLink>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

function MobileLink({
  href,
  pathname,
  onNavigate,
  children,
}: {
  href: string;
  pathname: string;
  onNavigate: () => void;
  children: string;
}) {
  const active = isSection(pathname, href);
  return (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex min-h-14 items-center justify-between border-b border-line text-base font-semibold",
        active ? "text-accent-strong" : "text-ink",
      )}
    >
      {children}
      <Icon name="arrow" size={16} className="text-muted" />
    </Link>
  );
}
