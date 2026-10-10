import styled, { css, keyframes } from "styled-components";

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Viewport = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
`;

const Track = styled.ul<{ $duration: number; $staticMax?: number }>`
  display: flex;
  width: max-content;
  gap: ${({ theme }) => theme.space(4)};

  /* Con movimiento permitido: desplazamiento continuo (la lista va duplicada para el bucle sin saltos). */
  @media (prefers-reduced-motion: no-preference) {
    animation: ${scroll} ${({ $duration }) => $duration}s linear infinite;
  }

  ${Viewport}:hover &,
  &:focus-within {
    animation-play-state: paused;
  }

  /* Con movimiento reducido: rejilla estática, sin duplicados (y, si se indica, solo los primeros). */
  @media (prefers-reduced-motion: reduce) {
    width: auto;
    flex-wrap: wrap;
    justify-content: center;

    li[aria-hidden="true"] {
      display: none;
    }

    ${({ $staticMax }) =>
      $staticMax
        ? css`
            li:nth-child(n + ${$staticMax + 1}) {
              display: none;
            }
          `
        : ""}
  }
`;

interface MarqueeProps {
  label: string;
  children: React.ReactNode[];
  /** Segundos por vuelta completa. Por defecto 40; con muchos elementos conviene más (≈ 2.5 s por elemento). */
  duration?: number;
  /** Con movimiento reducido, cuántos elementos mostrar en la rejilla estática (por defecto todos). */
  staticMax?: number;
}

/** Franja de elementos en desplazamiento continuo. Se pausa con hover o foco y se vuelve estática con movimiento reducido. */
export const Marquee = ({ label, children, duration = 40, staticMax }: MarqueeProps) => (
  <Viewport role="group" aria-label={label}>
    <Track $duration={duration} $staticMax={staticMax}>
      {children.map((child, i) => (
        <li key={`a-${i}`}>{child}</li>
      ))}
      {/* Copia solo visual para el bucle: fuera del árbol de accesibilidad. */}
      {children.map((child, i) => (
        <li key={`b-${i}`} aria-hidden="true">
          {child}
        </li>
      ))}
    </Track>
  </Viewport>
);
