import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp } from "@/styles/effects";
import { BookOpen } from "./Icons";
import { bracketLabel, silverText } from "./AiventKit";

// Entrada de los títulos de sección como en Eduhall: la etiqueta cae (bounceInDown), el título aparece rebotando
// (bounceIn) y el párrafo sube (bounceInUp). Con movimiento reducido todo se ve de inmediato.
const Wrap = styled.div<{ $align: "center" | "left"; $visible: boolean; $dark: boolean }>`
  text-align: ${({ $align }) => $align};
  margin-bottom: ${({ theme }) => theme.space(12)};

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.2;
    /* Al llegar por un ancla (menú) el título no queda bajo la cabecera sticky y se alcanza a ver la etiqueta de arriba. */
    scroll-margin-top: calc(${({ theme }) => theme.layout.headerHeightScrolled} + 5.5rem);
  }

  h2 em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  p.lead {
    margin: ${({ theme, $align }) => `${theme.space(4)} ${$align === "center" ? "auto" : "0"} 0`};
    max-width: 60ch;
  }

  /* Tono oscuro (página de Alianzas, estilo AIvent): etiqueta entre corchetes, título plateado y texto claro. */
  ${({ $dark, theme }) =>
    $dark &&
    css`
      .label {
        ${bracketLabel}
        font-weight: ${theme.weights.medium};
      }

      h2 {
        ${silverText}
      }

      h2 em {
        background: none;
        -webkit-text-fill-color: ${theme.colors.lilac};
        color: ${theme.colors.lilac};
      }

      p.lead {
        color: ${theme.colors.onNavy};
      }
    `}

  @media (prefers-reduced-motion: no-preference) {
    .label,
    h2,
    p.lead {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    }

    ${({ $visible }) =>
      $visible &&
      css`
        .label {
          animation: ${bounceInDown} 0.9s ease both;
        }
        h2 {
          animation: ${bounceIn} 0.9s ease 0.1s both;
        }
        p.lead {
          animation: ${bounceInUp} 0.9s ease 0.2s both;
        }
      `}
  }
`;

interface SectionTitleProps {
  id: string;
  /** Texto o nodos; un <em> dentro del título se destaca con el color principal. */
  title: ReactNode;
  lead?: string;
  /** Etiqueta con icono sobre el título, típica de Eduhall ("Latest News", "Campus Life"…). */
  label?: string;
  align?: "center" | "left";
  /** Fondo oscuro: título plateado y etiqueta con corchetes (AIvent). */
  tone?: "light" | "dark";
}

export const SectionTitle = ({ id, title, lead, label, align = "center", tone = "light" }: SectionTitleProps) => {
  const [ref, visible] = useInView<HTMLDivElement>();
  return (
    <Wrap ref={ref} $align={align} $visible={visible} $dark={tone === "dark"}>
      {label && (
        <span className="label">
          {tone === "dark" ? null : <BookOpen />}
          {label}
        </span>
      )}
      <h2 id={id}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Wrap>
  );
};
