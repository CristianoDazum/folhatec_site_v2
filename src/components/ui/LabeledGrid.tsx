import type { LabeledValue } from "@/types/content";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Lista de itens rotulados em grade. `numbered` exibe índice técnico
 * (01, 02…); caso contrário, marcador com ícone de verificação.
 */
export function LabeledGrid({
  items,
  numbered = false,
  columns = 3,
  surface = "light",
}: {
  items: LabeledValue[];
  numbered?: boolean;
  columns?: 2 | 3;
  surface?: "light" | "dark";
}) {
  const dark = surface === "dark";
  return (
    <ul
      className={cn(
        "grid gap-x-8 gap-y-2 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
      )}
    >
      {items.map((item, index) => (
        <li
          key={item.label}
          className={cn("flex min-w-0 gap-4 border-t py-5", dark ? "border-white/15" : "border-line")}
        >
          {numbered ? (
            <span
              className={cn(
                "shrink-0 pt-1 text-xs font-semibold tracking-[0.16em]",
                dark ? "text-accent-on-dark" : "text-accent-strong",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                dark ? "bg-white/10 text-accent-on-dark" : "bg-accent-soft text-accent-strong",
              )}
            >
              <Icon name="check" size={15} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug">{item.label}</h3>
            {item.description ? (
              <p className={cn("mt-1.5 text-sm leading-6", dark ? "text-white/75" : "text-muted")}>
                {item.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
