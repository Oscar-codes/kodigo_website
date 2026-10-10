import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowUpRight } from "../ui/Icons";

// "Kodigo para organizaciones": banner CTA inspirado en la imagen de referencia (panel violeta con
// círculos decorativos, título grande, botón destacado). Limpio, sin card ni foto, para que se lea
// como un cierre de sección en lugar de una sub-vitrina. Decoración con grilla de puntos arriba-derecha
// y gradiente sutil en el panel.

const ALLIANCES_URL = "/profesional/alianzas";

type DotProps = { $color: string; $gap: string; $radius: string };
const dotGrid = ({ $color, $gap, $radius }: DotProps) => css`
  background-image: radial-gradient(circle, ${$color} ${$radius}, transparent calc(${$radius} + 1px));
  background-size: ${$gap} ${$gap};
`;

const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

const DotGrid = styled.div<{ $size: number; $color: string; $gap: string; $radius: string }>`
  position: absolute;
  z-index: 0;
  pointer-events: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  opacity: 0.85;
  ${({ $color, $gap, $radius }) => dotGrid({ $color, $gap, $radius })}

  &.top-right {
    top: 2rem;
    right: 4%;
  }

  &.bottom-left {
    bottom: 3rem;
    left: 4%;
  }
`;

const Banner = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(60% 80% at 100% 0%, ${({ theme }) => theme.colors.violetDeep}d9, transparent 70%),
    radial-gradient(55% 65% at 0% 100%, ${({ theme }) => theme.colors.purpleDark}b3, transparent 70%),
    linear-gradient(160deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 100%);
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lift};
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: ${({ theme }) => `${theme.space(14)} ${theme.space(6)}`};
  text-align: center;

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(20)} ${theme.space(10)}`};
  }
`;

// Círculos decorativos a izquierda y derecha (igual a la imagen de referencia).
const Circle = styled.span<{ $size: number; $top: string; $left: string; $tone: "on" | "off" }>`
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;

  ${({ $size, $top, $left }) => css`
    width: ${$size}px;
    height: ${$size}px;
    top: ${$top};
    left: ${$left};
  `}

  ${({ $tone }) =>
    $tone === "on"
      ? css`
          background: rgba(175, 148, 248, 0.18);
        `
      : css`
          background: rgba(255, 255, 255, 0.06);
        `}
`;

const Status = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(6)};

  .chip {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1px dashed ${({ theme }) => theme.colors.lilac};
    background: rgba(175, 148, 248, 0.1);
    color: ${({ theme }) => theme.colors.lilac};
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .dot {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
    background: rgba(255, 255, 255, 0.04);
    color: ${({ theme }) => theme.colors.onNavy};
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.green};
      box-shadow: 0 0 0 4px rgba(47, 167, 95, 0.18);
    }
  }
`;

const Heading = styled.h2`
  margin: 0 auto ${({ theme }) => theme.space(10)};
  max-width: 20ch;
  font-size: clamp(1.875rem, 1.3rem + 2.4vw, 3.5rem);
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: -0.02em;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.lilac};
  }
`;

const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 56px;
  padding: ${({ theme }) => `0 ${theme.space(8)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.heading};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.lilac};
    color: ${({ theme }) => theme.colors.heading};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

export const Organizations = () => (
  <Wrap aria-labelledby="organizations-title">
    <DotGrid className="top-right" $size={110} $color="#2FA75F" $gap="12px" $radius="2.2px" aria-hidden="true" />
    <DotGrid className="bottom-left" $size={110} $color="#F37739" $gap="12px" $radius="2.2px" aria-hidden="true" />
    <Container>
      <Banner>
        <Circle $size={180} $top="-3rem" $left="3%" $tone="on" aria-hidden="true" />
        <Circle $size={240} $top="60%" $left="-4rem" $tone="off" aria-hidden="true" />
        <Circle $size={140} $top="20%" $left="auto" $tone="on" style={{ right: "12%" }} aria-hidden="true" />
        <Circle $size={200} $top="auto" $left="auto" $tone="off" style={{ right: "-3rem", bottom: "-2rem" }} aria-hidden="true" />

        <Status aria-label="Estado de la propuesta">
          <span className="chip">B2B Kodigo · 2025</span>
          <span className="dot" aria-hidden="true">
            Disponible
          </span>
        </Status>
        <Heading id="organizations-title">
          El talento de tu equipo <em>también puede evolucionar.</em>
        </Heading>
        <Cta to={ALLIANCES_URL} aria-label="Solicitar una conversación para Kodigo Empresas">
          Solicitar una conversación
          <ArrowUpRight size={20} />
        </Cta>
      </Banner>
    </Container>
  </Wrap>
);
