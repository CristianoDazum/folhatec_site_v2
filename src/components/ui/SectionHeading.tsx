import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  surface = "light",
  className,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  /** id do h2, usado em aria-labelledby da seção. */
  id?: string;
  surface?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl min-w-0", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow", surface === "dark" && "text-accent-on-dark")}>{eyebrow}</p>
      ) : null}
      <h2 id={id} className="heading-section mt-4">
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-5 text-lead", surface === "dark" && "text-white/75")}>{description}</p>
      ) : null}
    </div>
  );
}
