import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import heroImage from "@/assets/photos/hero-bg.webp";
import heroImageSmall from "@/assets/photos/hero-bg-768.webp";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Float } from "../ui/Float";
import { Container } from "../ui/Container";
import { BookOpen, Check } from "../ui/Icons";

// Carrusel del banner de Eduhall (Home 3): foto a pantalla completa con degradado azul marino de izquierda a derecha.
// Cada 6 s la diapositiva actual sale hacia la izquierda y entra la siguiente. Al cargar la página y en cada cambio,
// las letras "se ensamblan": cada carácter llega desde una posición dispersa hasta su lugar.
// Por ahora las dos diapositivas usan la misma foto; al tener otra, basta cambiar `image` en SLIDES.
// FOTO PENDIENTE de confirmar permisos/licencia (ver docs/SOLICITUD_DE_INSUMOS.md).

/** Cuánto se superpone el panel de rutas (Benefits) sobre el banner; debe coincidir con Benefits.tsx. */
const PANEL_OVERLAP = "1.5rem";
/** Cuánto sube la marquesina de logos (BrandMarquee) sobre el borde inferior del banner; debe coincidir con BrandMarquee.tsx. */
const MARQUEE_RISE = "15px";
/** Alto de la marquesina de logos (BrandMarquee). El banner se acorta para que la franja completa quepa en la primera pantalla. */
const MARQUEE_HEIGHT = "110px";
const INTERVAL_MS = 6000;
const TRANSITION_MS = 900;
const CHAR_STAGGER_MS = 14;
const MAX_CHAR_DELAY_MS = 1100;
const TEXT_START_DELAY_MS = 350; // las letras empiezan a llegar cuando la diapositiva ya casi está en su lugar

type TitlePart = string | { em: string };

interface SlideData {
  label: string;
  title: TitlePart[];
  lead: string;
  primary: { text: string; to: string };
  secondary: { text: string; to: string };
  /** Bullets que se muestran debajo de los botones (mockup del hero). */
  benefits: string[];
  image: string;
  imageSmall: string;
}

// Mismo mensaje en ambas diapositivas hasta tener contenido y foto distintos para la segunda.
const SLIDES: SlideData[] = [
  {
    label: "Futuro digital · Kodigo 2026",
    title: ["El futuro no\nse espera.\n", { em: "Se construye." }],
    lead: "Somos la academia referente en El Salvador para aprender inteligencia artificial y desarrollar habilidades en tecnología, datos y desarrollo de software. Aprende a aplicar la AI para impulsar tu carrera o transformar tu organización.",
    primary: { text: "Explorar bootcamps", to: "/bootcamps" },
    secondary: { text: "Formar a mi equipo", to: "/profesional/alianzas" },
    benefits: ["Programas orientados a la práctica", "Opciones según tu perfil"],
    image: heroImage,
    imageSmall: heroImageSmall,
  },
  {
    label: "Futuro digital · Kodigo 2026",
    title: ["El futuro no\nse espera.\n", { em: "Se construye." }],
    lead: "Somos la academia referente en El Salvador para aprender inteligencia artificial y desarrollar habilidades en tecnología, datos y desarrollo de software. Aprende a aplicar la AI para impulsar tu carrera o transformar tu organización.",
    primary: { text: "Explorar bootcamps", to: "/bootcamps" },
    secondary: { text: "Formar a mi equipo", to: "/profesional/alianzas" },
    benefits: ["Programas orientados a la práctica", "Opciones según tu perfil"],
    image: heroImage,
    imageSmall: heroImageSmall,
  },
];

// === ANIMACIONES ===
const assemble = keyframes`
  from {
    opacity: 0;
    transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1.5);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

// === ESTILOS ===
const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  background-color: ${({ theme }) => theme.colors.navy};
  /* Anchor para el menu 'Inicio' del Header: ancla al borde superior de la
     section (no al titulo h1), asi el menu 'Inicio' lleva justo al inicio
     visual de la pagina en vez de la mitad inferior del Hero. */
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

// Todas las diapositivas ocupan la misma celda: el alto lo fija la más alta (las "sizer" invisibles).
const Stage = styled.div`
  display: grid;
  overflow: hidden;
`;

interface SlideProps {
  $image: string;
  $imageSmall: string;
  $mode: "current" | "entering" | "leaving" | "sizer";
}

const Slide = styled.div<SlideProps>`
  grid-area: 1 / 1;
  min-width: 0;
  background-color: ${({ theme }) => theme.colors.navy};
  /* El banner ocupa casi todo el alto visible (cabecera + banner + borde del panel) con el contenido centrado,
     como el Home 3 de Eduhall. */
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.space(8)};
  min-height: clamp(
    34rem,
    calc(100svh - ${({ theme }) => theme.layout.headerHeight} - ${MARQUEE_HEIGHT} + ${MARQUEE_RISE} - 0.3rem),
    62rem
  );
  /* Deja libre la fila de controles (44 px) bajo el contenido. */
  padding-block: 2.25rem calc(${PANEL_OVERLAP} + 4.25rem + ${MARQUEE_RISE});

  ${media.up("md")} {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0;
  }

  ${({ $mode, $image, $imageSmall }) =>
    $mode !== "sizer" &&
    css`
      background-image:
        linear-gradient(
          90deg,
          rgba(7, 20, 49, 0.45) 0%,
          rgba(7, 20, 49, 0.3) 45%,
          rgba(7, 20, 49, 0.1) 62%,
          rgba(7, 20, 49, 0) 100%
        ),
        url(${$image});
      background-size: cover;
      background-position: center;

      ${media.down("md")} {
        /* En móvil se usa la versión liviana de la foto (768 px) bajo una capa oscura uniforme. */
        background-image: linear-gradient(rgba(7, 20, 49, 0.5), rgba(7, 20, 49, 0.5)), url(${$imageSmall});
      }
    `}

  ${({ $mode }) => $mode === "sizer" && "visibility: hidden;"}
  ${({ $mode }) => $mode === "leaving" && "pointer-events: none;"}

  @media (prefers-reduced-motion: no-preference) {
    ${({ $mode }) =>
      $mode === "entering" &&
      css`
        animation: ${slideIn} ${TRANSITION_MS}ms ${({ theme }) => theme.motion.easing} both;
      `}
    ${({ $mode }) =>
      $mode === "leaving" &&
      css`
        animation: ${slideOut} ${TRANSITION_MS}ms ${({ theme }) => theme.motion.easing} both;
      `}
  }
`;

const Content = styled.div`
  max-width: 760px;
`;

const Label = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(4)};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.accentOnDark};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space(5)};
  font-size: ${({ theme }) => theme.type.display};

  /* En escritorio el título también se limita por el alto de la ventana, para que el banner entero y la marquesina
     de logos quepan en la primera pantalla en portátiles de poca altura. */
  ${media.up("md")} {
    font-size: min(${({ theme }) => theme.type.display}, 8svh);
  }
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.white};

  em {
    font-style: normal;
  }

  /* Gradiente lila -> cian sobre la parte enfatizada, replicando el mockup. En la versión animada cada letra es un
     inline-block con su propia capa (will-change), así que el degradado se aplica a cada letra: recortado desde el
     <em> las dejaba transparentes y "Se construye." no se veía. El degradado es vertical, por lo que se ve continuo. */
  em:not(:has(span)),
  em span span {
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

const Lead = styled.p`
  max-width: 56ch;
  margin-bottom: ${({ theme }) => theme.space(8)};
  color: ${({ theme }) => theme.colors.white};
`;

const Actions = styled.div<{ $delay: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} 700ms ${({ theme }) => theme.motion.easing} ${({ $delay }) => $delay}ms backwards;
  }
`;

const Checks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.space(2)} ${theme.space(6)}`};
  margin: ${({ theme }) => theme.space(6)} 0 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    color: ${({ theme }) => theme.colors.white};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.medium};
  }

  li svg {
    color: ${({ theme }) => theme.colors.green};
  }
`;

// Palabra indivisible (no se parte a mitad de palabra) formada por caracteres que se ensamblan.
const Word = styled.span`
  display: inline-block;
  white-space: nowrap;
`;

const Char = styled.span`
  display: inline-block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${assemble} 900ms ${({ theme }) => theme.motion.easing} var(--d) backwards;
    will-change: transform, opacity;
  }
`;

/** Formas decorativas flotantes de Eduhall sobre la foto: un anillo y un círculo translúcido, lejos del texto. */
/* Formas decorativas: viven en la franja libre a la derecha de la tarjeta de objetivos (la tarjeta se ancla a
   224-240 px del borde derecho), así que no quedan encima de ningún elemento. Con la tarjeta apilada (< md) se ocultan. */
const Ring = styled(Float)`
  z-index: 1;
  top: 10%;
  right: 12px;
  width: 190px;
  height: 190px;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;

  ${media.down("md")} {
    display: none;
  }
`;

const Orb = styled(Float)`
  z-index: 1;
  right: 84px;
  bottom: calc(${PANEL_OVERLAP} + 8rem + ${MARQUEE_RISE});
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lilac};
  opacity: 0.35;

  ${media.down("md")} {
    display: none;
  }
`;

const Controls = styled(Container)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${PANEL_OVERLAP} + 1.25rem + ${MARQUEE_RISE});
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  z-index: 2;
  /* La fila no intercepta clics: solo los controles (puntos y pausa). */
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;

const Dot = styled.button`
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.white};
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear,
    width ${({ theme }) => theme.motion.duration.base} linear;

  /* Área táctil de 44 px sin agrandar el punto visible. */
  &::after {
    content: "";
    position: absolute;
    inset: -16px -6px;
  }

  &[aria-current="true"] {
    width: 32px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.yellow};
    border-color: ${({ theme }) => theme.colors.yellow};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }
`;

const PauseButton = styled.button`
  margin-left: ${({ theme }) => theme.space(1)};
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.7rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

// === LÓGICA DE ENSAMBLAJE ===
// Pseudoaleatorio determinista: mismo resultado en cada render, sin Math.random.
const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const charStyle = (index: number): CSSProperties =>
  ({
    "--x": `${Math.round((seeded(index) - 0.5) * 260)}px`,
    "--y": `${Math.round((seeded(index + 99) - 0.5) * 180)}px`,
    "--r": `${Math.round((seeded(index + 7) - 0.5) * 120)}deg`,
    "--d": `${TEXT_START_DELAY_MS + Math.min(index * CHAR_STAGGER_MS, MAX_CHAR_DELAY_MS)}ms`,
  }) as CSSProperties;

/** Divide el texto en palabras y caracteres animables. `counter` numera los caracteres entre bloques. */
const assembleText = (text: string, counter: { i: number }): ReactNode =>
  text.split(/(\s+)/).map((token, t) => {
    if (/^\s+$/.test(token)) return " ";
    return (
      <Word key={t}>
        {Array.from(token).map((ch, c) => (
          <Char key={c} style={charStyle(counter.i++)}>
            {ch}
          </Char>
        ))}
      </Word>
    );
  });

// Atributo `inert` (no tipado en React 18): bloquea foco y clics en copias salientes.
const inertProps = { inert: "" } as Record<string, string>;

interface SlideViewProps {
  slide: SlideData;
  mode: SlideProps["$mode"];
}

const SlideView = ({ slide, mode }: SlideViewProps) => {
  // Solo la diapositiva activa anima y expone el <h1>; las demás son decorativas para lectores de pantalla.
  const animated = mode === "current" || mode === "entering";
  const counter = { i: 0 };
  const titleText = slide.title.map((p) => (typeof p === "string" ? p : p.em)).join("").replace(/\s+/g, " ").trim();
  // Los saltos de línea (\n) del texto se muestran como <br />, tanto animados como en las copias de reserva.
  const renderText = (text: string) =>
    text.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {animated ? assembleText(line, counter) : line}
      </Fragment>
    ));

  const title = slide.title.map((part, i) =>
    typeof part === "string" ? <span key={i}>{renderText(part)}</span> : <em key={i}>{renderText(part.em)}</em>,
  );
  const hidden = animated ? {} : { "aria-hidden": true, ...inertProps };

  return (
    <Slide $image={slide.image} $imageSmall={slide.imageSmall} $mode={mode} {...hidden}>
      <Container>
        <Content>
          <Label>
            <BookOpen size={24} />
            {renderText(slide.label)}
          </Label>
          <Title as={animated ? "h1" : "p"} aria-label={animated ? titleText : undefined}>
            {title}
          </Title>
          <Lead>{renderText(slide.lead)}</Lead>
          <Actions $delay={TEXT_START_DELAY_MS + MAX_CHAR_DELAY_MS}>
            <ButtonLink to={slide.primary.to} arrow>
              {slide.primary.text}
            </ButtonLink>
            <ButtonLink to={slide.secondary.to} variant="outlineLight" arrow>
              {slide.secondary.text}
            </ButtonLink>
          </Actions>
          <Checks aria-label="Beneficios del programa">
            {slide.benefits.map((b) => (
              <li key={b}>
                <Check size={18} aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </Checks>
        </Content>
      </Container>
    </Slide>
  );
};

// === COMPONENTE ===
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const Hero = () => {
  // `tick` cuenta los cambios; la diapositiva visible es tick % SLIDES.length. `leaving` es el tick que está saliendo.
  const [state, setState] = useState<{ tick: number; leaving: number | null }>({ tick: 0, leaving: null });
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const { tick, leaving } = state;
  const total = SLIDES.length;

  const goTo = (steps: number) =>
    setState((s) => (s.leaving !== null ? s : { tick: s.tick + steps, leaving: s.tick }));

  // Avance automático cada 6 s (se reinicia con cada cambio); en pausa si el cursor o el foco están dentro.
  useEffect(() => {
    if (!playing || hovered) return;
    const id = window.setTimeout(() => goTo(1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [tick, playing, hovered]);

  // Retira la diapositiva saliente cuando termina la transición.
  useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setState((s) => (s.tick === tick ? { ...s, leaving: null } : s)), TRANSITION_MS);
    return () => window.clearTimeout(id);
  }, [tick, leaving]);

  const current = tick % total;

  return (
    <Wrap
      id="hero-top"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Stage>
        {/* Copias invisibles de cada diapositiva: fijan el alto del banner para que no salte al cambiar. */}
        {SLIDES.map((slide, i) => (
          <SlideView key={`sizer-${i}`} slide={slide} mode="sizer" />
        ))}
        {leaving !== null && <SlideView key={`s-${leaving}`} slide={SLIDES[leaving % total]} mode="leaving" />}
        <SlideView key={`s-${tick}`} slide={SLIDES[current]} mode={tick === 0 ? "current" : "entering"} />
      </Stage>
      <Ring $range={14} />
      <Orb $range={18} $delay={-2} />
      <Controls>
        {SLIDES.map((_, i) => (
          <Dot
            key={i}
            type="button"
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-current={i === current}
            onClick={() => i !== current && goTo((i - current + total) % total)}
          />
        ))}
        <PauseButton
          type="button"
          aria-label={playing ? "Pausar carrusel" : "Reanudar carrusel"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "❚❚" : "▶"}
        </PauseButton>
      </Controls>
    </Wrap>
  );
};
