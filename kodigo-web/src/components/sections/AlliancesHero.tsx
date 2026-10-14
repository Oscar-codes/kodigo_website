import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import hero1 from "@/assets/aivent/hero-1.webp";
import hero1Small from "@/assets/aivent/hero-1-768.webp";
import hero2 from "@/assets/aivent/hero-2.webp";
import hero2Small from "@/assets/aivent/hero-2-768.webp";
import { alliancesHero } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { bracketLabel } from "../ui/AiventKit";
import { Container } from "../ui/Container";
import { Float } from "../ui/Float";
import { Pause, Play } from "../ui/Icons";

/** Cuánto se superponen las cifras de impacto (ImpactStats) sobre el banner; debe coincidir con ImpactStats.tsx. */
export const HERO_OVERLAP = "4.5rem";

const INTERVAL_MS = 6000;
const TRANSITION_MS = 900;
const CHAR_STAGGER_MS = 14;
const MAX_CHAR_DELAY_MS = 900;
const TEXT_START_DELAY_MS = 350;

// Banner de la plantilla AIvent (demo "slider-text"): dos diapositivas con sus fotos (images/slider/3 y 4), degradado
// índigo, etiqueta entre corchetes, flechas laterales y contador "1 / 2". Con los efectos propios del Home de Kodigo:
// la diapositiva sale hacia la izquierda y entra la siguiente, las letras del título "se ensamblan", y el anillo y la
// esfera flotan. El texto es el de Alianzas en ambas diapositivas (igual que el Home, hasta tener copy distinto).
interface SlideData {
  image: string;
  imageSmall: string;
}

const SLIDES: SlideData[] = [
  { image: hero1, imageSmall: hero1Small },
  { image: hero2, imageSmall: hero2Small },
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
  background-color: ${({ theme }) => theme.colors.aiventDark};
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
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.aiventDark};
  min-height: clamp(34rem, calc(100svh - ${({ theme }) => theme.layout.headerHeight}), 58rem);
  padding-block: 4rem calc(${HERO_OVERLAP} + 5rem);

  ${({ $mode, $image, $imageSmall }) =>
    $mode !== "sizer" &&
    css`
      /* Superposición de AIvent (sw-overlay) + degradado inferior que funde el banner con la sección siguiente. */
      background-image:
        linear-gradient(0deg, rgba(16, 20, 53, 1) 0%, rgba(16, 20, 53, 0) 30%),
        linear-gradient(90deg, rgba(16, 20, 53, 0.82) 0%, rgba(16, 20, 53, 0.55) 50%, rgba(16, 20, 53, 0.25) 100%),
        url(${$image});
      background-size: cover;
      background-position: center;

      ${media.down("md")} {
        background-image:
          linear-gradient(0deg, rgba(16, 20, 53, 1) 0%, rgba(16, 20, 53, 0) 30%),
          linear-gradient(rgba(16, 20, 53, 0.78), rgba(16, 20, 53, 0.78)),
          url(${$imageSmall});
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
  max-width: 820px;
`;

const Eyebrow = styled.h1`
  ${bracketLabel}
  margin-bottom: ${({ theme }) => theme.space(5)};
  font-size: 1rem;
  letter-spacing: 0.04em;
`;

const Question = styled.p`
  margin-bottom: ${({ theme }) => theme.space(6)};
  font-size: ${({ theme }) => theme.type.display};
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.white};

  em {
    font-style: normal;
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

const Subtitle = styled.p<{ $animate: boolean }>`
  max-width: 52ch;
  margin-bottom: ${({ theme }) => theme.space(10)};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.white};

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

const Ring = styled(Float)`
  z-index: 1;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
`;

const Orb = styled(Float)`
  z-index: 1;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lilac};
  opacity: 0.35;

  ${media.down("md")} {
    display: none;
  }
`;

// Flechas laterales de AIvent (swiper-button-prev/next): solo en pantallas anchas para no tapar el texto en móvil.
const Arrow = styled.button<{ $side: "prev" | "next" }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "prev" ? "left: 1.25rem;" : "right: 1.25rem;")}
  z-index: 2;
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-top: -24px;
  border: 0;
  border-radius: 50%;
  background: rgba(16, 20, 53, 0.35);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;

  ${media.up("lg")} {
    display: flex;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.aiventViolet};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }
`;

// Fila inferior: pausa (WCAG 2.2.2) a la izquierda y contador "1 / 2" de AIvent a la derecha.
const Controls = styled(Container)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(${HERO_OVERLAP} + 1.25rem);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;

const PauseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.white};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

const Counter = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.white};

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
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
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
    <Slide $image={slide.image} $imageSmall={slide.imageSmall} $mode={mode} {...hidden}>
      <Container>
        <Content>
          <Eyebrow as={animated ? "h1" : "p"}>{alliancesHero.title}</Eyebrow>
          <Question aria-label={animated ? alliancesHero.question : undefined}>
            <Fragment>{render(start)}</Fragment>
            {emphasis ? <em>{render(emphasis)}</em> : null}
          </Question>
          <Subtitle $animate={animated}>{alliancesHero.subtitle}</Subtitle>
          <Actions $animate={animated}>
            <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} variant="light" arrow="right">
              {alliancesHero.cta}
            </ButtonLink>
          </Actions>
        </Content>
      </Container>
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
      <Ring className="shape a" style={{ width: 220, height: 220, right: "7%", top: "12%" }} $range={14} />
      <Orb className="shape b" style={{ width: 84, height: 84, right: "24%", bottom: "26%" }} $range={18} $delay={-2} />
      <Arrow type="button" $side="prev" aria-label="Diapositiva anterior" onClick={() => goTo(total - 1)}>
        <ChevronIcon dir="left" />
      </Arrow>
      <Arrow type="button" $side="next" aria-label="Diapositiva siguiente" onClick={() => goTo(1)}>
        <ChevronIcon dir="right" />
      </Arrow>
      <Controls>
        <PauseButton type="button" aria-label={playing ? "Pausar carrusel" : "Reanudar carrusel"} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </PauseButton>
        <Counter aria-live="off">
          {current + 1} <span>/ {total}</span>
        </Counter>
      </Controls>
    </Wrap>
  );
};
