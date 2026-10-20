import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { ArrowRight, ArrowUpRight } from "./Icons";

// Variantes: primary (gradient institucional 100deg purpleLight -> purpleDeep), outline (borde violeta),
// light (blanco, para fondos oscuros o violeta), outlineLight (borde blanco, para el banner oscuro).
// gradient / ghost: botón primario (degradado lavanda → teal) y secundario (contorno lavanda) de la landing B2B.
type Variant = "primary" | "outline" | "light" | "outlineLight" | "gradient" | "ghost";

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
    border-color ${({ theme }) => theme.motion.duration.base} ease,
    filter ${({ theme }) => theme.motion.duration.base} ease,
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    box-shadow ${({ theme }) => theme.motion.duration.base} ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return css`
          /* Ticket 2.1: el boton de primer nivel usa el degradado institucional
             (purpleLight -> purpleDeep) en lugar del main solido. Border
             transparente porque el degradado llena la caja. Sombra del
             gradient. En hover, un filter: brightness(1.06) y sombra mas
             profunda para mantener el affordance sin cambiar el recurso. */
          background: ${theme.colors.gradientCta};
          border-color: transparent;
          color: ${theme.colors.white};
          box-shadow: 0 8px 22px rgba(117, 87, 250, 0.32);
          &:hover {
            filter: brightness(1.06);
            box-shadow: 0 14px 32px rgba(117, 87, 250, 0.45);
          }
        `;
      case "outline":
        return css`
          border-color: ${theme.colors.accentOnLight};
          color: ${theme.colors.accentOnLight};
          &:hover {
            background: ${theme.colors.accentOnLight};
            color: ${theme.colors.white};
          }
        `;
      case "light":
        return css`
          background: ${theme.colors.white};
          border-color: ${theme.colors.white};
          color: ${theme.colors.accentOnLight};
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
      case "gradient":
        return css`
          background: ${theme.b2b.gradientKey};
          color: ${theme.b2b.onGradient};
          font-weight: ${theme.weights.semibold};
          box-shadow: 0 10px 40px -10px rgba(127, 224, 204, 0.55);
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 48px -10px rgba(127, 224, 204, 0.8);
          }
          &:focus-visible {
            outline-color: ${theme.b2b.text};
          }
        `;
      case "ghost":
        return css`
          background: rgba(26, 15, 69, 0.35);
          border-color: rgba(196, 181, 245, 0.45);
          color: ${theme.b2b.text};
          font-weight: ${theme.weights.semibold};
          &:hover {
            background: rgba(110, 60, 200, 0.22);
            border-color: ${theme.b2b.lavender};
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

const StyledButton = styled.button<{ $variant: Variant }>`
  ${buttonStyles}
  cursor: pointer;
`;

interface ButtonActionProps {
  variant?: Variant;
  arrow?: boolean | "right";
  onClick: () => void;
  /** Indica que el botón abre una ventana modal. */
  haspopup?: "dialog";
  children: React.ReactNode;
}

/** Mismo aspecto que <ButtonLink>, pero como <button> que ejecuta una acción (p. ej. abrir un modal). */
export const ButtonAction = ({ variant = "primary", arrow = false, onClick, haspopup, children }: ButtonActionProps) => (
  <StyledButton type="button" $variant={variant} onClick={onClick} aria-haspopup={haspopup}>
    {children}
    {arrow === "right" ? <ArrowRight size={18} /> : arrow && <ArrowUpRight />}
  </StyledButton>
);

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
