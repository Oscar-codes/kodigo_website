import styled from "styled-components";
import { Breadcrumb, type Crumb } from "../ui/Breadcrumb";
import { scalation, spin, upDown } from "@/styles/effects";
import { Container } from "../ui/Container";

// Cabecera de página de Eduhall: banda tintada con título centrado, migas debajo y adornos de puntos y aro.
const Wrap = styled.header`
  position: relative;
  overflow: hidden;
  text-align: center;
  padding-block: ${({ theme }) => theme.space(16)} ${({ theme }) => theme.space(14)};
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.white} 100%);

  /* Adornos decorativos (pseudo-elementos: no están en el árbol de accesibilidad). */
  &::before {
    content: "";
    position: absolute;
    left: 5%;
    top: 24%;
    width: 84px;
    height: 84px;
    background-image: radial-gradient(circle, ${({ theme }) => theme.colors.orange} 1.6px, transparent 2px);
    background-size: 14px 14px;
    opacity: 0.55;

    @media (prefers-reduced-motion: no-preference) {
      animation: ${upDown} 5s ease-in-out infinite;
    }
  }

  &::after {
    content: "";
    position: absolute;
    right: 8%;
    top: 22%;
    width: 22px;
    height: 22px;
    border: 2px solid ${({ theme }) => theme.colors.orange};
    border-radius: 50%;
    opacity: 0.6;

    @media (prefers-reduced-motion: no-preference) {
      animation: ${scalation} 6s ease-in-out infinite;
    }
  }

  /* Rombo violeta que gira despacio (animación roatation de Eduhall). */
  .shape {
    position: absolute;
    right: 12%;
    bottom: 18%;
    width: 26px;
    height: 26px;
    border: 2px solid ${({ theme }) => theme.colors.main};
    border-radius: 4px;
    opacity: 0.35;
    transform: rotate(45deg);

    @media (prefers-reduced-motion: no-preference) {
      animation: ${spin} 14s linear infinite;
    }
  }

  h1 {
    position: relative;
    font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
    margin-bottom: ${({ theme }) => theme.space(3)};
  }

  nav {
    position: relative;
  }

  p.lead {
    position: relative;
    margin: ${({ theme }) => `${theme.space(5)} auto 0`};
    max-width: 60ch;
  }
`;

interface PageHeaderProps {
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}

export const PageHeader = ({ title, lead, crumbs }: PageHeaderProps) => (
  <Wrap>
    <span className="shape" aria-hidden="true" />
    <Container>
      <h1>{title}</h1>
      {crumbs && <Breadcrumb items={crumbs} />}
      {lead && <p className="lead">{lead}</p>}
    </Container>
  </Wrap>
);
