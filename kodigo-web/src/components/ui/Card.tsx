import styled from "styled-components";

/**
 * Tarjeta de Eduhall: blanco, borde `neutral-30`, 16 px de radio y la sombra suave `box-shadow-md`.
 * Al pasar el cursor el borde se tiñe de violeta y la sombra crece (transición lineal de 0.2 s, como `transition-2`).
 */
export const Card = styled.article`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space(6)};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    border-color: ${({ theme }) => theme.colors.main200};
    box-shadow: ${({ theme }) => theme.shadows.lift};
  }
`;
