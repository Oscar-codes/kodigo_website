import { bootcamps } from "./bootcamps";
import { professionalSections } from "./professional";

export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
  /** Si existe, el submenú se muestra agrupado (por ruta formativa) en lugar de la lista plana. */
  groups?: { title: string; items: { label: string; to: string }[] }[];
}

// Rutas formativas del menú (decisión de Kodigo). Es independiente del campo "area" de las tarjetas.
// Todo bootcamp que no esté en IA ni Programación cae en Data, así un programa nuevo siempre aparece en el menú.
const aiRoute = ["gen-ai-to-agents", "ai-for-teachers", "ai-agents-essentials", "ai-data-trainee"];
const codeRoute = ["web-developer-frontend", "full-stack-jr"];
const toLink = (b: (typeof bootcamps)[number]) => ({ label: b.name, to: `/bootcamps/${b.slug}` });
const bootcampGroups = [
  { title: "Inteligencia Artificial", items: bootcamps.filter((b) => aiRoute.includes(b.slug)).map(toLink) },
  { title: "Programación", items: bootcamps.filter((b) => codeRoute.includes(b.slug)).map(toLink) },
  {
    title: "Data",
    items: bootcamps.filter((b) => !aiRoute.includes(b.slug) && !codeRoute.includes(b.slug)).map(toLink),
  },
].filter((g) => g.items.length > 0);

export const navigation: NavItem[] = [
  { label: "Inicio", to: "/" },
  {
    label: "Bootcamps",
    to: "/bootcamps",
    children: bootcamps.map(toLink),
    groups: bootcampGroups,
  },
  { label: "Nosotros", to: "/nosotros/" },
  {
    label: "Profesional",
    to: "/profesional",
    children: professionalSections.map((s) => ({ label: s.title, to: `/profesional/${s.slug}` })),
  },
];
