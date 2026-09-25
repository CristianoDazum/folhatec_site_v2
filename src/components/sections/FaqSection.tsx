import type { FaqItem } from "@/types/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqJsonLd } from "@/lib/seo/json-ld";

/** FAQ com JSON-LD FAQPage. Não renderiza nada sem itens. */
export function FaqSection({ items, title = "Perguntas frequentes" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq" className="section-y">
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id="faq" eyebrow="FAQ" title={title} />
        <FaqList items={items} />
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}
