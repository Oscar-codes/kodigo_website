import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import alliesBg from "@/assets/b2b/aliados-bg.webp";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { imageBackdrop } from "../ui/B2bKit";
import { Container, Section } from "../ui/Container";
import { ArrowLeft, ArrowRight } from "../ui/Icons";
import { Marquee } from "../ui/Marquee";
import { SectionTitle } from "../ui/SectionTitle";

// Los logos van sobre una tarjeta blanca con borde (son logos de terceros pensados para fondo claro).
const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 176px;
  height: 88px;
  padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.weights.semibold};
  text-align: center;

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  justify-items: center;

  ${media.up("md")} {
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
  }
`;

// Muro de aliados de la landing B2B (solo con `dark`): fondo ya tratado en morado cuyos bordes se funden con las secciones
// vecinas; los logos van en un panel de vidrio morado, sobre tarjetas claras, y entran escalonados.
const Wall = styled(Section)`
  ${imageBackdrop(alliesBg, 0.3)}
  padding-block: ${({ theme }) => theme.section.dense};
  font-family: ${({ theme }) => theme.fonts.b2b};
`;

const GlassPanel = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.space(6)};
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 32px;
  background: rgba(38, 20, 84, 0.55);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);

  ${media.down("md")} {
    padding: ${({ theme }) => theme.space(4)};
    border-radius: 24px;
  }

  ${media.up("md")} {
    padding: ${({ theme }) => theme.space(8)};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.b2b.purpleLight}, transparent);
  }
`;

const CarouselWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  position: relative;
`;

const Track = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.space(4)};
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: ${({ theme }) => `${theme.space(2)} 0`};
  margin: 0;
  list-style: none;
  flex: 1;

  &::-webkit-scrollbar {
    display: none;
  }

  li {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  ${media.down("md")} {
    gap: ${({ theme }) => theme.space(3)};
  }
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(196, 181, 245, 0.4);
  background: rgba(38, 20, 84, 0.7);
  color: ${({ theme }) => theme.b2b.text};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    border-color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: rgba(110, 60, 200, 0.4);
    border-color: ${({ theme }) => theme.b2b.lavender};
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.b2b.teal};
    outline-offset: 3px;
  }

  ${media.down("sm")} {
    width: 36px;
    height: 36px;
  }
`;

const CarouselPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 176px;
  height: 88px;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  background: #edebf5;
  border: 1px solid rgba(196, 181, 245, 0.4);
  border-radius: 16px;
  user-select: none;
  transition:
    transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing},
    box-shadow ${({ theme }) => theme.motion.duration.base} ease;

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  ${media.down("md")} {
    width: 140px;
    height: 72px;
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
  }
`;

const ActionableLink = styled.a`
  display: block;
  text-decoration: none;
  cursor: pointer;

  &:hover ${CarouselPill}, &:focus-visible ${CarouselPill} {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(110, 60, 200, 0.5), 0 0 0 2px ${({ theme }) => theme.b2b.purpleLight};
  }
`;

const AlliesCarousel = ({ items }: { items: Partner[] }) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const offset = direction === "next" ? 220 : -220;
    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const interval = window.setInterval(() => {
      if (!isPaused && track) {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
        if (atEnd) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <CarouselWrap
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <NavBtn type="button" aria-label="Anterior aliado" onClick={() => scroll("prev")}>
        <ArrowLeft size={18} />
      </NavBtn>
      <Track
        ref={trackRef}
        aria-label="Organizaciones aliadas"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={() => {
          touchStartX.current = null;
        }}
      >
        {items.map((p) => {
          const pill = (
            <CarouselPill>
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                p.name
              )}
            </CarouselPill>
          );

          return (
            <li key={p.name}>
              {p.url ? (
                <ActionableLink
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} (abre en una pestaña nueva)`}
                >
                  {pill}
                </ActionableLink>
              ) : (
                pill
              )}
            </li>
          );
        })}
      </Track>
      <NavBtn type="button" aria-label="Siguiente aliado" onClick={() => scroll("next")}>
        <ArrowRight size={18} />
      </NavBtn>
    </CarouselWrap>
  );
};

const More = styled.p`
  margin-top: ${({ theme }) => theme.space(8)};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.accentOnLight};
    font-weight: ${({ theme }) => theme.weights.semibold};
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const Placeholder = styled.div`
  min-height: 88px;
`;

const PartnerItem = ({ partner, lazy }: { partner: Partner; lazy: boolean }) => {
  const inner = (
    <Pill>
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
        />
      ) : (
        partner.name
      )}
    </Pill>
  );
  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (abre en una pestaña nueva)`}>
      {inner}
    </a>
  ) : (
    inner
  );
};

interface PartnersProps {
  items: Partner[];
  /** "marquee": franja en movimiento (Inicio). "grid": todos los logos visibles (página de Profesional). "carousel": carrusel horizontal interactivo (Alianzas B2B). */
  variant?: "marquee" | "grid" | "carousel";
  /** Sin relleno superior: cuando la sección anterior ya es blanca y aporta su propio relleno inferior. */
  flushTop?: boolean;
  /** Fondo morado oscuro de la landing B2B con título claro. */
  dark?: boolean;
}

export const Partners = ({ items, variant = "marquee", flushTop = false, dark = false }: PartnersProps) => {
  // La franja solo se monta al acercarse a la pantalla: sus logos se cargan de golpe (eager) y no deben
  // competir con el contenido inicial de la página.
  const [ref, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");
  const isCarousel = variant === "carousel" || dark;
  const Root = isCarousel ? Wall : Section;

  return (
    <Root id={isCarousel ? "aliados" : undefined} aria-labelledby="partners-title" $compact={variant === "marquee"} style={flushTop ? { paddingTop: 0 } : undefined}>
      <Container>
        <SectionTitle id="partners-title" label="Alianzas" title="Nuestros aliados" tone={dark ? "dark" : "light"} />
      </Container>
      {isCarousel ? (
        <Container>
          <GlassPanel>
            <AlliesCarousel items={items} />
          </GlassPanel>
        </Container>
      ) : variant === "grid" ? (
        <Container>
          <Grid aria-label="Organizaciones aliadas">
            {items.map((p) => (
              <li key={p.name}>
                <PartnerItem partner={p} lazy />
              </li>
            ))}
          </Grid>
        </Container>
      ) : (
        <div ref={ref}>
          {near ? (
            <Marquee label="Organizaciones aliadas" duration={Math.max(30, items.length * 2.5)} staticMax={12}>
              {items.map((p) => (
                <PartnerItem key={p.name} partner={p} lazy={false} />
              ))}
            </Marquee>
          ) : (
            <Placeholder />
          )}
          <Container>
            <More>
              <Link to="/profesional/alianzas">Ver todos los aliados</Link>
            </More>
          </Container>
        </div>
      )}
    </Root>
  );
};
