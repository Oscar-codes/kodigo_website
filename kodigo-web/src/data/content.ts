import { demoContent } from "./demo/content.demo";
import { partners } from "./partners";

// Contenido institucional opcional: cada sección del sitio solo se muestra si su dato existe.
// Producción: vacío hasta recibir el contenido oficial (X-04). Ver docs/SOLICITUD_DE_INSUMOS.md.

export interface AboutContent {
  heading: string;
  paragraphs: string[];
}

export interface Stat {
  /** Valor numérico final (se anima al entrar en pantalla). */
  value: number;
  /** Texto fijo tras el número, p. ej. "+" o "%". */
  suffix?: string;
  label: string;
  /** Fuente y fecha del dato: no se publican cifras sin respaldo. */
  source?: string;
}

export interface Partner {
  name: string;
  /** URL del logo (importado con Vite). Sin logo se muestra el nombre. */
  logo?: string;
  /** Dimensiones reales del logo, para reservar espacio y evitar saltos de layout. */
  width?: number;
  height?: number;
  url?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  /** Etiqueta secundaria (programa, cohorte, empresa) que da contexto verificado. */
  tag?: string;
  /** Categoría editorial del testimonio: agrupa la pestaña activa en la sección. */
  kind?: "estudiantes" | "proyectos" | "graduados" | "conexiones";
  /** Foto asociada al testimonio (asset importado, formato Vite-friendly). */
  image?: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface SiteContent {
  about?: AboutContent;
  stats?: Stat[];
  partners?: Partner[];
  faq?: FaqItem[];
  testimonials?: Testimonial[];
  steps?: Step[];
}

/** Contenido oficial. Los aliados ya son reales (content/partners.csv); el resto se llena al recibir los textos (X-04). */
const realContent: SiteContent = { partners };

// El modo demostración completa lo que aún no es oficial con contenido de EJEMPLO, sin reemplazar lo real.
export const content: SiteContent = import.meta.env.MODE === "demo" ? { ...realContent, ...demoContent } : realContent;
