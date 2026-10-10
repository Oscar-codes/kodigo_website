import { Link } from "react-router-dom";
import styled from "styled-components";
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

const More = styled.p`
  margin-top: ${({ theme }) => theme.space(8)};
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.main};
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
}

export const Partners = ({ items, variant = "marquee", flushTop = false }: PartnersProps) => {
  // La franja solo se monta al acercarse a la pantalla: sus logos se cargan de golpe (eager) y no deben
  // competir con el contenido inicial de la página.
  const [ref, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");

  return (
    <Section aria-labelledby="partners-title" $compact={variant === "marquee"} style={flushTop ? { paddingTop: 0 } : undefined}>
      <Container>
        <SectionTitle id="partners-title" label="Alianzas" title="Nuestros aliados" />
      </Container>
      {variant === "grid" ? (
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
    </Section>
  );
};
