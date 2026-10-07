import Image from "next/image";
import Link from "next/link";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Logo oficial (SiteSettings/CMS).
 * - Fundo claro: logo principal.
 * - Fundo escuro: versão para fundo escuro (`logoOnDark`); se não houver,
 *   o logo principal sobre placa branca, para manter o contraste.
 * Sem logo cadastrado, exibe o nome da empresa em texto.
 */
export function Logo({
  name,
  logo,
  logoOnDark = null,
  surface = "light",
}: {
  name: string;
  logo: ContentImage | null;
  logoOnDark?: ContentImage | null;
  surface?: "light" | "dark";
}) {
  const dark = surface === "dark";
  const image = dark ? (logoOnDark ?? logo) : logo;
  const needsPlate = dark && !logoOnDark && Boolean(logo);

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center transition-opacity duration-200 hover:opacity-85",
        needsPlate && "bg-surface px-4 py-3",
      )}
      aria-label={`${name} — página inicial`}
    >
      {image ? (
        <Image
          src={image.url}
          alt=""
          width={image.width}
          height={image.height}
          sizes="240px"
          className={dark && logoOnDark ? "h-7 w-auto sm:h-8" : "h-9 w-auto sm:h-10"}
          priority={!dark}
        />
      ) : (
        <span className={cn("font-display text-2xl font-bold tracking-tight", dark ? "text-white" : "text-primary")}>
          {name}
        </span>
      )}
    </Link>
  );
}
