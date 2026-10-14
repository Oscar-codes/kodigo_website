import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import logoWhite from "@/assets/brand/kodigo-logo-white.webp";
import worldMap from "@/assets/brand/world-map.webp";
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
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.onNavy};
  padding-top: ${({ theme }) => theme.space(20)};
  overflow: hidden;

  /* Variante AIvent (solo página de Alianzas): fondo índigo con resplandor violeta, hilo de luz arriba y sin mapa. */
  &[data-variant="aivent"] {
    background:
      radial-gradient(50% 70% at 50% 0%, rgba(118, 77, 240, 0.22), transparent 70%),
      ${({ theme }) => theme.colors.aiventDark};
    padding-top: ${({ theme }) => theme.space(16)};
  }

  &[data-variant="aivent"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.aiventViolet}, transparent);
  }
`;

// Mapa mundial punteado de fondo: imagen a tamano natural que se repite (mosaico)
// en lugar de estirarse. Va detras del contenido (z-index negativo sobre el Wrap con isolation).
const Map = styled.div`
  position: absolute;
  inset: 0;
  background: url(${worldMap}) repeat left top;
  z-index: -1;
  pointer-events: none;
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

  /* Disposición del footer de AIvent: bloque de enlaces a cada lado y, al centro, logo y datos, todo centrado. */
  &[data-variant="aivent"] {
    text-align: center;
    padding-bottom: ${({ theme }) => theme.space(12)};

    ${media.up("md")} {
      grid-template-columns: 1fr 1fr;
    }

    ${media.up("lg")} {
      grid-template-columns: 1fr minmax(240px, auto) 1fr;
      grid-template-areas:
        "secciones brand bootcamps"
        "secciones contacto bootcamps";
      align-items: center;
      column-gap: ${({ theme }) => theme.space(16)};
      row-gap: ${({ theme }) => theme.space(6)};

      .brand {
        grid-area: brand;
        align-self: end;
      }
      .secciones {
        grid-area: secciones;
      }
      .bootcamps {
        grid-area: bootcamps;
      }
      #contacto {
        grid-area: contacto;
        align-self: start;
      }
    }

    .brand,
    #contacto {
      ${media.down("md")} {
        grid-column: 1 / -1;
      }
    }

    .logo {
      height: 40px;
      margin-inline: auto;
    }

    h2 {
      font-size: 1.25rem;
    }

    li + li {
      margin-top: ${({ theme }) => theme.space(2)};
    }

    a {
      transition: color ${({ theme }) => theme.motion.duration.hover} linear;
    }

    a:hover {
      color: ${({ theme }) => theme.colors.lilac};
      text-decoration: none;
    }
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

  /* Subfooter de AIvent: franja más oscura con el copyright centrado. */
  &[data-variant="aivent"] {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.22);
  }
`;

const FEATURED = 5; // bootcamps listados en el pie

export const Footer = () => {
  const { pathname } = useLocation();
  const aivent = pathname.replace(/\/+$/, "") === "/profesional/alianzas";
  const variant = aivent ? "aivent" : undefined;
  return (
    <Wrap data-variant={variant}>
      {aivent ? null : <Map aria-hidden="true" />}
      <Grid data-variant={variant}>
        <div className="brand">
          <img className="logo" src={logoWhite} alt={siteConfig.name} width={brand.logoWhite.width} height={brand.logoWhite.height} />
          <p>{siteConfig.tagline}</p>
        </div>
        <nav className="secciones" aria-label="Secciones">
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
        <nav className="bootcamps" aria-label="Bootcamps destacados">
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
      <Bottom data-variant={variant}>
        <Container>
          <div>
            © {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. Todos los derechos reservados.
          </div>
        </Container>
      </Bottom>
    </Wrap>
  );
};
