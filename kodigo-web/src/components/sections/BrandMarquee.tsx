import { useRef } from "react";
import styled from "styled-components";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Marquee } from "../ui/Marquee";

// Franja de aliados en desplazamiento continuo, ubicada justo bajo el Hero (donde antes estaba el panel de
// rutas). Inspirada en `BrandOne.jsx` de la plantilla Eduhall: cabecera corta + marquesina horizontal a
// todo lo ancho. Se diferencia de la sección "Aliados" (panel tintado con grid) en que aquí solo se
// exhiben los logos, sin enlace al directorio, para no duplicar contenido.

const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  /* Banda navy que sella visualmente la portada (Hero) por debajo: la franja va pegada
     a continuación, sin sangría superior, y cierra el bloque del banner. */
  margin-top: -1.5rem;
  background: #131e4b;
  padding-block: ${({ theme }) => theme.space(8)};

  ${media.up("md")} {
    padding-block: ${({ theme }) => theme.space(10)};
  }
`;

const Head = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    margin-bottom: ${({ theme }) => theme.space(8)};
  }
`;

const Title = styled.h2`
  font-size: clamp(0.875rem, 0.7rem + 0.6vw, 1rem);
  font-weight: ${({ theme }) => theme.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.colors.white};
`;

// Pista con máscara de desvanecimiento en los extremos (igual que la sección Aliados) para que
// la marquesina se "funda" en los bordes del viewport.
const Track = styled.div`
  /* Sin padding lateral: el Marquee se extiende de borde a borde del viewport. */
`;

const LogoBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 180px;
  height: 88px;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
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

const PartnerLogo = ({ partner }: { partner: Partner }) => (
  <LogoBox>
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
  </LogoBox>
);

interface BrandMarqueeProps {
  items: Partner[];
}

export const BrandMarquee = ({ items }: BrandMarqueeProps) => {
  const [marqueeRef, near] = useInView<HTMLDivElement>("0px 0px 200px 0px");
  const liveRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;
  const total = items.length;

  return (
    <Wrap aria-labelledby="brand-marquee-title">
      <Head>
        <Title id="brand-marquee-title">Las personas y empresas que caminan con nosotros</Title>
      </Head>

      <Track ref={liveRef}>
        <div ref={marqueeRef}>
          {near ? (
            <Marquee
              label="Logos de aliados"
              duration={Math.max(30, total * 2.5)}
              staticMax={12}
            >
              {items.map((p) => (
                <PartnerLogo key={p.name} partner={p} />
              ))}
            </Marquee>
          ) : null}
        </div>
      </Track>
    </Wrap>
  );
};
