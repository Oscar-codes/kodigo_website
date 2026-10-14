import raw from "./partners.json";

// Categorías de aliados para la sección "Clientes" del Inicio (carrusel por categoría).
// PROVISIONAL: la agrupación y los logos destacados los propuso el equipo de desarrollo a partir de los nombres; Kodigo debe
// confirmarlos. Cada categoría muestra solo 4 logos representativos (no hace falta mostrar los 49).
// Los logos blancos salen de `npm run assets:build` + `node scripts/build-white-logos.mjs` (src/assets/partners-white/).

export interface PartnerGroup {
  /** Etiqueta corta sobre el título, p. ej. "Educación". */
  kicker: string;
  title: string;
  text: string;
  /** Nombres tal como están en partners.json (máx. 4). */
  partners: readonly string[];
}

export const partnerGroups: readonly PartnerGroup[] = [
  {
    kicker: "Educación",
    title: "Centros educativos e instituciones",
    text: "Apoyamos la formación junto a centros educativos e instituciones.",
    partners: ["Universidad de Oriente (UNIVO)", "Universidad Gerardo Barrios", "Fundación Padre Arrupe", "JA El Salvador"],
  },
  {
    kicker: "Tecnología",
    title: "Empresas de tecnología",
    text: "Formamos y empleamos talento según las necesidades de contratación de estas empresas.",
    partners: ["Applaudo", "Coderland", "Teknergy", "TechyWe"],
  },
  {
    kicker: "Telecomunicaciones",
    title: "Telecomunicaciones y contact center",
    text: "Formamos y empleamos talento según las necesidades de contratación de estas empresas.",
    partners: ["Movistar", "Tigo", "Telus", "Foundever"],
  },
  {
    kicker: "Finanzas",
    title: "Finanzas y servicios profesionales",
    text: "Formamos y empleamos talento según las necesidades de contratación de estas empresas.",
    partners: ["Ria Money Transfer", "RSM", "Caoba Capital", "Integral"],
  },
  {
    kicker: "Comercio e industria",
    title: "Comercio e industria",
    text: "Formamos y empleamos talento según las necesidades de contratación de estas empresas.",
    partners: ["Vidri", "Farmacias San Nicolás", "Casa Muñoz", "CBC"],
  },
];

const whiteLogos = import.meta.glob<string>("../assets/partners-white/*.webp", { eager: true, query: "?url", import: "default" });

export interface WhiteLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

/** Logo blanco monocromo de un aliado (para fondos azules). Falla en desarrollo si el nombre o el archivo no existen. */
export const whiteLogoOf = (name: string): WhiteLogo => {
  const p = raw.find((r) => r.name === name);
  const src = p && whiteLogos[`../assets/partners-white/${p.file}`];
  if (!p || !src) throw new Error(`Sin logo blanco para "${name}": revisa partnerGroups.ts o ejecuta scripts/build-white-logos.mjs`);
  return { name, src, width: p.width, height: p.height };
};
