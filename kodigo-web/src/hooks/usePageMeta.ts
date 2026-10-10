import { useEffect } from "react";
import { isDemo } from "@/config/mode";
import { siteConfig } from "@/data/site";

interface PageMeta {
  /** Título de la página; sin valor usa el del sitio. */
  title?: string;
  /** Meta descripción; sin valor usa la del sitio. */
  description?: string;
  /** Páginas que no deben indexarse (p. ej. el 404 de la SPA). */
  noindex?: boolean;
}

const setMeta = (name: string, content: string | null) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
};

/** Título, meta descripción y robots por ruta. Título: "<título> | Kodigo". */
export const usePageMeta = ({ title, description, noindex = false }: PageMeta = {}) => {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Bootcamps de tecnología e IA`;
    setMeta("description", description ?? siteConfig.description);
    // El modo demostración nunca debe indexarse.
    setMeta("robots", isDemo ? "noindex, nofollow" : noindex ? "noindex" : null);
  }, [title, description, noindex]);
};
