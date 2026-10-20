// Contenido de la página "Alianzas" (Kodigo para empresas). Textos y cifras entregados por Kodigo.
// Las cifras se muestran tal cual; si cambian, se editan aquí.

export const alliancesHero = {
  title: "KODIGO PARA EMPRESAS",
  question: "¿Tu equipo está listo para aplicar IA en su trabajo?",
  subtitle: "Entrenamos a tus equipos para aplicar IA en procesos y necesidades reales de tu empresa.",
  cta: "Agendar una asesoría",
};

export const impactStats = [
  { value: 360, label: "Empresas capacitadas" },
  { value: 2800, label: "Profesionales capacitados" },
  { value: 80, label: "Alianzas estratégicas" },
];

export const workshop = {
  label: "Workshop con IA para empresas",
  title: "Descubrí cómo aplicar IA en tu empresa",
  lead: "Una sesión práctica para identificar oportunidades reales de IA en tu operación y definir por dónde empezar.",
  steps: [
    { icon: "target", title: "Detectá oportunidades de IA en tu empresa" },
    { icon: "bulb", title: "Conocé casos de uso aplicables a tu equipo" },
    { icon: "path", title: "Definí cómo llevarlos a la práctica" },
  ] as const,
  // Etiqueta que acompaña al logo en la cabecera del pase de registro.
  ticketTag: "Workshop · IA para empresas",
  // Pase de registro: texto breve y botón que abre el modal con el formulario de HubSpot.
  pass: {
    text: "Reserva tu lugar: completa el formulario de registro y te confirmamos los detalles de la sesión.",
    submit: "Registrarme al Workshop",
  },
  modalTitle: "Regístrate al Workshop",
  modalIntro: "Déjanos tus datos para recibir más detalles del evento.",
};

export const upcomingWorkshops = {
  label: "Próximos workshops",
  title: "Descubre nuestros workshops",
  lead: "Sesiones prácticas para que tu equipo aplique IA en su trabajo.",
  // Solo se muestra lo confirmado: sin año ni hora hasta recibirlos.
  events: [
    { day: "26", month: "NOV", title: "AI para equipos comerciales", mode: "Sesión Presencial INCAF" },
    { soon: true, title: "Nuevo workshop", mode: "Fecha por anunciar" },
  ] as { day?: string; month?: string; soon?: boolean; title: string; mode: string }[],
  cta: "Registrarme",
  soon: "Próximamente",
};

export const successCases = {
  label: "CASOS DE ÉXITO",
  titleStart: "Empresas que llevan ",
  titleEmphasis: "la formación a resultado",
  lead: "Diseñamos programas a la medida para resolver necesidades reales de cada equipo y llevar nuevas habilidades al trabajo diario",
  // "partner" debe coincidir con el nombre en content/partners.csv (de ahí sale el logo).
  // Textos y cifras entregados por Kodigo, tal cual.
  cases: [
    {
      partner: "Coderland",
      badge: "CODERLAND - PANAMÁ",
      text: "Desarrollamos junto a Coderland un programa de becas corporativas como parte de su estrategia de responsabilidad corporativa, brindando a mujeres en Panamá una ruta de formación Full Stack Jr. para fortalecer su desarrollo dentro del sector tecnológico.",
      tags: ["Full Stack Jr.", "Becas corporativas", "Talento femenino", "Panamá"],
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
  label: "Nos adaptamos a tu operación",
  title: "La capacitación se adapta a tu empresa. No al revés.",
  lead: "Diseñamos horarios, modalidad y ritmo alrededor de la operación de tu equipo. La formación se integra al trabajo, no compite con él.",
  // Iconos oficiales de Kodigo (Contenido / Horarios / Modalidad / Ritmo).
  features: [
    { icon: "horarios", title: "Horarios a la medida", text: "Bloques que respetan la jornada y los picos operativos." },
    { icon: "ritmo", title: "Ritmo adaptable", text: "Sesiones intensivas o distribuidas según la disponibilidad del equipo." },
    { icon: "modalidad", title: "Modalidad flexible", text: "Presencial, virtual o híbrida según el equipo y el objetivo." },
    { icon: "contenido", title: "Contenido aplicado", text: "Casos y ejercicios aterrizados a la realidad" },
  ] as const,
  cta: "Agendar una asesoría",
  closing: {
    title: "Formación diseñada alrededor de tu operación",
    text: "Definimos contigo cuándo, cómo y con qué ritmo aprende el equipo para que la formación sea sostenible y aplicable.",
  },
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
