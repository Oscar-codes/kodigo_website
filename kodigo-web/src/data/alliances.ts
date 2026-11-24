// Contenido de la página "Alianzas" (Kodigo para empresas). Textos y cifras entregados por Kodigo.
// Las cifras se muestran tal cual; si cambian, se editan aquí.

/** Ruta comercial del Hero: workshops empresariales. */
export interface HeroRoute {
  id: "workshops";
  title: string;
  description: string;
  cta: string;
  href?: string;
}

export const alliancesHero = {
  title: "KODIGO PARA EMPRESAS",
  question: "Aprende a aplicar IA en tu trabajo, con proyectos reales",
  // Fragmento del titular que se resalta con el degradado de palabra clave.
  questionEmphasis: "IA en tu trabajo",
  subtitle: "Entrenamos a tus equipos para aplicar IA en procesos y necesidades reales de tu empresa.",
  // Ruta de conversión hacia Workshops.
  routes: [
    {
      id: "workshops",
      title: "Workshop empresarial",
      description:
        "Vive la experiencia Kodigo. Participa en nuestros workshops empresariales y conoce cómo llevamos la IA y la tecnología a situaciones reales de trabajo.",
      cta: "Ver workshops",
      href: "#workshops",
    },
  ] as HeroRoute[],
};

export const impactStats = [
  { value: 360, label: "Empresas capacitadas" },
  { value: 2800, label: "Profesionales capacitados" },
  { value: 80, label: "Alianzas estratégicas" },
];

/** Intención con la que se abre el formulario del workshop (FE-03). */
export type WorkshopIntent = "nov26_2026" | "workshops_2027";

export const workshop = {
  label: "Workshop con IA para empresas",
  title: "¿Quieres aprender IA rápidamente? Únete a nuestros workshops",
  lead: "Una sesión práctica para identificar oportunidades reales de IA en tu operación y definir por dónde empezar.",
  steps: [
    { icon: "target", title: "Detectá oportunidades de IA en tu empresa" },
    { icon: "bulb", title: "Conocé casos de uso aplicables a tu equipo" },
    { icon: "path", title: "Definí cómo llevarlos a la práctica" },
  ] as const,
  // Etiqueta que acompaña al logo en la cabecera del pase de registro.
  ticketTag: "Workshop · IA para empresas",
  // FE-03: último workshop de 2026, con todos los datos como texto HTML (no solo en el arte del pase).
  upcoming: {
    id: "nov26_2026",
    badge: "ÚLTIMO WORKSHOP EMPRESARIAL DE 2026",
    title: "IA para equipos comerciales",
    description:
      "Una sesión práctica de nivel intermedio para explorar cómo integrar IA en procesos comerciales: prospección, forecast, propuestas y CRM.",
    date: "26 de noviembre de 2026",
    schedule: "1:00 p. m. - 4:00 p. m.",
    location: "CONAMYPE",
    speaker: "Óscar Guzmán, gerente de ventas",
    investment: "USD 180 por mesa para 4 personas. Persona adicional: USD 45.",
    cta: "Reservar mi lugar",
    supporting: "Último workshop empresarial del año. Asegura la participación de tu equipo.",
  },
  // FE-03: preinscripción a la agenda 2027. Sin fechas ni temáticas inventadas: solo el interés.
  preregistration2027: {
    id: "workshops_2027",
    badge: "WORKSHOPS EMPRESARIALES 2027",
    title: "Prepárate para llevar nuevas habilidades a tu equipo en 2027.",
    description:
      "Estamos preparando una nueva agenda de workshops empresariales para 2027. Déjanos tus datos y sé de los primeros en conocer las fechas y temáticas.",
    cta: "Preinscribir a mi empresa",
    supporting: "Registra tu interés y recibe información antes de que abramos las próximas convocatorias",
  },
  // Contenido del modal de HubSpot según la intención del CTA.
  registration: {
    nov26_2026: {
      eyebrow: "Workshop · IA para empresas",
      title: "Regístrate al Workshop",
      intro: "Déjanos tus datos para recibir más detalles del evento.",
    },
    workshops_2027: {
      eyebrow: "Workshops empresariales 2027",
      title: "Preinscribe a tu empresa",
      intro: "Déjanos tus datos y te contactaremos cuando abramos las próximas convocatorias.",
    },
  } as Record<WorkshopIntent, { eyebrow: string; title: string; intro: string }>,
};

export const successCases = {
  label: "CASOS DE ÉXITO",
  titleStart: "Empresas que ya están ",
  titleEmphasis: "transformando sus equipos con Kodigo.",
  // Tarjeta al final de las pestañas: lleva al muro de aliados.
  more: "Y muchos más",
  lead: "Conoce algunas de las organizaciones que han confiado en Kodigo para desarrollar nuevas capacidades, impulsar el talento y llevar la IA a su operación.",
  // "partner" debe coincidir con el nombre en content/partners.csv (de ahí sale el logo).
  // Textos y cifras entregados por Kodigo, tal cual.
  cases: [
    {
      partner: "Coderland",
      badge: "CODERLAND - PANAMÁ",
      text: "Desarrollamos junto a Coderland un programa de becas corporativas como parte de su estrategia de responsabilidad corporativa, brindando a mujeres en Panamá una ruta de formación Full Stack Jr. para fortalecer su desarrollo dentro del sector tecnológico.",
      tags: [] as string[],
    },
    {
      partner: "Vidri",
      badge: "VIDRI - EL SALVADOR",
      text: "Un programa de upskilling en IA generativa diseñado para que la transformación digital nazca desde sus propios equipos. Acompañamos en la ideación, ejecución e implementación de casos de uso prácticos en diferentes áreas de la compañía, trabajando con equipos regionales.",
      tags: ["+40 profesionales", "8 casos de uso de IA implementados"],
    },
    {
      partner: "CBC",
      badge: "CBC - REGIÓN",
      text: "¿Y si tu beneficio de formación llegara también a la familia de tu equipo? CBC lo hizo: formación en análisis de datos para familiares y adopción acelerada de IA interna. Fidelización y capacidad tech en una sola jugada.",
      tags: ["30 familias impactadas", "Gen AI Skills"],
    },
    {
      partner: "Telus",
      badge: "TELUS DIGITAL",
      text: "En TELUS, crecer en tecnología no exige cambiar de empresa. Un programa abierto de desarrollo web para hacer reskilling del talento interno.",
      tags: ["13 colaboradoras reconvertidos a roles tech"],
    },
    {
      partner: "Casa Muñoz",
      badge: "CASA MUÑOZ - EL SALVADOR",
      text: "La transformación con IA también empieza por quienes toman las decisiones. En Casa Muñoz, formamos a líderes para identificar oportunidades, diseñar automatizaciones y aplicar agentes de IA a procesos estratégicos.",
      tags: ["3 procesos automatizados", "decisiones 22X más rápidas"],
    },
  ],
};

export const adaptiveTraining = {
  label: "Formación a tu medida",
  titleStart: "Antes de capacitar, ",
  titleEmphasis: "identifica qué necesita realmente tu equipo.",
  title: "Antes de capacitar, identifica qué necesita realmente tu equipo.",
  lead: "Diseñamos horarios, modalidad y ritmo alrededor de la operación de tu equipo. La formación se integra al trabajo, no compite con él.",
  // Iconos oficiales de Kodigo (Horarios / Ritmo / Modalidad / Contenido).
  features: [
    { icon: "horarios", title: "Horarios a la medida", text: "Bloques que respetan la jornada y los picos operativos." },
    { icon: "ritmo", title: "Ritmo adaptable", text: "Sesiones intensivas o distribuidas según la disponibilidad del equipo." },
    { icon: "modalidad", title: "Modalidad flexible", text: "Presencial, virtual o híbrida según las necesidades de la organización." },
    { icon: "contenido", title: "Contenido aplicado", text: "Casos y ejercicios conectados con los retos y procesos reales de la empresa." },
  ] as const,
  badge: { value: "+360", label: "Empresas capacitadas" },
  photoAlt: "Equipo de una empresa en una sesión de capacitación de Kodigo",
  photoSmallAlt: "Instructor de Kodigo presentando en un taller de IA",
};

// Sección "Aplicar" con el formulario de HubSpot (destino del botón "Aplicar" del menú en esta página).
export const applySection = {
  label: "Aplicar",
  title: "Aplica a Kodigo para empresas",
  loading: "Cargando formulario…",
  error: "No pudimos cargar el formulario. Recarga la página o inténtalo de nuevo en unos minutos.",
};

export const team = {
  label: "Nuestro equipo",
  title: "Un equipo que entiende los retos de tu empresa",
  lead: "Trabajamos contigo para convertir tus necesidades en rutas de formación concretas",
  // PENDIENTE: URL del perfil de LinkedIn de cada persona (https://www.linkedin.com/in/...). Sin URL, el botón se muestra
  // deshabilitado; con URL abre el perfil en una pestaña nueva.
  members: [
    { name: "Oscar Guzmán", role: "Gerente de Alianzas y Empleabilidad", photo: "oscar-guzman", linkedin: undefined as string | undefined },
    { name: "Moisés Vega", role: "Consultor de Soluciones Educativas y Tecnológicas", photo: "moises-vega", linkedin: undefined as string | undefined },
    { name: "Adriana Henríquez", role: "Especialista de Empleabilidad Tech", photo: "adriana-henriquez", linkedin: undefined as string | undefined },
    { name: "Evel Castro", role: "Ejecutivo de Cuentas Claves", photo: "evel-castro", linkedin: undefined as string | undefined },
  ],
  linkedinCta: "Ver perfil en LinkedIn",
};
