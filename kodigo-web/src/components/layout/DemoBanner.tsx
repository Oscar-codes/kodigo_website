import styled from "styled-components";

const Bar = styled.aside`
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  text-align: center;
  font-size: 0.85rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  background: ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.navy};
`;

/**
 * Aviso permanente del modo demostración: el contenido es de EJEMPLO y no debe publicarse.
 * Es un <aside> (landmark) para que no quede contenido fuera de regiones de la página.
 */
export const DemoBanner = () => (
  <Bar aria-label="Aviso de modo demostración">Modo demostración · contenido de ejemplo, no oficial · no publicar</Bar>
);
