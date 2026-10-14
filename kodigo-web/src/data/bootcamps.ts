export interface SyllabusModule {
  title: string;
  topics?: string[];
}

export interface Bootcamp {
  slug: string;
  name: string;
  /** Descripción PROVISIONAL: reemplazar con el contenido oficial. */
  summary: string;
  area: "IA" | "Datos" | "Programación" | "Educación";
  // Detalle oficial (X-03). Todos opcionales: la página solo muestra lo que exista.
  duration?: string;
  modality?: string;
  level?: string;
  requirements?: string[];
  syllabus?: SyllabusModule[];
  /** Destino de inscripción propio; si falta se usa siteConfig.enrollmentUrl (X-06). */
  enrollmentUrl?: string;
}

// Fuente única de verdad: navegación, listado y rutas /bootcamps/:slug se generan desde bootcamps.json.
// El JSON se genera desde la plantilla CSV con `npm run content:import` (ver content/README.md).
// Contenido PROVISIONAL: las descripciones actuales son temporales hasta recibir el contenido oficial (X-03).
// PENDIENTE (X-05): confirmar si "Full Stack Jr" y "Full Stack AI Jr" son uno o dos programas.
import data from "./bootcamps.json";
import { demoDetails } from "./demo/bootcamps.demo";

const official = data as Bootcamp[];

// Modo demostración: añade detalle de EJEMPLO a cada programa (no existe en el build de producción).
export const bootcamps: Bootcamp[] = import.meta.env.MODE === "demo" ? official.map((b) => ({ ...b, ...demoDetails })) : official;

export const findBootcamp = (slug?: string) => bootcamps.find((b) => b.slug === slug);
