import type { FaqItem } from "@/types/content";
import { Icon } from "./Icon";

/** Accordion nativo (details/summary): acessível por teclado, sem JS. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group py-2">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 text-left text-base font-semibold [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">{item.question}</span>
            <Icon name="chevron" size={18} className="shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 pr-10 leading-7 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
