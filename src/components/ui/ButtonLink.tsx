import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClassName, type ButtonSurface, type ButtonVariant } from "./button-styles";

/** Link de navegação com aparência de botão (sem tracking). */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  surface = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClassName(variant, surface, className)}>
      {children}
    </Link>
  );
}
