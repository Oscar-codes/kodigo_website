import { useRef } from "react";
import styled from "styled-components";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Marquee } from "../ui/Marquee";

// Franja de aliados en desplazamiento continuo, ubicada justo bajo el Hero (donde antes estaba el panel de
// rutas). Inspirada en `BrandOne.jsx` de la plantilla Eduhall: marquesina horizontal a todo lo ancho con
// los logos en color. Se diferencia de la sección "Aliados" (panel tintado con grid) en que aquí solo
// se exhiben los logos, sin enlace al directorio, para no duplicar contenido.

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
    <Wrap aria-label="Logos de aliados en marquesina">
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
