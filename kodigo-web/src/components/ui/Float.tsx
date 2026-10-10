import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(var(--float-rotate)); }
  50% { transform: translateY(calc(var(--float-range) * -1)) rotate(var(--float-rotate)); }
`;

/**
 * Forma decorativa que flota despacio. Siempre aria-hidden y sin interacción.
 * Con movimiento reducido queda estática (rotación fija, sin animación).
 */
export const Float = styled.span.attrs({ "aria-hidden": true })<{ $rotate?: number; $range?: number; $delay?: number }>`
  --float-rotate: ${({ $rotate = 0 }) => $rotate}deg;
  --float-range: ${({ $range = 16 }) => $range}px;
  position: absolute;
  pointer-events: none;
  transform: rotate(var(--float-rotate));

  @media (prefers-reduced-motion: no-preference) {
    animation: ${float} ${({ theme }) => theme.motion.duration.float} ease-in-out infinite;
    animation-delay: ${({ $delay = 0 }) => $delay}s;
  }
`;
