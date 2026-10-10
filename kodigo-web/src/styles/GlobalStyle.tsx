import { createGlobalStyle } from "styled-components";

// Solo reset y estilos base; todo lo demás vive en styled-components por componente.
// La tipografía Inter (la de Eduhall) se importa en main.tsx desde @fontsource-variable/inter (autoalojada).
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: ${({ theme }) => theme.weights.regular};
    font-size: 1rem;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 { color: ${({ theme }) => theme.colors.heading}; font-weight: ${({ theme }) => theme.weights.bold}; line-height: 1.2; }
  a { color: inherit; text-decoration: none; }
  ul, ol { list-style: none; padding: 0; }
  img, svg { max-width: 100%; display: block; }
  button { font: inherit; color: inherit; cursor: pointer; background: none; border: 0; }
  /* Anillo violeta con halo blanco: se ve igual sobre fondos claros y sobre el azul marino. */
  :focus-visible { outline: 2px solid ${({ theme }) => theme.colors.main}; outline-offset: 3px; box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.9); }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
`;
