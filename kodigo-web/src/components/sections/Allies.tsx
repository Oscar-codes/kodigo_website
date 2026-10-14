import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import classPhoto from "@/assets/photos/experience-class.webp";
import autoPhoto from "@/assets/photos/experience-automation.webp";
import trainingPhoto from "@/assets/photos/training.webp";
import heroPhoto from "@/assets/photos/hero.webp";
import type { Partner } from "@/data/content";
import { partnerGroups, whiteLogoOf } from "@/data/partnerGroups";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart, BookOpen, Community, Laptop, Signal } from "../ui/Icons";
import { SectionTitle } from "../ui/SectionTitle";

// "Clientes": red de aliados estratégicos como carrusel por categorías (se arrastra con el ratón, se desliza con el dedo,
// o se usa con flechas, puntos y teclado). Cada diapositiva es un bloque dividido: a la izquierda, una foto con velo azul y
// los logos BLANCOS de 4 aliados de la categoría, que aparecen en cascada al activarse; a la derecha, una tarjeta con foto,
// icono, "01 / CATEGORÍA", título, texto y el número grande de fondo. Solo se muestran 4 logos por categoría.

const ALLIANCES_URL = "/profesional/alianzas";

const photos = [classPhoto, trainingPhoto, autoPhoto, heroPhoto, classPhoto] as const;
const sidePhotos = [trainingPhoto, classPhoto, heroPhoto, autoPhoto, trainingPhoto] as const;
const icons: ReactNode[] = [
  <BookOpen key="e" size={30} />,
  <Laptop key="t" size={30} />,
  <Signal key="s" size={30} />,
  <BarChart key="f" size={30} />,
  <Community key="c" size={30} />,
];

const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

const Slider = styled.div`
  position: relative;
`;

const Track = styled.ul`
  display: flex;
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lift};
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  cursor: grab;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }

  /* Durante el arrastre con el ratón se suspende el imán de las diapositivas para que siga al puntero. */
  &[data-dragging="true"] {
    scroll-snap-type: none;
    scroll-behavior: auto;
    cursor: grabbing;
    user-select: none;
  }
`;

const pop = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(0.9); }
  to { opacity: 1; transform: none; }
`;

const Slide = styled.li`
  flex: 0 0 100%;
  display: grid;
  min-width: 0;
  scroll-snap-align: start;
  background: ${({ theme }) => theme.colors.white};

  ${media.up("md")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    height: 480px;
  }

  /* ----- Izquierda: foto con velo azul y logos blancos ----- */
  .logos {
    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;
    min-height: 260px;
    padding: ${({ theme }) => theme.space(8)} ${({ theme }) => theme.space(6)};
    overflow: hidden;
  }

  .logos > img {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .logos::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(135deg, rgba(30, 27, 110, 0.9) 0%, rgba(53, 66, 190, 0.8) 55%, rgba(75, 74, 241, 0.7) 100%);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
    justify-items: center;
    gap: ${({ theme }) => `${theme.space(8)} ${theme.space(6)}`};
    width: 100%;
    max-width: 440px;
  }

  .logo {
    display: block;
    max-width: 100%;
    height: auto;
    max-height: 64px;
    width: auto;
    opacity: 0;
    filter: drop-shadow(0 4px 14px rgba(7, 20, 49, 0.35));

    ${media.up("md")} {
      max-height: 76px;
    }
  }

  /* Los logos entran en cascada cuando la diapositiva es la activa. */
  &[data-active="true"] .logo {
    opacity: 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-active="true"] .logo {
      animation: ${pop} 0.7s ${({ theme }) => theme.motion.easing} both;
    }

    &[data-active="true"] .grid li:nth-child(2) .logo {
      animation-delay: 0.1s;
    }

    &[data-active="true"] .grid li:nth-child(3) .logo {
      animation-delay: 0.2s;
    }

    &[data-active="true"] .grid li:nth-child(4) .logo {
      animation-delay: 0.3s;
    }
  }

  /* ----- Derecha: tarjeta informativa ----- */
  .info {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.white};
  }

  .photo {
    width: 100%;
    flex: 0 0 190px;
    height: 190px;
    object-fit: cover;

    ${media.up("md")} {
      flex-basis: 230px;
      height: 230px;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin: -32px 0 0 ${({ theme }) => theme.space(8)};
    border: 4px solid ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.orangeSoft};
    color: ${({ theme }) => theme.colors.orangeText};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  .text {
    position: relative;
    z-index: 1;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(8)} ${theme.space(8)}`};
  }

  .kicker {
    display: block;
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.125rem);
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    max-width: 44ch;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }

  /* Número grande de fondo (marca de agua). */
  .num {
    position: absolute;
    right: ${({ theme }) => theme.space(4)};
    bottom: -${({ theme }) => theme.space(4)};
    font-size: clamp(5rem, 3rem + 7vw, 9rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    color: ${({ theme }) => theme.colors.main50};
    pointer-events: none;
    user-select: none;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(4)};
  margin-top: ${({ theme }) => theme.space(6)};

  .arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} ease;
  }

  .arrow:hover:not([disabled]) {
    background: ${({ theme }) => theme.colors.main};
    border-color: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }

  .arrow[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .arrow:focus-visible,
  .dot:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }

  .dots {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
  }

  .dot {
    position: relative;
    width: 10px;
    height: 10px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main200};
    cursor: pointer;
    transition:
      width ${({ theme }) => theme.motion.duration.base} ease,
      background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  /* Área táctil de 44 px sin agrandar el punto visible. */
  .dot::after {
    content: "";
    position: absolute;
    inset: -17px -6px;
  }

  .dot[aria-current="true"] {
    width: 30px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.main};
  }
`;

const FootRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space(8)};
`;

const CtaSecondaryAlt = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 48px;
  padding: ${({ theme }) => `0 ${theme.space(6)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.accentOnLight};
  font-weight: ${({ theme }) => theme.weights.semibold};
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    border-color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.main50};
    border-color: ${({ theme }) => theme.colors.accentOnLight};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

interface AlliesProps {
  /** Se mantiene por compatibilidad con la página de Inicio; la sección usa las categorías de partnerGroups. */
  items?: Partner[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export const Allies = (_props: AlliesProps) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const total = partnerGroups.length;
  const slides = partnerGroups.map((g) => ({ ...g, logos: g.partners.map(whiteLogoOf) }));

  const go = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({ left: next * el.clientWidth });
  };

  // Índice activo según el desplazamiento (sirve para arrastre, dedo, flechas y teclado).
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  // Arrastre con el ratón (el dedo ya desliza de forma nativa).
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      // Se suspenden imán y suavizado de inmediato (sin esperar al render) para que la pista siga al puntero.
      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";
      el.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const el = trackRef.current;
    drag.current = null;
    if (!d || !el || !d.moved) return;
    setDragging(false);
    // Al soltar se restaura el imán y se asienta en la diapositiva más cercana (según hacia dónde se arrastró).
    const target = Math.round(el.scrollLeft / el.clientWidth);
    el.style.scrollSnapType = "";
    el.style.scrollBehavior = "";
    el.scrollTo({ left: target * el.clientWidth });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    }
  };

  // Al cambiar el ancho de la ventana se mantiene la diapositiva activa alineada.
  useEffect(() => {
    const onResize = () => go(index);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  return (
    <Wrap aria-labelledby="allies-title">
      <Container>
        <SectionTitle
          id="allies-title"
          label="Clientes"
          title={
            <>
              Formamos parte de una red de <em>aliados estratégicos.</em>
            </>
          }
          lead="Con centros educativos apoyamos la formación de talento; con empresas formamos y empleamos según sus necesidades de contratación."
        />

        <Slider>
          <Track
            ref={trackRef}
            tabIndex={0}
            role="group"
            aria-roledescription="carrusel"
            aria-label="Aliados por categoría"
            data-dragging={dragging}
            onScroll={onScroll}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(e) => e.preventDefault()}
          >
            {slides.map((s, i) => (
              <Slide key={s.title} data-active={i === index} aria-label={`${i + 1} de ${total}: ${s.title}`} aria-roledescription="diapositiva">
                <div className="logos">
                  <img src={photos[i % photos.length]} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />
                  <ul className="grid" aria-label={`Aliados de ${s.kicker.toLowerCase()}`}>
                    {s.logos.map((l) => (
                      <li key={l.name}>
                        <img className="logo" src={l.src} alt={l.name} width={l.width} height={l.height} loading="lazy" decoding="async" draggable={false} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="info">
                  <img className="photo" src={sidePhotos[i % sidePhotos.length]} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />
                  <span className="icon" aria-hidden="true">
                    {icons[i % icons.length]}
                  </span>
                  <div className="text">
                    <span className="kicker">
                      {pad(i + 1)} / {s.kicker}
                    </span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                  <span className="num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                </div>
              </Slide>
            ))}
          </Track>

          <Controls>
            <button type="button" className="arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Categoría anterior">
              <ArrowLeft size={18} />
            </button>
            <div className="dots">
              {slides.map((s, i) => (
                <button key={s.title} type="button" className="dot" aria-label={`Ir a ${s.title}`} aria-current={i === index} onClick={() => go(i)} />
              ))}
            </div>
            <button type="button" className="arrow" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Categoría siguiente">
              <ArrowRight size={18} />
            </button>
          </Controls>
        </Slider>

        <FootRow>
          <CtaSecondaryAlt to={ALLIANCES_URL} aria-label="Ver el directorio completo de aliados">
            Ver todos los aliados
            <ArrowUpRight size={18} />
          </CtaSecondaryAlt>
        </FootRow>
      </Container>
    </Wrap>
  );
};
