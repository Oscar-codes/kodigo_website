import styled, { css, keyframes } from "styled-components";

// Elementos visuales de la plantilla AIvent (demo slider-text) adaptados al tema de Kodigo.

/** Texto con degradado blanco -> plata, como los títulos de AIvent sobre fondo oscuro. */
export const silverText = css`
  background-image: linear-gradient(180deg, #ffffff 35%, #a9acc4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

/** Etiqueta "[ Texto ]" de AIvent: corchetes violeta alrededor del texto. */
export const bracketLabel = css`
  display: inline-block;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  color: #ffffff;

  &::before,
  &::after {
    color: #8d6bff;
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

const slideLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const slideRight = keyframes`
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
`;

// Dos franjas inclinadas con texto en movimiento (marquee de AIvent): violeta a +2° y violeta profundo a -1°.
const Wrap = styled.div`
  overflow: hidden;
  padding-block: clamp(2.5rem, 2rem + 3vw, 4.5rem);
  background: ${({ theme }) => theme.colors.aiventDark};
`;

const Band = styled.div<{ $tone: "main" | "deep"; $reverse?: boolean }>`
  display: flex;
  width: 110%;
  margin-left: -5%;
  overflow: hidden;
  padding-block: ${({ theme }) => theme.space(4)};
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme, $tone }) => ($tone === "main" ? theme.colors.aiventViolet : theme.colors.aiventVioletDeep)};
  transform: rotate(${({ $tone }) => ($tone === "main" ? "2deg" : "-1deg")});
  ${({ $tone }) => $tone === "deep" && "margin-top: -20px;"}

  .track {
    display: flex;
    flex: none;
    white-space: nowrap;
    animation: ${({ $reverse }) => ($reverse ? slideRight : slideLeft)} 40s linear infinite;
  }

  .item {
    margin-inline: ${({ theme }) => theme.space(3)};
    font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3.75rem);
    font-weight: ${({ theme }) => theme.weights.medium};
  }

  .sep {
    margin-inline: ${({ theme }) => theme.space(3)};
    font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3.75rem);
    opacity: 0.4;
  }

  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
  }
`;

const Track = ({ items }: { items: string[] }) => (
  <div className="track">
    {[0, 1].map((copy) =>
      items.map((t, i) => (
        <span key={`${copy}-${i}`} style={{ display: "contents" }}>
          <span className="item">{t}</span>
          <span className="sep">/</span>
        </span>
      )),
    )}
  </div>
);

/** Decorativa (aria-hidden): repite frases que ya existen en la página. */
export const SkewBands = ({ items }: { items: string[] }) => (
  <Wrap aria-hidden="true">
    <Band $tone="main">
      <Track items={items} />
    </Band>
    <Band $tone="deep" $reverse>
      <Track items={items} />
    </Band>
  </Wrap>
);
