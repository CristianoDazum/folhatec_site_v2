"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Revela elementos `[data-reveal]` quando entram na tela (IntersectionObserver).
 *
 * - O que já está visível no carregamento é marcado como revelado ANTES de
 *   ativar `.js-reveal`, então nada pisca nem some.
 * - Sem JavaScript ou com prefers-reduced-motion, nada é ocultado.
 * - Só opacity/transform: sem layout shift.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    const viewportHeight = window.innerHeight;
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) element.classList.add("is-revealed");
    }
    document.documentElement.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    for (const element of elements) {
      if (!element.classList.contains("is-revealed")) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
