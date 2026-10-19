// Diseño basado en Eduhall (Home 3 "University"), medido de la plantilla: Inter, secciones de 120 px, tarjetas de 16 px de
// radio, botones en píldora y footer azul marino. El azul principal de Eduhall se sustituye por el violeta de Kodigo.
// Contraste verificado (AA): cuerpo 6.3:1 sobre blanco, violeta 5.9:1 sobre blanco, texto naranja/verde solo con variantes oscuras.
export const theme = {
  colors: {
    white: "#FFFFFF",
    bg: "#FFFFFF",
    /** Fondo de secciones alternas (equivale al `bg-main-25` de Eduhall). */
    surface: "#F2F2FE",
    heading: "#222E48",
    text: "#576070",
    textMuted: "#6A7283",
    border: "#EBECEF",
    borderStrong: "#DFE0E4",

    // Violeta de Kodigo (color principal)
    main: "#4B4AF1",
    mainHover: "#2E2DEF",
    main50: "#EDEDFE",
    main100: "#DBDBFC",
    main200: "#C9C9FB",

    // Acentos de Eduhall. El naranja y el verde NO alcanzan contraste como texto: usar los *Text.
    orange: "#F37739",
    orangeSoft: "#FEF1EB",
    orangeText: "#A43D0A",
    green: "#2FA75F",
    greenSoft: "#E8F8EF",
    greenText: "#1F6F3F",
    yellow: "#FFCA0E",
    yellowSoft: "#FFF6D1",
    yellowText: "#6B5000",
    /** Color de énfasis (label, marcador, texto destacado) sobre fondos navy /
        oscuros. Ticket 2.2: r/108, g/232, b/215 con buen contraste sobre
        navy #071431 (>= 9:1 WCAG AA + AAA) y coherente con la paleta Kodigo. */
    accentOnDark: "#6CE8D7",
    /** Color de énfasis (eyebrow, label, strong, link) sobre fondo claro /
        blanco. Ticket 2.3: rgb(107, 80, 218). ~4.7:1 de contraste sobre
        blanco #FFFFFF (AA Normal) y ~6.8:1 sobre surface #F2F2FE (AA +). */
    accentOnLight: "#6B50DA",

// Morado de marca (texto del menú sobre blanco; #5B2EA6 = 7.6:1) y violeta profundo/lila para degradados corporativos
    purple: "#5B2EA6",
    purpleDark: "#3B1F78",
    /** Tonos auxiliares del CTA "Aplicar" del header (linear-gradient 100deg purpleLight -> purpleDeep). */
    purpleLight: "#A678FF",
    purpleDeep: "#7557FA",
    /** Degradado oficial del CTA "Aplicar" (boton blanco sobre morado). Usado en Header > Item[data-cta]. */
    gradientCta: "linear-gradient(100deg, #A678FF, #7557FA)",
    violetDeep: "#1E1B6E",
    lilac: "#AF94F8",

    /** Menú principal de la barra horizontal: color base, y color al pasar el cursor / en la sección activa.
        #576070 = 6.3:1 y #7748e4 = 5.5:1 sobre blanco (AA). */
    menuText: "#576070",
    menuActive: "#7748e4",
    /** Texto de las tarjetas de cifras (KPI) de Beneficios, sobre blanco translúcido (11:1 sobre blanco). */
    kpiText: "#1F3864",

    // Azul marino (banner y footer)
    navy: "#071431",
    navyMid: "#13203B",
    onNavy: "#B3BAC8",
    borderOnNavy: "rgba(255, 255, 255, 0.12)",
    /** Fondo de los iconos oficiales (trazo lila/blanco, pensados para fondo oscuro). */
    brandDark: "#2E3142",
    /** Errores de formulario (contraste 6.5:1 sobre blanco). */
    danger: "#B42318",
    dangerSoft: "#FEF3F2",
bgTranslucent: "rgba(255, 255, 255, 0.97)",
    /** Cabecera al hacer scroll: blanco translúcido al 0.82 (sube desde 0.55 para mantener contraste AA sobre secciones oscuras) + blur + saturate en Header.tsx. */
    headerGlass: "rgba(255, 255, 255, 0.82)",
  },
  fonts: {
    body: `"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    /** Matimo, la tipografía de marca de la landing B2B (página Alianzas, su header y su footer). */
    b2b: `Matimo, "Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
  },
  /** Paleta de la landing B2B (guía "kodigo-b2b-estilos.css"): fondo morado profundo, lavanda y teal como acentos. */
  b2b: {
    bg1: "#1a0f45",
    bg2: "#241460",
    bg3: "#1d1150",
    bgGradient: "linear-gradient(180deg, #1a0f45 0%, #241460 40%, #1d1150 100%)",
    purple: "#6E3CC8",
    purpleLight: "#A07BF0",
    lavender: "#C4B5F5",
    teal: "#7FE0CC",
    mint: "#A8F0E0",
    text: "#F4F2F8",
    text2: "#DCD8E6",
    text3: "#A79FBF",
    cardBg: "rgba(38, 20, 84, 0.6)",
    cardBorder: "rgba(196, 181, 245, 0.22)",
    cardBorderActive: "rgba(160, 123, 240, 0.6)",
    tileBg: "rgba(110, 60, 200, 0.35)",
    tileBorder: "rgba(160, 123, 240, 0.5)",
    /** Degradado de palabra clave en titulares y del botón primario. */
    gradientKey: "linear-gradient(90deg, #C4B5F5 0%, #7FE0CC 100%)",
    /** Texto sobre el botón primario. */
    onGradient: "#1a0f45",
    line: "rgba(196, 181, 245, 0.16)",
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  space: (n: number) => `${n * 0.25}rem`,
  radii: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "800px" },
  shadows: {
    card: "0 6px 30px rgba(0, 0, 0, 0.04)", // .box-shadow-md de Eduhall
    lift: "0 14px 36px rgba(7, 20, 49, 0.1)",
    float: "0 10px 40px rgba(7, 20, 49, 0.12)",
  },
  breakpoints: { sm: "576px", md: "768px", lg: "992px", xl: "1200px" },
  layout: {
    maxWidth: "1320px",
    /** Altura del Header sticky en reposo (en píxeles, sin unidad). */
    headerHeight: "84px",
    /** Altura del Header sticky una vez desplazada la página (compactado). */
    headerHeightScrolled: "64px",
    /** Altura del cuadro del logo en Header (fija; el escalado visual al
        scrollear se aplica con transform, no con height). */
    logoHeight: "36px",
    /** Ratio de escalado del logo cuando el header esta en modo 'scrolled'.
        28/36 ≈ 0.7778, se aplica via transform: scale() para no forzar reflow. */
    logoHeightScrolledRatio: 28 / 36,
  },
  type: {
    display: "clamp(2.5rem, 1rem + 5.2vw, 5rem)", // h1 del banner: 80/96 px en escritorio
    h2: "clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem)", // 40/48 px
    h3: "1.25rem",
  },
  section: {
    y: "clamp(4rem, 2rem + 6vw, 7.5rem)", // 120 px en escritorio
    /** Ritmo más compacto (80 px en escritorio) para la página de Alianzas, con muchas secciones consecutivas. */
    dense: "clamp(3rem, 1.5rem + 4vw, 5rem)",
  },
  motion: {
    duration: { fast: "150ms", hover: "200ms", base: "300ms", reveal: "600ms", float: "7s" }, // hover = .transition-2 de Eduhall
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    distance: "24px",
    /** Retraso entre elementos hermanos al escalonar entradas (ms). */
    stagger: 80,
  },
} as const;

export type AppTheme = typeof theme;

export const media = {
  up: (bp: keyof AppTheme["breakpoints"]) => `@media (min-width: ${theme.breakpoints[bp]})`,
  down: (bp: keyof AppTheme["breakpoints"]) => `@media (max-width: calc(${theme.breakpoints[bp]} - 0.02px))`,
};
