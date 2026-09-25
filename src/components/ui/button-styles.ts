import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSurface = "light" | "dark";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    primary:
      "bg-accent text-accent-foreground shadow-sm hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-accent",
    secondary:
      "border border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-accent hover:text-accent-strong focus-visible:outline-accent",
    ghost: "px-2 text-accent-strong hover:text-ink focus-visible:outline-accent",
  },
  dark: {
    primary:
      "bg-surface text-ink hover:-translate-y-0.5 hover:bg-accent-soft focus-visible:outline-surface",
    secondary:
      "border border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:outline-surface",
    ghost: "px-2 text-accent-on-dark hover:text-white focus-visible:outline-surface",
  },
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  surface: ButtonSurface = "light",
  className?: string,
): string {
  return cn(base, variants[surface][variant], className);
}
