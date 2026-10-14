import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import industry from "@/assets/aivent/bg-industry.webp";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
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

// Muro de aliados estilo "sponsors" de AIvent (solo con `dark`): fondo con foto corporativa bajo velo índigo y bordes que
// se funden con las secciones vecinas; los logos van en un panel de vidrio con filo violeta y entran escalonados.
const Wall = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(180deg, ${({ theme }) => theme.colors.aiventDark} 0%, rgba(16, 20, 53, 0.86) 20%, rgba(16, 20, 53, 0.9) 80%, ${({ theme }) => theme.colors.aiventDark} 100%),
    url(${industry}) center / cover no-repeat,
    ${({ theme }) => theme.colors.aiventDark};
`;

const GlassPanel = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.space(6)};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(26, 30, 66, 0.55);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);

  ${media.down("md")} {
    padding: ${({ theme }) => theme.space(4)};
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  ${media.up("md")} {
    padding: ${({ theme }) => theme.space(10)};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 12%;
    right: 12%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.aiventViolet}, transparent);
  }
`;

// Entrada escalonada de los logos al llegar a la vista (con movimiento reducido se ven de inmediato) y brillo violeta
// al pasar el cursor, como las tarjetas de AIvent.
const WallGrid = styled(Grid)<{ $visible: boolean }>`
  /* En móvil caben dos logos por fila (sin esto el panel quedaba en una sola columna de 49 filas). */
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: ${({ theme }) => theme.space(3)};

  ${media.up("md")} {
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
    gap: ${({ theme }) => theme.space(4)};
  }

  ${media.down("md")} {
    ${Pill} {
      width: 100%;
      max-width: 176px;
      height: 72px;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    li {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
      transform: ${({ $visible }) => ($visible ? "none" : "translateY(16px) scale(0.94)")};
      transition:
        opacity 0.6s ease calc(var(--i) * 40ms),
        transform 0.6s ${({ theme }) => theme.motion.easing} calc(var(--i) * 40ms);
    }
  }

  ${Pill} {
    border-color: rgba(255, 255, 255, 0.14);
    transition:
      transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing},
      box-shadow ${({ theme }) => theme.motion.duration.base} ease;
  }

  li:hover ${Pill}, a:focus-visible ${Pill} {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(118, 77, 240, 0.45), 0 0 0 2px ${({ theme }) => theme.colors.aiventViolet};
  }
`;

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
  /** "marquee": franja en movimiento (Inicio). "grid": todos los logos visibles (página de Alianzas). */
  variant?: "marquee" | "grid";
  /** Sin relleno superior: cuando la sección anterior ya es blanca y aporta su propio relleno inferior. */
  flushTop?: boolean;
  /** Fondo índigo oscuro (estilo AIvent) con título plateado. */
  dark?: boolean;
}

export const Partners = ({ items, variant = "marquee", flushTop = false, dark = false }: PartnersProps) => {
  // La franja solo se monta al acercarse a la pantalla: sus logos se cargan de golpe (eager) y no deben
  // competir con el contenido inicial de la página.
  const [ref, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");
  const [gridRef, gridVisible] = useInView<HTMLUListElement>();
  const Root = dark && variant === "grid" ? Wall : Section;

  return (
    <Root aria-labelledby="partners-title" $compact={variant === "marquee"} style={flushTop ? { paddingTop: 0 } : undefined}>
      <Container>
        <SectionTitle id="partners-title" label="Alianzas" title="Nuestros aliados" tone={dark ? "dark" : "light"} />
      </Container>
      {variant === "grid" ? (
        <Container>
          {dark ? (
            <GlassPanel>
              <WallGrid ref={gridRef} $visible={gridVisible} aria-label="Organizaciones aliadas">
                {items.map((p, i) => (
                  <li key={p.name} style={{ "--i": Math.min(i, 24) } as CSSProperties}>
                    <PartnerItem partner={p} lazy />
                  </li>
                ))}
              </WallGrid>
            </GlassPanel>
          ) : (
            <Grid aria-label="Organizaciones aliadas">
              {items.map((p) => (
                <li key={p.name}>
                  <PartnerItem partner={p} lazy />
                </li>
              ))}
            </Grid>
          )}
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
