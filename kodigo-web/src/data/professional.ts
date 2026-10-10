export interface ProfessionalSection {
  slug: string;
  title: string;
  lead?: string;
  /** Muestra la franja de aliados (si hay contenido en src/data/content.ts). */
  showPartners?: boolean;
}

// PROVISIONAL: contenido por definir. Agregar nuevas subsecciones aquí.
export const professionalSections: ProfessionalSection[] = [
  { slug: "ppd", title: "PPD", lead: "Contenido de PPD pendiente de definir." },
  { slug: "alianzas", title: "Alianzas", showPartners: true },
];
