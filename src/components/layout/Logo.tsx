import Image from "next/image";
import Link from "next/link";
import type { ContentImage } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Logo oficial quando cadastrado no CMS/fallback; até lá, wordmark tipográfico
 * com o nome da empresa (sem simular o logotipo oficial).
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
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label={`${name} — página inicial`}>
      {logo ? (
        <Image src={logo.url} alt="" width={logo.width} height={logo.height} className="h-9 w-auto" priority />
      ) : (
        <>
          <span aria-hidden="true" className="flex size-9 flex-col justify-center gap-1 rounded-lg bg-ink px-2">
            <span className="h-1 w-full rounded-full bg-accent-on-dark" />
            <span className="h-1 w-3/4 rounded-full bg-white/80" />
            <span className="h-1 w-1/2 rounded-full bg-white/50" />
          </span>
          <span
            className={cn(
              "font-display text-xl font-bold tracking-tight",
              surface === "dark" ? "text-white" : "text-ink",
            )}
          >
            {name}
          </span>
        </>
      )}
    </Link>
  );
}
