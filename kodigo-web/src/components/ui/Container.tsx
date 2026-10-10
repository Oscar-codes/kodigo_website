import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.space(5)};
`;

/** Sección con el ritmo vertical de Eduhall (120 px en escritorio). `$surface` aplica el fondo alterno. */
export const Section = styled.section<{ $surface?: boolean; $compact?: boolean }>`
  /* Las entradas laterales (fade-left/right) no deben ampliar el ancho de la página mientras esperan. */
  overflow-x: clip;
  padding-block: ${({ theme, $compact }) => ($compact ? `calc(${theme.section.y} * 0.7)` : theme.section.y)};
  ${({ $surface, theme }) =>
    $surface &&
    css`
      background: ${theme.colors.surface};
    `}
`;
