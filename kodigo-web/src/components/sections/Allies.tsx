import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowUpRight, Users } from "../ui/Icons";
import { Marquee } from "../ui/Marquee";

// "Aliados": sección limpia, complementaria al panel navy de Organizations. Cabecera corta y panel
// tintado con la marquesina de logos (mismo patrón que `BrandOne.jsx`, refinado con cabecera cohesiva
// y enlace al directorio completo).

const ALLIANCES_URL = "/profesional/alianzas";

const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

const Head = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(10)};
  text-align: center;
  align-items: center;
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.heading};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.weights.semibold};

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main};
  }
`;

const Heading = styled.h2`
  font-size: clamp(1.5rem, 1rem + 1.6vw, 2rem);
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.heading};
  letter-spacing: -0.01em;
  max-width: 24ch;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.text};
  max-width: 56ch;
`;

const Panel = styled.div`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => `${theme.space(10)} ${theme.space(4)}`};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(12)} ${theme.space(6)}`};
  }
`;

const CountRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(8)};

  .pill {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.heading};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.medium};

    svg {
      color: ${({ theme }) => theme.colors.accentOnLight};
    }
  }
`;

const Logo = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 96px;
  padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.weights.semibold};
  text-align: center;
  transition:
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    border-color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accentOnLight};
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const PartnerLogo = ({ partner }: { partner: Partner }) => {
  const inner = (
    <Logo>
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          loading="lazy"
          decoding="async"
        />
      ) : (
        partner.name
      )}
    </Logo>
  );
  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} (abre en una pestaña nueva)`}
    >
      {inner}
    </a>
  ) : (
    inner
  );
};

const FootRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(5)};
  margin-top: ${({ theme }) => theme.space(10)};
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
  items: Partner[];
}

export const Allies = ({ items }: AlliesProps) => {
  const [marqueeRef, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");
  const total = items.length;

  return (
    <Wrap aria-labelledby="allies-title">
      <Container>
        <Head>
          <Label>Aliados</Label>
          <Heading id="allies-title">
            Las personas y empresas <em>que caminan con nosotros.</em>
          </Heading>
          <Lead>
            Empresas, universidades y aliados que confían en Kodigo para formar a sus equipos y abrir nuevas rutas profesionales.
          </Lead>
        </Head>

        <Panel>
          <CountRow>
            <span className="pill">
              <Users size={16} />
              {total} {total === 1 ? "organización aliada" : "organizaciones aliadas"} en cartera
            </span>
          </CountRow>

          <div ref={marqueeRef}>
            {near ? (
              <Marquee
                label="Organizaciones aliadas"
                duration={Math.max(30, total * 2.5)}
                staticMax={12}
              >
                {items.map((p) => (
                  <PartnerLogo key={p.name} partner={p} />
                ))}
              </Marquee>
            ) : null}
          </div>
        </Panel>

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
