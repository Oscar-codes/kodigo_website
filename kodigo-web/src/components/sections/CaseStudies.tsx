import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import skyline from "@/assets/aivent/bg-skyline.webp";
import { successCases } from "@/data/alliances";
import { partners } from "@/data/partners";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp } from "@/styles/effects";
import { media } from "@/styles/theme";
import { bracketLabel, silverText } from "../ui/AiventKit";
import { Container, Section } from "../ui/Container";
import { Check } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";

const AUTOPLAY_MS = 7000;
const logoOf = (name: string) => partners.find((p) => p.name === name);

// Casos de éxito con el formato "Event Schedule" de AIvent: una fila de pestañas (aquí, una por empresa, con su logo)
// y debajo el caso activo como una "sesión": logo en tarjeta blanca, historia y, al pie, los resultados como tarjetas de
// cifra. Fondo de skyline azul de la plantilla que se funde con las secciones vecinas. Cumple WCAG 2.2.2: botón de pausa,
// se detiene al pasar el cursor o enfocar y, con movimiento reducido, no avanza solo.
const Block = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
  position: relative;
  isolation: isolate;
  /* Los extremos usan el mismo índigo de las secciones vecinas (sin escalón); el resplandor violeta vive aquí,
     no en un contenedor interno, para que no se note ningún borde rectangular. */
  background:
    radial-gradient(55% 32% at 85% 40%, rgba(118, 77, 240, 0.22), transparent 70%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.aiventDark} 0%, rgba(16, 20, 53, 0.7) 22%, rgba(16, 20, 53, 0.78) 78%, ${({ theme }) => theme.colors.aiventDark} 100%),
    url(${skyline}) center / cover no-repeat,
    ${({ theme }) => theme.colors.aiventDark};
`;

const Panel = styled.div`
  position: relative;
`;

const Head = styled.div<{ $visible: boolean }>`
  max-width: 760px;
  margin: 0 auto ${({ theme }) => theme.space(12)};
  text-align: center;

  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(3)};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    font-weight: ${({ theme }) => theme.weights.medium};
    line-height: 1.25;
    ${silverText}
  }

  h2 strong {
    font-weight: ${({ theme }) => theme.weights.bold};
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  p.lead {
    margin-top: ${({ theme }) => theme.space(4)};
    color: ${({ theme }) => theme.colors.onNavy};
  }

  @media (prefers-reduced-motion: no-preference) {
    .label,
    h2,
    p.lead {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    }

    ${({ $visible }) =>
      $visible &&
      css`
        .label {
          animation: ${bounceInDown} 0.9s ease both;
        }
        h2 {
          animation: ${bounceIn} 0.9s ease 0.1s both;
        }
        p.lead {
          animation: ${bounceInUp} 0.9s ease 0.2s both;
        }
      `}
  }
`;

// Pestañas tipo "Day 1 / Day 2" de AIvent: logo en tarjeta blanca y nombre debajo; la activa se eleva y lleva barra violeta.
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space(3)};
  max-width: 1040px;
  margin-inline: auto;
  padding-bottom: ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  ${media.down("md")} {
    display: flex;
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.space(5)};
    scroll-snap-type: x proximity;
  }

  .tab {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(2)} ${theme.space(4)}`};
    color: ${({ theme }) => theme.colors.onNavy};
    cursor: pointer;
    scroll-snap-align: center;
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;

    ${media.down("md")} {
      flex: none;
      min-width: 120px;
    }
  }

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: min(100%, 132px);
    height: 68px;
    padding: ${({ theme }) => theme.space(2.5)};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.white};
    opacity: 0.55;
    transition:
      transform ${({ theme }) => theme.motion.duration.hover} linear,
      opacity ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .tile img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .name {
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  .tab:hover .tile,
  .tab[aria-selected="true"] .tile {
    opacity: 1;
    transform: translateY(-3px);
  }

  .tab[aria-selected="true"] {
    color: ${({ theme }) => theme.colors.white};
  }

  .tab::after {
    content: "";
    position: absolute;
    left: 12%;
    right: 12%;
    bottom: -1px;
    height: 3px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.aiventViolet};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.motion.duration.base} ease;
  }

  .tab[aria-selected="true"]::after {
    transform: scaleX(1);
  }

  .tab:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

// Todos los casos ocupan la misma celda de la rejilla: la altura es la del más largo y el carrusel no "salta".
const Stage = styled.div`
  display: grid;
  max-width: 1040px;
  margin: ${({ theme }) => theme.space(10)} auto 0;
`;

const Slide = styled.div<{ $active: boolean }>`
  grid-area: 1 / 1;
  display: grid;
  gap: ${({ theme }) => theme.space(8)};
  align-content: start;
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};

  ${media.up("md")} {
    grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
    gap: ${({ theme }) => `${theme.space(8)} ${theme.space(12)}`};
    align-items: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: ${({ $active }) => ($active ? "none" : "translateX(32px)")};
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      visibility 0s linear ${({ $active }) => ($active ? "0s" : "0.5s")};
  }
`;

const LogoTile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  max-width: 260px;
  width: 100%;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space(8)};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06);

  img {
    max-width: 100%;
    height: auto;
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const Story = styled.div`
  .badge {
    display: inline-block;
    margin-bottom: ${({ theme }) => theme.space(5)};
    padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(5)}`};
    border: 1px solid ${({ theme }) => theme.colors.aiventViolet};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: rgba(118, 77, 240, 0.18);
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.white};
  }

  p.text {
    font-size: 1.125rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.white};
  }
`;

// Resultados: las cifras que abren la frase ("+40 profesionales") van como tarjeta con el número grande; el resto, como
// viñeta con visto (ul-check de AIvent). El texto de cada resultado se mantiene completo.
const Results = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(4)};

  ${media.up("md")} {
    grid-column: 1 / -1;
    padding-top: ${({ theme }) => theme.space(8)};
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  li {
    transition:
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  li:hover {
    transform: translateY(-3px);
  }

  /* Todas las tarjetas de resultado comparten forma: rectángulo con radio md, mismo relleno, borde y alto mínimo. */
  .stat,
  .chip {
    flex: 1 1 200px;
    min-width: 0;
    min-height: 72px;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(5)}`};

    ${media.up("md")} {
      min-height: 112px;
      padding: ${({ theme }) => `${theme.space(5)} ${theme.space(6)}`};
    }
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventDark};
  }

  .stat:hover,
  .chip:hover {
    border-color: ${({ theme }) => theme.colors.aiventViolet};
  }

  .stat b {
    display: block;
    font-size: clamp(2.25rem, 1.6rem + 2vw, 3rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.1;
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .stat span {
    display: block;
    margin-top: ${({ theme }) => theme.space(1)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
  }

  .chip {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(3)};
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.35;
    color: ${({ theme }) => theme.colors.white};
  }

  .chip svg {
    flex: none;
    width: 28px;
    height: 28px;
    padding: 5px;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: rgba(118, 77, 240, 0.28);
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  .chip b {
    color: ${({ theme }) => theme.colors.accentOnDark};
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space(10)};

  .toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.white};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear, color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .toggle:hover {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.aiventDark};
  }

  .toggle:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }
`;

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// "+40 profesionales" -> cifra "+40" y descripción; "decisiones 22X más rápidas" no abre con cifra y se resalta en línea.
const splitLead = (text: string) => {
  const m = /^(\+?\d[\d.,]*[A-Za-z%]?)\s+(.+)$/.exec(text);
  return m ? { num: m[1], rest: m[2] } : null;
};

const highlightInline = (text: string) =>
  text.split(/(\d+[A-Za-z]?X)/).map((part, i) => (/^\d+[A-Za-z]?X$/.test(part) ? <b key={i}>{part}</b> : part));

export const CaseStudies = () => {
  const [headRef, visible] = useInView<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cases = successCases.cases.map((c) => ({ ...c, logo: logoOf(c.partner) }));

  // El carrusel solo avanza mientras está en pantalla.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Avance automático: se detiene con pausa del usuario, cursor/foco encima o movimiento reducido. Reinicia al cambiar de caso.
  useEffect(() => {
    if (!onScreen || userPaused || hovering || reducedMotion() || cases.length < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % cases.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, onScreen, userPaused, hovering, cases.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = cases.length - 1;
    const next = e.key === "ArrowRight" ? (index === last ? 0 : index + 1) : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <Block aria-labelledby="cases-title">
      <Container>
        <Panel>
          <Head ref={headRef} $visible={visible}>
            <span className="label">{successCases.label}</span>
            <h2 id="cases-title">
              {successCases.titleStart}
              <strong>{successCases.titleEmphasis}</strong>
            </h2>
            <p className="lead">{successCases.lead}</p>
          </Head>
          <Reveal direction="up">
            <div ref={wrapRef} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
              <Tabs role="tablist" aria-label="Elegir caso" onKeyDown={onKeyDown}>
                {cases.map((c, i) => (
                  <button
                    key={c.partner}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    id={`case-tab-${i}`}
                    type="button"
                    role="tab"
                    className="tab"
                    aria-selected={i === index}
                    aria-controls={`case-${i}`}
                    aria-label={c.partner}
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => setIndex(i)}
                  >
                    <span className="tile">{c.logo?.logo && <img src={c.logo.logo} alt="" width={c.logo.width} height={c.logo.height} loading="lazy" />}</span>
                    <span className="name" aria-hidden="true">
                      {c.partner}
                    </span>
                  </button>
                ))}
              </Tabs>
              <Stage aria-roledescription="carrusel" aria-label="Casos de éxito">
                {cases.map((c, i) => (
                  <Slide key={c.partner} id={`case-${i}`} role="tabpanel" aria-labelledby={`case-tab-${i}`} $active={i === index}>
                    <LogoTile>{c.logo?.logo && <img src={c.logo.logo} alt={c.partner} width={c.logo.width} height={c.logo.height} loading="lazy" />}</LogoTile>
                    <Story>
                      <span className="badge">{c.badge}</span>
                      <p className="text">{c.text}</p>
                    </Story>
                    <Results aria-label="Resultados del programa">
                      {c.tags.map((t) => {
                        const lead = splitLead(t);
                        return lead ? (
                          <li key={t} className="stat">
                            <b>{lead.num}</b> <span>{lead.rest}</span>
                          </li>
                        ) : (
                          <li key={t} className="chip">
                            <Check size={18} aria-hidden="true" />
                            <span>{highlightInline(t)}</span>
                          </li>
                        );
                      })}
                    </Results>
                  </Slide>
                ))}
              </Stage>
              <Controls>
                <button
                  type="button"
                  className="toggle"
                  aria-label={userPaused ? "Reanudar el carrusel" : "Pausar el carrusel"}
                  aria-pressed={userPaused}
                  onClick={() => setUserPaused((p) => !p)}
                >
                  {userPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
              </Controls>
            </div>
          </Reveal>
        </Panel>
      </Container>
    </Block>
  );
};
