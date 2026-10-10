import { professionalSections } from "./professional";

// Mapa de cada item del menu a un anchor/ ruta concretos. La regla del ticket:
// "solo Nosotros y Profesional redirigen a otras paginas, los demas apuntan
// a sections de la home". Las sections que ya existen tienen id='<name>-title';
// Hero y CTA anadidos en este mismo commit. Las que se sugieren a continuacion
// (Acreditaciones, Apply form, CEO testimonials) NO existen todavia y tendran
// que crearse para cubrir los criterios del cliente - ver descripcion abajo.
//
//   Inicio        -> /                          (Hero)
//   Formaciones   -> /#bootcamps-title          (BootcampShowcase: 'Aprende con proposito /
//                                              Encuentra el bootcamp que te llevara
//                                              mas lejos'.)
//   Beneficios    -> /#experience-title         (Experience: 'La experiencia Kodigo /
//                                              No se trata solo de aprender. Se trata de
//                                              ponerlo en practica. Un recorrido formativo
//                                              claro...' + encabezado 'Metodologia Kodigo
//                                              / El metodo detras de tu proxima carrera tech'.)
//   Respaldo      -> /#career-path-title        (CareerPath: 'Por que Kodigo / Una formacion
//                                              con proposito, una comunidad que acompana.' La
//                                              pista 'Personas y conexiones / Las historias
//                                              reales tienen el mayor impacto' sigue servida
//                                              por el item de menu 'Clientes'.
//                                              Pendiente crear una seccion 'Acreditaciones y
//                                              ventajas competitivas' para que Respaldo tenga
//                                              contenido propio.)
//   Clientes      -> /#testimonials-title       (Testimonials: 'Personas y conexiones /
//                                              Las historias reales tienen el mayor impacto.'.
//                                              Falta seccion dedicada a CEOs/CTOs para
//                                              diferenciarlo de Testimonials actuales.)
//   Saber mas     -> /#faq-title                (FAQ: 'preguntas frecuentes'.)
//   Nosotros      -> /nosotros + subitems
//   Profesional    -> /profesional + subitems
//   Aplicar       -> /#cta                      (CallToAction CTA generico. Falta un
//                                              ApplySection con formulario de pre-aplicacion)
//
// Para 'scroll-margin-top' el Header sticky tiene 84->64 px; los scrolls
// quedan bajo la cabecera visible. scroll-behavior: smooth ya esta declarado
// en GlobalStyle.html para que la experiencia sea fluida.
export interface NavItem {
  label: string;
  to: string;
  /** Items planos del submenu (un solo nivel). */
  children?: { label: string; to: string }[];
  /** Variante usada por Dropdown: el submenu se muestra agrupado por titulos (ej. rutas formativas). */
  groups?: { title: string; items: { label: string; to: string }[] }[];
}

// "Sobre Kodigo" cuelga de /nosotros porque coincide con la intro de la pagina.
// Equipo, Historia y Sala de prensa son anchors intra-page que ya se
// reservan en AboutContent (id='about-title' es el actual; los anchors
// concretos #equipo / #historia / #prensa se anaden cuando se amplie la
// pagina Nosotros). "Trabaja con nosotros" mantiene el destino B2B.
const nosotrosChildren: { label: string; to: string }[] = [
  { label: "Sobre Kodigo", to: "/nosotros" },
  { label: "Equipo", to: "/nosotros#equipo" },
  { label: "Historia", to: "/nosotros#historia" },
  { label: "Sala de prensa", to: "/nosotros#prensa" },
  { label: "Trabaja con nosotros", to: "/profesional/alianzas" },
];

export const navigation: NavItem[] = [
  // ATRAER: slide del Hero + GoalsCard. Atraer al usuario y mostrarle las rutas disponibles.
  { label: "Inicio", to: "/" },

  // EXPLICAR: BootcampShowcase lista los bootcamps disponibles con copy exacto
  // 'Aprende con proposito' / 'Encuentra el bootcamp que te llevara mas lejos'.
  { label: "Formaciones", to: "/#bootcamps-title" },

  // CONECTAR: Experience.tsx contiene el copy exacto ('La experiencia Kodigo /
  // No se trata solo de aprender...') y Methodology.tsx contiene el siguiente
  // encabezado de la lista del usuario ('Metodologia Kodigo / El metodo detras
  // de tu proxima carrera tech'). Beneficios se enlaza a Experience, que es
  // la primera seccion de las dos; Methodology viene a continuacion en el
  // scroll. Si se quiere enlazar a Methodology hay que mover el anchor.
  { label: "Beneficios", to: "/#experience-title" },

  // GENERAR CONFIANZA: CareerPath tiene el copy exacto 'Por que Kodigo / Una
  // formacion con proposito, una comunidad que acompana.' (linea 397-399). El
  // usuario anade 'Personas y conexiones' como pista narrativa pero ese copy
  // vive en Testimonials (#testimonials-title); lo atiende Clientes en el menu.
  // Falta una seccion dedicada a 'Acreditaciones / Ventajas competitivas' que
  // justifique sola a Respaldo (se recomienda crearla para diferenciarse).
  { label: "Respaldo", to: "/#career-path-title" },

  // 'Personas y conexiones / Las historias reales tienen el mayor impacto.'
  // es exactamente el titulo del Testimonials.tsx.
  { label: "Clientes", to: "/#testimonials-title" },

  // FAQ: match exacto a la seccion existente - respondemos las preguntas
  // frecuentes del usuario.
  { label: "Saber más", to: "/#faq-title" },

  // 'Nosotros' y 'Profesional' son las unicas dos hojas que sacan al usuario
  // de la home, segun peticion del ticket.
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

  // CONVERTIR: la CallToAction al final del HeroModulesLight es el CTA
  // generico actual. Pendiente crear una seccion 'ApplySection' con
  // formulario de pre-aplicacion (nombre, email, bootcamp de interes,
  // boton 'Aplicar'). Mientras tanto la navegacion 'Aplicar' aterriza
  // en la CTA final.
  { label: "Aplicar", to: "/#cta" },
];
