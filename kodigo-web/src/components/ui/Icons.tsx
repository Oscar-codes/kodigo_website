// Iconos de interfaz simples (trazo 2, redondeados) dibujados para el proyecto: sin fuentes de iconos.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

/** Flecha ↗ de los botones de Eduhall. */
export const ArrowUpRight = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/** Flecha → de los enlaces "Ver más". */
export const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Chevron hacia abajo de los menús con submenú. */
export const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Teléfono del botón Contáctanos. */
export const Phone = ({ size = 18 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

/** Pin de ubicación: lugar o modalidad presencial. */
export const MapPin = ({ size = 18 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

/** LinkedIn (glifo "in" de trazo, como el resto de iconos). */
export const LinkedIn = ({ size = 18 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 0 1 5 0v3" />
  </svg>
);

/** Libro abierto: icono de las etiquetas de sección de Eduhall. */
export const BookOpen = ({ size = 22 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M2 5.5c3.2-1.4 6.8-1.2 10 1 3.2-2.2 6.8-2.4 10-1V19c-3.2-1.4-6.8-1.2-10 1-3.2-2.2-6.8-2.4-10-1z" />
    <path d="M12 6.5V20" />
  </svg>
);

/** Comillas de los testimonios. */
export const QuoteMark = ({ size = 32 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M4.5 18c-1-1.4-1.5-3-1.5-5 0-4 2.4-7 6-8l.8 1.6c-2 .8-3 2.2-3.2 4H9.5V18zM14.5 18c-1-1.4-1.5-3-1.5-5 0-4 2.4-7 6-8l.8 1.6c-2 .8-3 2.2-3.2 4H19.5V18z" />
  </svg>
);

/** Reloj: duración. */
export const Clock = ({ size = 20 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/** Laptop: modalidad. */
export const Laptop = ({ size = 20 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <rect x="4" y="5" width="16" height="11" rx="2" />
    <path d="M2 19h20" />
  </svg>
);

/** Barras de señal: nivel. */
export const Signal = ({ size = 20 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M5 20v-5M12 20V9M19 20V4" />
  </svg>
);

/** Destellos: ruta de Inteligencia Artificial. */
export const Sparkles = ({ size = 28 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M10 4l1.8 4.6L16.5 10l-4.7 1.4L10 16l-1.8-4.6L3.5 10l4.7-1.4z" />
    <path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" />
  </svg>
);

/** Gráfico de barras: ruta de Data Analyst. */
export const BarChart = ({ size = 28 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M4 20h16" />
    <rect x="5" y="11" width="3.5" height="9" rx="1" />
    <rect x="10.25" y="6" width="3.5" height="14" rx="1" />
    <rect x="15.5" y="13" width="3.5" height="7" rx="1" />
  </svg>
);

/** Cohete: iniciar una carrera tech. */
export const Rocket = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M12 3c3.5 1.8 5.5 5.2 5.5 9.2L12 17.5 6.5 12.2C6.5 8.2 8.5 4.8 12 3z" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M6.5 14.5 4 15l1 4 3.5-1.5M17.5 14.5l2.5.5-1 4-3.5-1.5M12 18.5V21" />
  </svg>
);

/** Tendencia al alza: mejorar habilidades. */
export const TrendUp = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

/** Grupo de personas: capacitar a un equipo. */
export const Users = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c1.9.7 3 2.5 3 5.6" />
  </svg>
);

/** Código </>: ruta de Programación. */
export const CodeBrackets = ({ size = 28 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
  </svg>
);

/** Brújula: elegir el programa. */
export const Compass = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);

/** Documento con visto: completar el proceso de admisión. */
export const FileCheck = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 14.5l2 2 4-4.5" />
  </svg>
);

/** Medalla: demostrar competencias con evidencia. */
export const Award = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.8 13.7-1.3 7 4.5-2.6 4.5 2.6-1.3-7" />
  </svg>
);

/** Visto: lista de beneficios. */
export const Check = ({ size = 18 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/** Llave: saber hacer. */
export const Wrench = ({ size = 28 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5l-9.2 9.2a2.1 2.1 0 0 1-3-3L16.5 8.5a4 4 0 0 0-2-2z" />
  </svg>
);

/** Pausa y reproducción del recorrido automático. */
export const Pause = ({ size = 14 }: { size?: number }) => (
  <svg {...base} width={size} height={size} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export const Play = ({ size = 14 }: { size?: number }) => (
  <svg {...base} width={size} height={size} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);

/** Estrella rellena: valoraciones y reviews. */
export const Star = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size} fill="currentColor" stroke="none">
    <path d="M12 2.5l2.95 6.36 6.96.78-5.18 4.73 1.4 6.85L12 17.77 5.87 21.22l1.4-6.85L2.1 9.64l6.95-.78L12 2.5z" />
  </svg>
);

/** Flecha izquierda: controles de carrusel. */
export const ArrowLeft = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M14 6l-6 6 6 6" />
  </svg>
);

/** Cámara de video: cursos completados. */
export const VideoCamera = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M3 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3z" />
    <path d="M16 10l5-3v10l-5-3z" />
  </svg>
);

/** Pulgar arriba: tasa de satisfacción. */
export const ThumbsUp = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <path d="M7 10v11" />
    <path d="M7 10l4-7c1.3 0 2.3 1 2.3 2.3V10H19a2 2 0 0 1 2 2.3l-1.3 6.5A2 2 0 0 1 17.7 21H7" />
  </svg>
);

/** Grupo grande de personas: comunidad de estudiantes. */
export const Community = ({ size = 32 }: { size?: number }) => (
  <svg {...base} width={size} height={size}>
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
    <circle cx="12" cy="6.5" r="2.8" />
    <path d="M2.5 19c0-2.8 2-5 4.5-5s4.5 2.2 4.5 5" />
    <path d="M12.5 19c0-2.8 2-5 4.5-5s4.5 2.2 4.5 5" />
    <path d="M7.5 14c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" />
  </svg>
);
