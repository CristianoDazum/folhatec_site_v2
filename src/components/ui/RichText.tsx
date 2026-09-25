import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichTextImage, RichTextNode } from "@/types/content";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: RichTextImage }) => (
      <figure className="my-8">
        <Image
          src={value.url}
          alt={value.alt}
          width={value.width}
          height={value.height}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full rounded-2xl"
        />
      </figure>
    ),
  },
  block: {
    // A página já possui o H1 (título do artigo); títulos do corpo começam em H2.
    h1: ({ children }) => <h2>{children}</h2>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

/** Renderiza Portable Text já normalizado pelo data layer. */
export function RichText({ value }: { value: RichTextNode[] }) {
  return (
    <div className="prose-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
