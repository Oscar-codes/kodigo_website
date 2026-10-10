import { professionalSections } from "./professional";

export interface NavItem {
  label: string;
  to: string;
  /** Items planos del submenu (un solo nivel). */
  children?: { label: string; to: string }[];
  /** Variante usada por Dropdown: el submenu se muestra agrupado por titulos (ej. rutas formativas). */
  groups?: { title: string; items: { label: string; to: string }[] }[];
}

// Menu principal del header Kodigo (ticket 1.10). Solo "Nosotros" y "Profesional"
// llevan submenu; el resto son hojas directas. Las rutas se resuelven asi:
//
//   - Items sin ruta propia -> scroll a un anchor existente en la home
//     (la mayoria cae en Benefits, Testimonials y otros <Section aria-labelledby>
//     ya renderizados). Los anchors son validos intra-pagina y dentro de HashRouter
//     de react-router (vite usa BrowserRouter y anchor va a la home).
//   - "Formaciones" apunta a /bootcamps, la pagina equivalente al antiguo
//     menu "Bootcamps" pero sin submenu (los grupos los seguimos manteniendo
//     via query/filter en BootcampsPage, no en la cabecera).
//   - "Clientes" y "Aplicar" aterrizan en /profesional/alianzas, que es la
//     pagina de aliados / aliados + formulario de alianza B2B. Mantener las
//     secciones "Clientes" y "Aplicar" separadas se justifica por la
//     conversion (cada una tiene un lead claro: explorar la comunidad vs.
//     iniciar un proceso de capacitacion B2B).
const nosotrosChildren: { label: string; to: string }[] = [
  { label: "Sobre Kodigo", to: "/nosotros" },
  { label: "Equipo", to: "/nosotros#equipo" },
  { label: "Historia", to: "/nosotros#historia" },
  { label: "Sala de prensa", to: "/nosotros#prensa" },
  { label: "Trabaja con nosotros", to: "/profesional/alianzas" },
];

export const navigation: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Formaciones", to: "/bootcamps" },
  { label: "Beneficios", to: "/#benefits-title" },
  { label: "Respaldo", to: "/#testimonials-title" },
  { label: "Clientes", to: "/profesional/alianzas" },
  { label: "Saber más", to: "/nosotros" },
  {
    label: "Nosotros",
    to: "/nosotros",
    children: nosotrosChildren,
  },
  {
    label: "Profesional",
    to: "/profesional",
    children: professionalSections.map((s) => ({ label: s.title, to: `/profesional/${s.slug}` })),
  },
  { label: "Aplicar", to: "/profesional/alianzas" },
];
