import styled from "styled-components";

const Link = styled.a`
  position: absolute;
  left: ${({ theme }) => theme.space(4)};
  top: ${({ theme }) => theme.space(2)};
  z-index: 100;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weights.semibold};
  transform: translateY(-200%);

  &:focus {
    transform: none;
  }
`;

export const SkipLink = () => <Link href="#contenido">Saltar al contenido</Link>;
