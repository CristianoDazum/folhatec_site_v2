import Image from "next/image";
import type { ContentImage, VisualKey } from "@/types/content";
import { cn } from "@/lib/cn";
import { IndustrialVisual } from "./IndustrialVisual";

/**
 * Exibe a fotografia real quando existir; caso contrário, a composição
 * visual neutra. O container define a proporção (sem layout shift).
 */
export function Media({
  image,
  visual,
  className,
  sizes,
  priority = false,
}: {
  image: ContentImage | null;
  visual: VisualKey;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!image) return <IndustrialVisual visual={visual} className={className} />;

  return (
    <div className={cn("relative overflow-clip bg-surface-muted", className)}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        {...(image.blurDataUrl ? { placeholder: "blur" as const, blurDataURL: image.blurDataUrl } : {})}
      />
    </div>
  );
}
