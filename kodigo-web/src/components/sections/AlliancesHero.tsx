import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import hero1 from "@/assets/b2b/hero-1.webp";
import hero1Mobile from "@/assets/b2b/hero-1-m.webp";
import hero2 from "@/assets/b2b/hero-2.webp";
import hero2Mobile from "@/assets/b2b/hero-2-m.webp";
import { alliancesHero } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { bracketLabel, keywordText } from "../ui/B2bKit";
import { Container } from "../ui/Container";
import { Pause, Play } from "../ui/Icons";
import { Plexus, type BandOptions } from "../ui/Plexus";

/** Cuánto se superponen las cifras de impacto (ImpactStats) sobre el banner; debe coincidir con ImpactStats.tsx. */
export const HERO_OVERLAP = "4.5rem";

const INTERVAL_MS = 6000;
const TRANSITION_MS = 900;
const CHAR_STAGGER_MS = 14;
const MAX_CHAR_DELAY_MS = 900;
const TEXT_START_DELAY_MS = 350;

// Banner de la landing B2B: dos diapositivas con fotos ya tratadas en morado (versión de escritorio y de móvil, con el
// texto a la izquierda / abajo), etiqueta entre corchetes, titular con palabra clave en degradado lavanda → teal, botón
// primario, controles (anterior / pausa / siguiente) y contador "1 / 2". Efectos propios del Home de Kodigo: la
// diapositiva sale hacia la izquierda y entra la siguiente, las letras del título "se ensamblan" y una red plexus
// animada flota sobre la foto. El texto es el de Alianzas en ambas diapositivas (hasta tener copy distinto).
interface SlideData {
  image: string;
  imageMobile: string;
}

const SLIDES: SlideData[] = [
  { image: hero1, imageMobile: hero1Mobile },
  { image: hero2, imageMobile: hero2Mobile },
];

// Red plexus sobre la mitad derecha de la foto (en móvil queda sobre la parte alta, donde está la imagen).
const PLEXUS_BAND: BandOptions = { seed: 7, count: 130, u0: 0.42, u1: 1.06, fade0: 0.5, y: 0.34, amp: 0.1, thick: 0.17, dist: 0.12 };

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
  background-color: ${({ theme }) => theme.b2b.bg1};
`;

// Todas las diapositivas ocupan la misma celda: el alto lo fija la más alta (las "sizer" invisibles).
const Stage = styled.div`
  display: grid;
  overflow: hidden;
`;

interface SlideProps {
  $image: string;
  $imageMobile: string;
  $mode: "current" | "entering" | "leaving" | "sizer";
}

const Slide = styled.div<SlideProps>`
  grid-area: 1 / 1;
  min-width: 0;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.b2b.bg1};
  min-height: clamp(36rem, calc(100svh - ${({ theme }) => theme.layout.headerHeight}), 56rem);
  padding-block: 4rem calc(${HERO_OVERLAP} + 5.5rem);

  ${media.down("md")} {
    /* En móvil la foto ocupa la parte alta y el texto va abajo. */
    align-items: flex-end;
    min-height: 42rem;
    padding-top: 16rem;
  }

  ${({ $mode, $image, $imageMobile, theme }) =>
    $mode !== "sizer" &&
    css`
      /* La foto ya viene tratada (morado + plexus); solo se funde el borde inferior con la sección siguiente. */
      background-image:
        linear-gradient(0deg, ${theme.b2b.bg1} 0%, rgba(26, 15, 69, 0) 28%),
        url(${$image});
      background-size: cover;
      background-position: center;

      ${media.down("md")} {
        background-image:
          linear-gradient(0deg, ${theme.b2b.bg1} 0%, rgba(26, 15, 69, 0) 45%),
          url(${$imageMobile});
        background-position: top center;
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

// El contenido va por encima de la red plexus.
const Body = styled(Container)`
  position: relative;
  z-index: 2;
`;

const Content = styled.div`
  max-width: 940px;
`;

const Eyebrow = styled.h1`
  ${bracketLabel}
  margin-bottom: ${({ theme }) => theme.space(5)};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Question = styled.p`
  margin-bottom: ${({ theme }) => theme.space(6)};
  font-size: clamp(2.5rem, 1rem + 3.6vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.04;
  color: ${({ theme }) => theme.b2b.text};

  em {
    font-style: normal;
    ${keywordText}
  }
`;

const Subtitle = styled.p<{ $animate: boolean }>`
  max-width: 52ch;
  margin-bottom: ${({ theme }) => theme.space(10)};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.b2b.text2};

  @media (prefers-reduced-motion: no-preference) {
    ${({ $animate }) =>
      $animate &&
      css`
        animation: ${fadeUp} 700ms ${({ theme }) => theme.motion.easing} ${TEXT_START_DELAY_MS + 400}ms backwards;
      `}
  }
`;

const Actions = styled.div<{ $animate: boolean }>`
  @media (prefers-reduced-motion: no-preference) {
    ${({ $animate }) =>
      $animate &&
      css`
        animation: ${fadeUp} 700ms ${({ theme }) => theme.motion.easing} ${TEXT_START_DELAY_MS + MAX_CHAR_DELAY_MS}ms backwards;
      `}
  }
`;

// Palabra indivisible formada por caracteres que se ensamblan.
const Word = styled.span`
  display: inline-block;
  white-space: nowrap;
`;

const Char = styled.span`
  display: inline-block;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${assemble} 900ms ${({ theme }) => theme.motion.easing} var(--d) backwards;
  }
`;

// Red plexus: capa decorativa sobre la foto, detrás del texto.
const PlexusLayer = styled.div`
  position: absolute;
  inset: 0 0 ${HERO_OVERLAP};
  z-index: 1;
  pointer-events: none;

  ${media.down("md")} {
    bottom: 45%;
  }
`;

// Fila de controles bajo el botón: anterior, pausa (WCAG 2.2.2) y siguiente, y a la derecha el contador "1 / 2".
const Controls = styled(Container)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${HERO_OVERLAP} + 1.25rem);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  button {
    pointer-events: auto;
  }

  .buttons {
    display: flex;
    gap: ${({ theme }) => theme.space(3)};
  }
`;

const RoundButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(196, 181, 245, 0.55);
  background: rgba(26, 15, 69, 0.35);
  color: ${({ theme }) => theme.b2b.text};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    border-color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: rgba(110, 60, 200, 0.3);
    border-color: ${({ theme }) => theme.b2b.lavender};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.b2b.teal};
    outline-offset: 3px;
  }
`;

const Counter = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.b2b.text};

  span {
    opacity: 0.55;
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

// Resalta (sin cambiar el texto) desde " para " hasta el final de la pregunta.
const splitQuestion = (text: string): [string, string] => {
  const i = text.indexOf(" para ");
  return i < 0 ? [text, ""] : [text.slice(0, i + 1), text.slice(i + 1)];
};

// Atributo `inert` (no tipado en React 18): bloquea foco y clics en copias salientes.
const inertProps = { inert: "" } as Record<string, string>;

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={dir === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
  </svg>
);

const SlideView = ({ slide, mode }: { slide: SlideData; mode: SlideProps["$mode"] }) => {
  // Solo la diapositiva activa anima y expone el <h1>; las demás son decorativas para lectores de pantalla.
  const animated = mode === "current" || mode === "entering";
  const counter = { i: 0 };
  const [start, emphasis] = splitQuestion(alliancesHero.question);
  const hidden = animated ? {} : { "aria-hidden": true, ...inertProps };
  const render = (text: string) => (animated ? assembleText(text, counter) : text);

  return (
    <Slide $image={slide.image} $imageMobile={slide.imageMobile} $mode={mode} {...hidden}>
      <Body>
        <Content>
          <Eyebrow as={animated ? "h1" : "p"}>{alliancesHero.title}</Eyebrow>
          <Question aria-label={animated ? alliancesHero.question : undefined}>
            <Fragment>{render(start)}</Fragment>
            {emphasis ? <em>{render(emphasis)}</em> : null}
          </Question>
          <Subtitle $animate={animated}>{alliancesHero.subtitle}</Subtitle>
          <Actions $animate={animated}>
            <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} variant="gradient" arrow="right">
              {alliancesHero.cta}
            </ButtonLink>
          </Actions>
        </Content>
      </Body>
    </Slide>
  );
};

// === COMPONENTE ===
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const AlliancesHero = () => {
  // `tick` cuenta los cambios; la diapositiva visible es tick % SLIDES.length. `leaving` es el tick que está saliendo.
  const [state, setState] = useState<{ tick: number; leaving: number | null }>({ tick: 0, leaving: null });
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const { tick, leaving } = state;
  const total = SLIDES.length;

  const goTo = (steps: number) => setState((s) => (s.leaving !== null ? s : { tick: s.tick + steps, leaving: s.tick }));

  // Avance automático cada 6 s; en pausa si el cursor o el foco están dentro.
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
      aria-roledescription="carrusel"
      aria-label="Destacados de Alianzas"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Stage>
        {SLIDES.map((slide, i) => (
          <SlideView key={`sizer-${i}`} slide={slide} mode="sizer" />
        ))}
        {leaving !== null && <SlideView key={`s-${leaving}`} slide={SLIDES[leaving % total]} mode="leaving" />}
        <SlideView key={`s-${tick}`} slide={SLIDES[current]} mode={tick === 0 ? "current" : "entering"} />
      </Stage>
      <PlexusLayer>
        <Plexus kind="band" options={PLEXUS_BAND} />
      </PlexusLayer>
      <Controls>
        <div className="buttons">
          <RoundButton type="button" aria-label="Diapositiva anterior" onClick={() => goTo(total - 1)}>
            <ChevronIcon dir="left" />
          </RoundButton>
          <RoundButton type="button" aria-label={playing ? "Pausar carrusel" : "Reanudar carrusel"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </RoundButton>
          <RoundButton type="button" aria-label="Diapositiva siguiente" onClick={() => goTo(1)}>
            <ChevronIcon dir="right" />
          </RoundButton>
        </div>
        <Counter aria-live="off">
          {current + 1} <span>/ {total}</span>
        </Counter>
      </Controls>
    </Wrap>
  );
};
