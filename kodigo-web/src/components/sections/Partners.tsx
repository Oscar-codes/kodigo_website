import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import alliesBg from "@/assets/b2b/aliados-bg.webp";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { imageBackdrop } from "../ui/B2bKit";
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

// Entrada escalonada de los logos al llegar a la vista (con movimiento reducido se ven de inmediato) y brillo violeta
// al pasar el cursor.
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
    background: #edebf5;
    border: 1px solid rgba(196, 181, 245, 0.4);
    border-radius: 16px;
    transition:
      transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing},
      box-shadow ${({ theme }) => theme.motion.duration.base} ease;
  }

  li:hover ${Pill}, a:focus-visible ${Pill} {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(110, 60, 200, 0.5), 0 0 0 2px ${({ theme }) => theme.b2b.purpleLight};
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
  /** Fondo morado oscuro de la landing B2B con título claro. */
  dark?: boolean;
}

export const Partners = ({ items, variant = "marquee", flushTop = false, dark = false }: PartnersProps) => {
  // La franja solo se monta al acercarse a la pantalla: sus logos se cargan de golpe (eager) y no deben
  // competir con el contenido inicial de la página.
  const [ref, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");
  const [gridRef, gridVisible] = useInView<HTMLUListElement>();
  const Root = dark && variant === "grid" ? Wall : Section;

  return (
    <Root id={dark && variant === "grid" ? "aliados" : undefined} aria-labelledby="partners-title" $compact={variant === "marquee"} style={flushTop ? { paddingTop: 0 } : undefined}>
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
