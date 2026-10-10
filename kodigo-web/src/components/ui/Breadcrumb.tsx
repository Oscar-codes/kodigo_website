import { Link } from "react-router-dom";
import styled from "styled-components";

export interface Crumb {
  label: string;
  /** Sin `to` = página actual (no es enlace, lleva aria-current). */
  to?: string;
}

// Como la cabecera de página de Eduhall: centradas, con la página actual resaltada.
const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.heading};

  li + li::before {
    content: "›";
    margin-right: ${({ theme }) => theme.space(2)};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.accentOnLight};
    text-decoration: underline;
  }

  [aria-current="page"] {
    color: ${({ theme }) => theme.colors.orangeText};
    font-weight: ${({ theme }) => theme.weights.medium};
  }
`;

export const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Migas de pan">
    <List>
      {items.map((c) => (
        <li key={c.label}>
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </li>
      ))}
    </List>
  </nav>
);
