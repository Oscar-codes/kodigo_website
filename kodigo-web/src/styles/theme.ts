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
    /** Cabecera al hacer scroll: blanco translúcido al 0.55 + blur + saturate en Header.tsx. */
    headerGlass: "rgba(255, 255, 255, 0.55)",
  },
  fonts: {
    body: `"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
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
  section: { y: "clamp(4rem, 2rem + 6vw, 7.5rem)" }, // 120 px en escritorio
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
