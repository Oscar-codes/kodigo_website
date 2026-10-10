import { Link } from "react-router-dom";
import styled from "styled-components";
import logoWhite from "@/assets/brand/kodigo-logo-white.webp";
import brand from "@/assets/brand/brand.json";
import { bootcamps } from "@/data/bootcamps";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { Container } from "../ui/Container";

// El Header ya muestra la navegacion completa. En el Footer evitamos esos
// enlaces para no duplicarlos visualmente (Bug del ticket: 'Saber mas' y
// 'Clientes' aparecian dos veces). Solo dejamos los items que actuan como
// portal de retorno rapido desde el bottom de la pagina.
const FOOTER_EXCLUDED = new Set(["Saber más", "Clientes"]);

// Footer azul marino de Eduhall (neutral-900): columnas de enlaces y barra inferior.
const Wrap = styled.footer`
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.onNavy};
  padding-top: ${({ theme }) => theme.space(20)};
`;

const Grid = styled(Container)`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  padding-bottom: ${({ theme }) => theme.space(14)};

  ${media.up("md")} {
    grid-template-columns: 1.4fr 1fr 1.2fr 1fr;
  }

  .logo {
    height: 30px;
    width: auto;
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h2 {
    margin-bottom: ${({ theme }) => theme.space(5)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
  }

  li + li {
    margin-top: ${({ theme }) => theme.space(3)};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
`;

const Bottom = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.colors.borderOnNavy};

  > div {
    padding-block: ${({ theme }) => theme.space(6)};
    text-align: center;
    font-size: 0.9rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

const FEATURED = 5; // bootcamps listados en el pie

export const Footer = () => (
  <Wrap>
    <Grid>
      <div>
        <img className="logo" src={logoWhite} alt={siteConfig.name} width={brand.logoWhite.width} height={brand.logoWhite.height} />
        <p>{siteConfig.tagline}</p>
      </div>
      <nav aria-label="Secciones">
        <h2>Secciones</h2>
        <ul>
          {navigation
            .filter((n) => !FOOTER_EXCLUDED.has(n.label))
            .map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <nav aria-label="Bootcamps destacados">
        <h2>Bootcamps</h2>
        <ul>
          {bootcamps.slice(0, FEATURED).map((b) => (
            <li key={b.slug}>
              <Link to={`/bootcamps/${b.slug}`}>{b.name}</Link>
            </li>
          ))}
          <li>
            <Link to="/bootcamps">Ver todos los bootcamps</Link>
          </li>
        </ul>
      </nav>
      <div id="contacto">
        <h2>Contacto</h2>
        <p>{siteConfig.domain}</p>
      </div>
    </Grid>
    <Bottom>
      <Container>
        <div>
          © {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. Todos los derechos reservados.
        </div>
      </Container>
    </Bottom>
  </Wrap>
);
