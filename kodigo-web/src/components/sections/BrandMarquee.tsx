import { useRef } from "react";
import styled from "styled-components";
import type { Partner } from "@/data/content";
import { useInView } from "@/hooks/useInView";
import { Marquee } from "../ui/Marquee";

// Franja de aliados en desplazamiento continuo, ubicada justo bajo el Hero (donde antes estaba el panel de
// rutas). Inspirada en `BrandOne.jsx` de la plantilla Eduhall: marquesina horizontal a todo lo ancho con
// los logos en color. Se diferencia de la sección "Aliados" (panel tintado con grid) en que aquí solo
// se exhiben los logos, sin enlace al directorio, para no duplicar contenido.

const Wrap = styled.section`
  position: relative;
  z-index: 2;
  isolation: isolate;
  /* Franja navy de 110 px de alto que sube 15 px sobre la parte inferior del Hero (se monta ligeramente sobre el banner).
     El Hero reserva ese espacio con más relleno inferior y sube sus controles y la tarjeta de objetivos,
     para que la franja no tape contenido. La separación con la siguiente sección sigue yendo en el padding-top
     de la siguiente. */
  display: flex;
  align-items: center;
  height: 110px;
  margin-top: -15px;
  background: #131e4b;
  box-shadow: 0 -12px 32px rgba(7, 20, 49, 0.35);

  > * {
    width: 100%;
  }

  /* Con movimiento reducido la marquesina es una rejilla estática que puede ocupar varias filas: el alto pasa a ser mínimo. */
  @media (prefers-reduced-motion: reduce) {
    height: auto;
    min-height: 110px;
    padding-block: ${({ theme }) => theme.space(4)};
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
  width: 164px;
  height: 76px;
  padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(4)}`};
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
