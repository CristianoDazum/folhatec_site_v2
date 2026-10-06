import Image from "next/image";
import Link from "next/link";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Logo oficial (SiteSettings/CMS). Sobre fundo escuro, o logo — que tem
 * texto azul — fica numa placa branca para manter o contraste.
 * Sem logo cadastrado, exibe o nome da empresa em texto.
 */
export function Logo({
  name,
  logo,
  surface = "light",
}: {
  name: string;
  logo: ContentImage | null;
  surface?: "light" | "dark";
}) {
  const dark = surface === "dark";
  return (
    <Link
      href="/"
      className={cn("inline-flex min-w-0 shrink-0 items-center", dark && logo && "bg-surface px-4 py-3")}
      aria-label={`${name} — página inicial`}
    >
      {logo ? (
        <Image
          src={logo.url}
          alt=""
          width={logo.width}
          height={logo.height}
          sizes="200px"
          className="h-9 w-auto sm:h-10"
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
