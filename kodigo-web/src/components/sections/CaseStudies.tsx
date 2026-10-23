import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import casesBg from "@/assets/b2b/casos-bg.webp";
import { successCases } from "@/data/alliances";
import { partners } from "@/data/partners";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp } from "@/styles/effects";
import { media } from "@/styles/theme";
import { bracketLabel, glassCard, headlineText, iconTile, imageBackdrop, keywordText } from "../ui/B2bKit";
import { Container, Section } from "../ui/Container";
import { Check } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";

const AUTOPLAY_MS = 7000;
const logoOf = (name: string) => partners.find((p) => p.name === name);

// Casos de éxito: una fila de pestañas (una por empresa, con su logo) y debajo el caso activo: logo en tarjeta clara,
// historia y, al pie, los resultados como tarjetas con visto. Fondo ya tratado en morado que se funde con las secciones
// vecinas. Cumple WCAG 2.2.2: botón de pausa, se detiene al pasar el cursor o enfocar y, con movimiento reducido, no avanza solo.
const Block = styled(Section)`
  ${imageBackdrop(casesBg, 0.55)}
  padding-block: ${({ theme }) => theme.section.dense};
`;

const Panel = styled.div`
  position: relative;
`;

const Head = styled.div<{ $visible: boolean }>`
  max-width: 820px;
  margin: 0 auto ${({ theme }) => theme.space(12)};
  text-align: center;

  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(4)};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 {
    font-size: clamp(2rem, 1.3rem + 2.4vw, 3.25rem);
    line-height: 1.1;
    ${headlineText}
  }

  h2 strong {
    font-weight: inherit;
    ${keywordText}
  }

  p.lead {
    max-width: 62ch;
    margin: ${({ theme }) => theme.space(5)} auto 0;
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.b2b.text2};
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

// Pestañas: logo en tarjeta clara (la activa, sólida; las demás, translúcidas) y nombre debajo; la activa lleva barra lavanda.
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space(4)};
  padding-bottom: ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid ${({ theme }) => theme.b2b.line};

  ${media.down("md")} {
    display: flex;
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.space(5)};
    scroll-snap-type: x proximity;
  }

  /* El tablist solo agrupa las pestañas: sus botones y la tarjeta "Y muchos más" comparten la rejilla. */
  .list {
    display: contents;
  }

  /* Tarjeta final (enlace al muro de aliados): mismo recuadro que las pestañas, con texto en lugar de logo. */
  .more .tile {
    text-align: center;
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.25;
    color: ${({ theme }) => theme.b2b.text};
  }

  .more:hover .tile {
    transform: translateY(-3px);
    background: rgba(244, 242, 248, 0.42);
  }

  .tab {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space(2.5)};
    padding: ${({ theme }) => `${theme.space(1)} 0 ${theme.space(4)}`};
    color: ${({ theme }) => theme.b2b.text3};
    cursor: pointer;
    scroll-snap-align: center;
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;

    ${media.down("md")} {
      flex: none;
      min-width: 132px;
    }
  }

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 84px;
    padding: ${({ theme }) => theme.space(3)};
    border: 1px solid rgba(196, 181, 245, 0.35);
    border-radius: 16px;
    background: rgba(244, 242, 248, 0.26);
    transition:
      transform ${({ theme }) => theme.motion.duration.hover} linear,
      background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .tile img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    opacity: 0.8;
    transition: opacity ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .name {
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  .tab:hover .tile {
    transform: translateY(-3px);
    background: rgba(244, 242, 248, 0.42);
  }

  .tab[aria-selected="true"] {
    color: ${({ theme }) => theme.b2b.text};
  }

  .tab[aria-selected="true"] .tile {
    background: ${({ theme }) => theme.b2b.text};
    border-color: transparent;
  }

  .tab[aria-selected="true"] .tile img {
    opacity: 1;
  }

  .tab::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    border-radius: 3px;
    background: ${({ theme }) => theme.b2b.purpleLight};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.motion.duration.base} ease;
  }

  .tab[aria-selected="true"]::after {
    transform: scaleX(1);
  }

  .tab:focus-visible {
    outline: 2px solid ${({ theme }) => theme.b2b.teal};
    outline-offset: 3px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

// Todos los casos ocupan la misma celda de la rejilla: la altura es la del más largo y el carrusel no "salta".
const Stage = styled.div`
  display: grid;
  margin-top: ${({ theme }) => theme.space(10)};
`;

const Slide = styled.div<{ $active: boolean }>`
  grid-area: 1 / 1;
  display: grid;
  gap: ${({ theme }) => theme.space(8)};
  align-content: start;
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};

  ${media.up("md")} {
    grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
    gap: ${({ theme }) => `${theme.space(8)} ${theme.space(10)}`};
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
  max-width: 300px;
  width: 100%;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space(10)};
  overflow: hidden;
  border-radius: 28px;
  background: ${({ theme }) => theme.b2b.text};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);

  img {
    max-width: 100%;
    height: auto;
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const Story = styled.div`
  .badge {
    display: inline-block;
    margin-bottom: ${({ theme }) => theme.space(5)};
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(5)}`};
    border: 1px solid ${({ theme }) => theme.b2b.purpleLight};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: rgba(110, 60, 200, 0.25);
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.b2b.text};
  }

  p.text {
    font-size: 1.125rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.b2b.text};
  }
`;

// Resultados: todas las cifras y datos del caso van como tarjetas iguales con visto. El texto se mantiene completo.
const Results = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};

  ${media.up("md")} {
    grid-column: 1 / -1;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }

  li {
    ${glassCard}
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(3.5)};
    min-height: 88px;
    padding: ${({ theme }) => `${theme.space(5)} ${theme.space(6)}`};
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.35;
    color: ${({ theme }) => theme.b2b.text};
    transition:
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  li:hover {
    border-color: ${({ theme }) => theme.b2b.cardBorderActive};
    transform: translateY(-3px);
  }

  .check {
    ${iconTile}
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: ${({ theme }) => theme.b2b.teal};
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
    width: 46px;
    height: 46px;
    border: 1px solid rgba(196, 181, 245, 0.55);
    border-radius: 50%;
    color: ${({ theme }) => theme.b2b.text};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear, border-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .toggle:hover {
    background: rgba(110, 60, 200, 0.3);
    border-color: ${({ theme }) => theme.b2b.lavender};
  }

  .toggle:focus-visible {
    outline: 2px solid ${({ theme }) => theme.b2b.teal};
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
    <Block id="casos" aria-labelledby="cases-title">
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
              <Tabs>
                <div className="list" role="tablist" aria-label="Elegir caso" onKeyDown={onKeyDown}>
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
                </div>
                <a className="tab more" href="#aliados">
                  <span className="tile">{successCases.more}</span>
                  <span className="name" aria-hidden="true">
                    &nbsp;
                  </span>
                </a>
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
                      {c.tags.map((t) => (
                        <li key={t}>
                          <span className="check">
                            <Check size={16} aria-hidden="true" />
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
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
