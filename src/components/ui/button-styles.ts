import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSurface = "light" | "dark";

const base =
  "group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-none px-6 text-sm font-semibold transition duration-200 ease-out active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    primary:
      "bg-accent text-accent-foreground shadow-sm hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_10px_24px_rgb(35_44_115/0.18)] focus-visible:outline-primary",
    secondary:
      "border border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-primary hover:text-accent-strong focus-visible:outline-primary",
    ghost: "px-2 text-accent-strong hover:text-ink focus-visible:outline-primary",
  },
  dark: {
    primary:
      "bg-surface text-ink hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_10px_24px_rgb(0_0_0/0.25)] focus-visible:outline-surface",
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
