import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { successCases } from "@/data/alliances";
import { partners } from "@/data/partners";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp, scalation, upDown } from "@/styles/effects";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

const AUTOPLAY_MS = 7000;
const logoOf = (name: string) => partners.find((p) => p.name === name);

// Carrusel de casos de éxito: banda con el degradado violeta de Kodigo (el mismo del bloque del workshop), aros
// decorativos de Eduhall (upDown / scalation), título con entrada bounce y los casos cambian solos con un fundido lateral.
// Los logos de abajo son las pestañas del carrusel. Cumple WCAG 2.2.2: hay botón de pausa, se detiene al pasar el cursor
// o enfocar, y con movimiento reducido no avanza solo.
const Panel = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.space(14)} ${theme.space(5)}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  color: ${({ theme }) => theme.colors.white};
  background:
    radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1.6px) 0 0 / 22px 22px,
    radial-gradient(55% 90% at 92% 8%, rgba(175, 148, 248, 0.28), transparent 70%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.mainHover} 0%, ${({ theme }) => theme.colors.main} 50%, #6a4fe3 100%);

  ${media.up("lg")} {
    padding: ${({ theme }) => `${theme.space(16)} ${theme.space(12)}`};
  }

  .ring {
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  .ring.a {
    top: -48px;
    right: 4%;
    width: 120px;
    aspect-ratio: 1;
  }

  .ring.b {
    top: 56px;
    right: 4%;
    width: 120px;
    aspect-ratio: 1;
  }

  .ring.c {
    bottom: -90px;
    left: -70px;
    width: 300px;
    aspect-ratio: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    .ring.a {
      animation: ${upDown} 6s ease-in-out infinite;
    }
    .ring.b {
      animation: ${upDown} 6s ease-in-out 0.6s infinite;
    }
    .ring.c {
      animation: ${scalation} 9s ease-in-out infinite;
    }
  }
`;

const Head = styled.div<{ $visible: boolean }>`
  max-width: 760px;
  margin: 0 auto ${({ theme }) => theme.space(12)};
  text-align: center;

  .label {
    display: block;
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.14em;
    color: ${({ theme }) => theme.colors.white};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    font-weight: ${({ theme }) => theme.weights.medium};
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.white};
  }

  h2 strong {
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  p.lead {
    margin-top: ${({ theme }) => theme.space(4)};
    color: ${({ theme }) => theme.colors.white};
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

// Todos los casos ocupan la misma celda de la rejilla: la altura es la del más largo y el carrusel no "salta".
const Stage = styled.div`
  display: grid;
  max-width: 980px;
  margin-inline: auto;
`;

const Slide = styled.div<{ $active: boolean }>`
  grid-area: 1 / 1;
  display: grid;
  gap: ${({ theme }) => theme.space(8)};
  align-items: center;
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};

  ${media.up("md")} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
    gap: ${({ theme }) => theme.space(12)};
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
  max-width: 340px;
  width: 100%;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space(8)};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 20px 50px rgba(7, 20, 49, 0.35);

  img {
    max-width: 100%;
    height: auto;
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const Story = styled.div`
  .badge {
    display: inline-block;
    margin-bottom: ${({ theme }) => theme.space(5)};
    padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(5)}`};
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.white};
  }

  p.text {
    margin-bottom: ${({ theme }) => theme.space(6)};
    font-size: 1.0625rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.white};
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space(2)};
  }

  li {
    padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.main100};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.heading};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  li:hover {
    background: ${({ theme }) => theme.colors.white};
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(4)};
  max-width: 980px;
  margin: ${({ theme }) => `${theme.space(12)} auto 0`};

  [role="tablist"] {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${({ theme }) => theme.space(3)};
  }

  .tab {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 64px;
    padding: ${({ theme }) => theme.space(2.5)};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.white};
    opacity: 0.75;
    transition:
      transform ${({ theme }) => theme.motion.duration.hover} linear,
      opacity ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .tab:hover {
    opacity: 1;
    transform: translateY(-4px);
  }

  .tab[aria-selected="true"] {
    opacity: 1;
    transform: translateY(-4px);
  }

  .tab[aria-selected="true"]::after {
    content: "";
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: -9px;
    height: 3px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.yellow};
  }

  .tab:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }

  .tab img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

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
    color: ${({ theme }) => theme.colors.accentOnLight};
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
    <Section aria-labelledby="cases-title">
      <Container>
        <Panel>
          <span className="ring a" aria-hidden="true" />
          <span className="ring b" aria-hidden="true" />
          <span className="ring c" aria-hidden="true" />
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
              <Stage aria-roledescription="carrusel" aria-label="Casos de éxito">
                {cases.map((c, i) => (
                  <Slide key={c.partner} id={`case-${i}`} role="tabpanel" aria-labelledby={`case-tab-${i}`} $active={i === index}>
                    <LogoTile>
                      {c.logo?.logo && <img src={c.logo.logo} alt={c.partner} width={c.logo.width} height={c.logo.height} />}
                    </LogoTile>
                    <Story>
                      <span className="badge">{c.badge}</span>
                      <p className="text">{c.text}</p>
                      <ul aria-label="Resultados del programa">
                        {c.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </Story>
                  </Slide>
                ))}
              </Stage>
              <Controls>
                <div role="tablist" aria-label="Elegir caso" onKeyDown={onKeyDown}>
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
                      {c.logo?.logo && <img src={c.logo.logo} alt="" width={c.logo.width} height={c.logo.height} loading="lazy" />}
                    </button>
                  ))}
                </div>
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
    </Section>
  );
};
