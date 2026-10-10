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
  /* El Header sticky (84->64 px) tapa el top de la pagina al scrollear a un
     anchor. scroll-margin-top evita que el sectionId aterrice bajo la
     barra y se vea recortado. Cuando el sectionId es <h2>, esta regla
     cuenta por el padding del Section y deja el H2 visible. */
  scroll-margin-top: calc(${({ theme }) => theme.layout.headerHeight} + 8px);
  padding-block: ${({ theme, $compact }) => ($compact ? `calc(${theme.section.y} * 0.7)` : theme.section.y)};
  ${({ $surface, theme }) =>
    $surface &&
    css`
      background: ${theme.colors.surface};
    `}
`;
