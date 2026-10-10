import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { ArrowRight, ArrowUpRight } from "./Icons";

// Variantes: primary (violeta relleno), outline (borde violeta), light (blanco, para fondos oscuros o violeta),
// outlineLight (borde blanco, para el banner oscuro).
type Variant = "primary" | "outline" | "light" | "outlineLight";

const buttonStyles = css<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: 17px 32px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid transparent;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.weights.medium};
  line-height: 1.2;
  transition: background-color ${({ theme }) => theme.motion.duration.base} ease,
    color ${({ theme }) => theme.motion.duration.base} ease,
    border-color ${({ theme }) => theme.motion.duration.base} ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return css`
          background: ${theme.colors.main};
          border-color: ${theme.colors.main};
          color: ${theme.colors.white};
          &:hover {
            background: ${theme.colors.mainHover};
            border-color: ${theme.colors.mainHover};
          }
        `;
      case "outline":
        return css`
          border-color: ${theme.colors.main};
          color: ${theme.colors.main};
          &:hover {
            background: ${theme.colors.main};
            color: ${theme.colors.white};
          }
        `;
      case "light":
        return css`
          background: ${theme.colors.white};
          border-color: ${theme.colors.white};
          color: ${theme.colors.main};
          &:hover {
            background: ${theme.colors.yellow};
            border-color: ${theme.colors.yellow};
            color: ${theme.colors.navy};
          }
        `;
      case "outlineLight":
        return css`
          border-color: rgba(255, 255, 255, 0.7);
          color: ${theme.colors.white};
          &:hover {
            background: ${theme.colors.white};
            color: ${theme.colors.navy};
          }
        `;
    }
  }}
`;

const StyledLink = styled(Link)<{ $variant: Variant }>`
  ${buttonStyles}
`;

const StyledAnchor = styled.a<{ $variant: Variant }>`
  ${buttonStyles}
`;

interface ButtonLinkProps {
  /** Ruta interna ("/bootcamps") o URL externa ("https://..."). */
  to: string;
  variant?: Variant;
  /** Añade la flecha ↗ de Eduhall; con "right" usa la flecha →. */
  arrow?: boolean | "right";
  children: React.ReactNode;
}

const isExternal = (to: string) => /^https?:\/\//i.test(to);
const isAnchor = (to: string) => to.startsWith("#");

export const ButtonLink = ({ to, variant = "primary", arrow = false, children }: ButtonLinkProps) => {
  const content = (
    <>
      {children}
      {arrow === "right" ? <ArrowRight size={18} /> : arrow && <ArrowUpRight />}
    </>
  );
  if (isAnchor(to)) {
    return (
      <StyledAnchor href={to} $variant={variant}>
        {content}
      </StyledAnchor>
    );
  }
  return isExternal(to) ? (
    <StyledAnchor href={to} target="_blank" rel="noopener noreferrer" $variant={variant}>
      {content}
    </StyledAnchor>
  ) : (
    <StyledLink to={to} $variant={variant}>
      {content}
    </StyledLink>
  );
};
