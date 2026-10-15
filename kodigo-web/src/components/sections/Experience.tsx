import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import classPhoto from "@/assets/photos/experience-class.webp";
import autoPhoto from "@/assets/photos/experience-automation.webp";
import heroPhoto from "@/assets/photos/hero.webp";
import { useInView } from "@/hooks/useInView";
import { wobble } from "@/styles/effects";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import {
  Award,
  Check,
  Compass,
  FileCheck,
  Laptop,
  Pause,
  Play,
  Rocket,
  Users,
} from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// "La experiencia Kodigo": recorrido en 6 pasos con panel marino (selector interactivo a la izquierda y detalle
// a la derecha). Avanza solo cada 5,5 s mientras está en pantalla, se pausa al pasar el cursor o enfocar y se puede
// elegir cualquier paso. La metodología ahora vive en su propia sección (`Methodology.tsx`).

const STEP_MS = 5500;

type Tone = "main" | "orange" | "green";
const steps: { icon: ReactNode; tone: Tone; word: string; title: string; text: string }[] = [
  { icon: <Compass size={30} />, tone: "main", word: "Descubre", title: "Elige tu ruta", text: "Identifica la formación que se ajusta a tus objetivos." },
  { icon: <FileCheck size={30} />, tone: "orange", word: "Aplica", title: "Completa el proceso", text: "Conoce requisitos, modalidades y pasos de admisión." },
  { icon: <Users size={30} />, tone: "green", word: "Aprende", title: "Aprende con expertos", text: "Sesiones y actividades guiadas según el bootcamp." },
  { icon: <Laptop size={30} />, tone: "main", word: "Construye", title: "Desarrolla proyectos", text: "Aplica herramientas en retos y ejercicios prácticos." },
  { icon: <Award size={30} />, tone: "orange", word: "Demuestra", title: "Construye evidencia", text: "Muestra competencias mediante entregables y portafolio." },
  { icon: <Rocket size={30} />, tone: "green", word: "Proyecta", title: "Prepara tu siguiente paso", text: "Prepárate para aplicar lo aprendido, destacar en nuevos retos o seguir escalando tu carrera." },
];

// Foto de cada paso (fotos de la carpeta de recursos de Kodigo; permisos pendientes). `pos` ajusta el encuadre.
const stepPhotos: { src: string; pos: string }[] = [
  { src: heroPhoto, pos: "70% 40%" },
  { src: classPhoto, pos: "30% 50%" },
  { src: heroPhoto, pos: "20% 55%" },
  { src: autoPhoto, pos: "50% 55%" },
  { src: classPhoto, pos: "85% 60%" },
  { src: autoPhoto, pos: "20% 40%" },
];

const highlights = ["Aprendizaje aplicado", "Proyectos y retos", "Orientación profesional"];

// Naranja y verde solo como fondos suaves; el icono usa las variantes oscuras (línea gráfica de Kodigo).
const tones = {
  main: { soft: "main50", ink: "main" },
  orange: { soft: "orangeSoft", ink: "orangeText" },
  green: { soft: "greenSoft", ink: "greenText" },
} as const;

// === ANIMACIONES ===
const panelIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
`;

const fillBar = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const zoomSlow = keyframes`
  from { transform: scale(1.12); }
  to { transform: scale(1); }
`;

// === ESTILOS: SECCIÓN ===
const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(60% 30% at 0% 12%, ${({ theme }) => theme.colors.main50}, transparent 70%),
    radial-gradient(55% 30% at 100% 70%, ${({ theme }) => theme.colors.orangeSoft}, transparent 70%),
    ${({ theme }) => theme.colors.white};
`;

const Shape = styled(Float)`
  z-index: -1;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.main100};
  opacity: 0.5;
`;

// === ESTILOS: RECORRIDO (panel marino) ===
const Stage = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  display: grid;
  gap: ${({ theme }) => theme.space(8)};
  padding: ${({ theme }) => theme.space(6)};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(50% 80% at 100% 0%, ${({ theme }) => theme.colors.lilac}66, transparent 70%),
    radial-gradient(45% 70% at 0% 100%, ${({ theme }) => theme.colors.main}99, transparent 70%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 100%);

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: ${({ theme }) => theme.space(12)};
    padding: ${({ theme }) => theme.space(12)};
  }
`;

const Ring = styled(Float)`
  z-index: -1;
  border: 2px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
`;

const Tabs = styled.div`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space(2)};

  /* Riel vertical que une los pasos; la parte llena avanza con el paso activo. */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 31px;
    top: 32px;
    bottom: 32px;
    width: 2px;
    transform-origin: top;
  }

  &::before {
    background: rgba(255, 255, 255, 0.16);
  }

  &::after {
    background: ${({ theme }) => theme.colors.lilac};
    transform: scaleY(var(--progress, 0));
    transition: transform 500ms ${({ theme }) => theme.motion.easing};
  }
`;

const Tab = styled.button`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
  width: 100%;
  min-height: 64px;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)} ${theme.space(2)} ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: left;
  color: ${({ theme }) => theme.colors.onNavy};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  .num {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.navy};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    transition:
      background-color ${({ theme }) => theme.motion.duration.base} linear,
      color ${({ theme }) => theme.motion.duration.base} linear,
      border-color ${({ theme }) => theme.motion.duration.base} linear;
  }

  .label small {
    display: block;
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.lilac};
  }

  .label span {
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  /* Barra de tiempo del paso activo (solo con avance automático). */
  .bar {
    position: absolute;
    left: ${({ theme }) => theme.space(16)};
    right: ${({ theme }) => theme.space(4)};
    bottom: 6px;
    height: 3px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.yellow};
    transform-origin: left;
    transform: scaleX(0);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: ${({ theme }) => theme.colors.white};
  }

  &[aria-selected="true"] {
    background: rgba(255, 255, 255, 0.12);
    color: ${({ theme }) => theme.colors.white};
  }

  &[aria-selected="true"] .num {
    border-color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 2px;
  }
`;

const barRunning = (paused: boolean) => css`
  @media (prefers-reduced-motion: no-preference) {
    .bar {
      animation: ${fillBar} ${STEP_MS}ms linear forwards;
      animation-play-state: ${paused ? "paused" : "running"};
    }
  }
`;

const TabsWithBar = styled(Tabs)<{ $auto: boolean; $paused: boolean }>`
  ${({ $auto, $paused }) => $auto && css`
    button[aria-selected="true"] {
      ${barRunning($paused)}
    }
  `}
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
`;

const Card = styled.div<{ $tone: Tone }>`
  position: relative;
  overflow: hidden;
  flex: 1;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};

  /* Foto del paso: encuadre ancho con degradado marino abajo; acerca despacio mientras el paso está activo. */
  .photo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 7;
    min-height: 150px;
    background: ${({ theme }) => theme.colors.navy};
  }

  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (prefers-reduced-motion: no-preference) {
    .photo img {
      animation: ${zoomSlow} ${STEP_MS + 1500}ms ease-out both;
    }
  }

  .photo::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, ${({ theme }) => theme.colors.navy}cc 100%);
  }

  .content {
    position: relative;
    padding: ${({ theme }) => `0 ${theme.space(6)} ${theme.space(8)}`};

    ${media.up("lg")} {
      padding: ${({ theme }) => `0 ${theme.space(10)} ${theme.space(10)}`};
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${panelIn} 360ms ${({ theme }) => theme.motion.easing} both;
  }

  /* Número grande de fondo: marca de agua del paso. */
  .ghost::before {
    content: attr(data-n);
    position: absolute;
    right: ${({ theme }) => theme.space(6)};
    bottom: -0.18em;
    z-index: 0;
    font-size: clamp(6rem, 4rem + 8vw, 10rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.colors.main50};
    pointer-events: none;
  }

  .circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-top: -36px;
    margin-bottom: ${({ theme }) => theme.space(5)};
    border: 4px solid ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    background: ${({ theme, $tone }) => theme.colors[tones[$tone].soft]};
    color: ${({ theme, $tone }) => theme.colors[tones[$tone].ink]};
  }

  .circle svg {
    animation: ${wobble} 1s ease-in-out 250ms both;
  }

  .kicker {
    position: relative;
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  h3 {
    position: relative;
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.15;
  }

  p.text {
    position: relative;
    max-width: 44ch;
    font-size: 1.125rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(4)};
  margin-top: ${({ theme }) => theme.space(5)};
  color: ${({ theme }) => theme.colors.onNavy};
  font-size: 0.875rem;

  button {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    min-height: 44px;
    padding: ${({ theme }) => `0 ${theme.space(4)}`};
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: ${({ theme }) => theme.radii.pill};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.weights.medium};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  button:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 2px;
  }
`;

const Highlights = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(8)};
  margin-top: ${({ theme }) => theme.space(10)};

  li {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.heading};
  }

  li span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.greenSoft};
    color: ${({ theme }) => theme.colors.greenText};
  }
`;

// === ESTILOS: METODOLOGÍA (tarjetas claras) ===
// (Movido a Methodology.tsx para una composición más flexible.)

/** "La experiencia Kodigo": recorrido interactivo en 6 pasos. La metodología vive en `Methodology.tsx`. */
export const Experience = () => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hovered, setHovered] = useState(false);
  const [stageRef, stageSeen] = useInView<HTMLDivElement>();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = steps.length;
  const auto = playing && stageSeen;
  const paused = hovered;

  // Avance automático: reinicia el temporizador en cada cambio de paso (también al elegirlo a mano).
  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % total), STEP_MS);
    return () => window.clearTimeout(id);
  }, [auto, paused, active, total]);

  const go = (i: number) => {
    const next = (i + total) % total;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  // Teclado de pestañas: flechas arriba/abajo, Inicio y Fin.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: total - 1 };
    if (e.key in keys) {
      e.preventDefault();
      go(keys[e.key]);
    }
  };

  const step = steps[active];

  return (
    <Wrap aria-labelledby="experience-title">
      <Shape style={{ width: 140, height: 140, left: "4%", top: "4%" }} $range={14} />
      <Shape style={{ width: 96, height: 96, right: "5%", bottom: "5%" }} $range={12} $delay={-3} />
      <Container>
        <SectionTitle
          id="experience-title"
          label="La experiencia Kodigo"
          title={
            <>
              No se trata solo de aprender.
              <br />
              Se trata de <em>ponerlo en práctica.</em>
            </>
          }
          lead="Aprender es el comienzo. Ponerlo en práctica marca la diferencia. Desde la elección de tu ruta hasta la construcción de proyectos, cada etapa está diseñada para que avances con propósito y desarrolles habilidades aplicables."
        />

        <Reveal direction="zoom">
          <Stage
            ref={stageRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setHovered(false)}
          >
            <Ring style={{ width: 240, height: 240, right: -70, top: -90 }} $range={14} />
            <Ring style={{ width: 150, height: 150, left: -50, bottom: -60 }} $range={12} $delay={-4} />
            <div>
              <TabsWithBar
                role="tablist"
                aria-label="Pasos de la experiencia Kodigo"
                aria-orientation="vertical"
                onKeyDown={onKeyDown}
                style={{ "--progress": active / (total - 1) } as React.CSSProperties}
                $auto={auto}
                $paused={paused}
              >
                {steps.map((s, i) => (
                  <Tab
                    key={s.word}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`exp-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls="exp-panel"
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => setActive(i)}
                  >
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="label">
                      <small>{s.word}</small>
                      <span>{s.title}</span>
                    </span>
                    <span className="bar" aria-hidden="true" />
                  </Tab>
                ))}
              </TabsWithBar>
              <Controls>
                <span aria-live="polite">
                  Paso {active + 1} de {total}
                </span>
                <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
                  {playing ? <Pause /> : <Play />}
                  {playing ? "Pausar recorrido" : "Reanudar"}
                </button>
              </Controls>
            </div>
            <Detail>
              <Card key={active} $tone={step.tone} id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${active}`}>
                <div className="photo" aria-hidden="true">
                  <img
                    src={stepPhotos[active].src}
                    alt=""
                    width={1200}
                    height={525}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: stepPhotos[active].pos }}
                  />
                </div>
                <div className="content">
                  <span className="ghost" aria-hidden="true" data-n={String(active + 1).padStart(2, "0")} />
                  <span className="circle" aria-hidden="true">
                    {step.icon}
                  </span>
                  <p className="kicker">
                    {String(active + 1).padStart(2, "0")} / {step.word}
                  </p>
                  <h3>{step.title}</h3>
                  <p className="text">{step.text}</p>
                </div>
              </Card>
            </Detail>
          </Stage>
        </Reveal>

        <Highlights aria-label="Lo que define la experiencia">
          {highlights.map((h) => (
            <li key={h}>
              <span aria-hidden="true">
                <Check />
              </span>
              {h}
            </li>
          ))}
        </Highlights>
      </Container>
    </Wrap>
  );
};
