import { css } from "styled-components";

// Elementos visuales de la landing B2B (página Alianzas), según la guía de estilos de Kodigo.

/** Titular claro: blanco cálido de la marca, en negrita (ExtraBold). */
export const headlineText = css`
  color: ${({ theme }) => theme.b2b.text};
  font-weight: 800;
  letter-spacing: -0.02em;
`;

/** Palabra clave de un titular: degradado lavanda → teal. */
export const keywordText = css`
  background-image: ${({ theme }) => theme.b2b.gradientKey};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

/** Etiqueta "[ Texto ]": corchetes en morado claro alrededor del texto. */
export const bracketLabel = css`
  display: inline-block;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${({ theme }) => theme.b2b.text};

  &::before,
  &::after {
    color: ${({ theme }) => theme.b2b.purpleLight};
    font-weight: 700;
    white-space: pre;
  }

  &::before {
    content: "[  ";
  }

  &::after {
    content: "  ]";
  }
`;

/** Tarjeta de vidrio morado (cifras, resultados, aliados). */
export const glassCard = css`
  background: ${({ theme }) => theme.b2b.cardBg};
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 16px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

/** Recuadro de ícono (fondo morado translúcido, borde morado claro). */
export const iconTile = css`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.b2b.tileBg};
  border: 1px solid ${({ theme }) => theme.b2b.tileBorder};
  border-radius: 12px;
`;

/**
 * Fondo de sección con foto ya tratada en morado: la imagen vive en un pseudo-elemento con máscara, de modo que sus bordes
 * superior e inferior se desvanecen y dejan ver el degradado continuo de la página. `veil` (0–1) la oscurece para que el
 * texto claro mantenga el contraste.
 */
export const imageBackdrop = (image: string, veil = 0) => css`
  position: relative;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(rgba(26, 15, 69, ${veil}), rgba(26, 15, 69, ${veil})),
      url(${image}) center / cover no-repeat;
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%);
    mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%);
    pointer-events: none;
  }
`;
