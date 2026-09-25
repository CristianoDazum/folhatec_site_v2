import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function EmptyState({
  icon = "file",
  title,
  description,
  children,
}: {
  icon?: IconName;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
        <Icon name={icon} size={24} />
      </span>
      <h2 className="mx-auto mt-6 max-w-xl text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-muted">{description}</p>
      {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}
