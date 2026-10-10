import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import logoDark from "@/assets/brand/kodigo-logo-dark.webp";
import brand from "@/assets/brand/brand.json";
import { navigation, type NavItem } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { Container } from "../ui/Container";
import { ChevronDown } from "../ui/Icons";
import { ScrollProgress } from "../ui/ScrollProgress";

// Sube al top de la pagina con scroll suave cuando se hace click en el logo o
// en el menu "Inicio". Funciona en cualquier ruta, incluido cuando ya estamos
// en "/": React Router ignora navegaciones a la misma ruta (no se dispara el
// useEffect del Layout), asi que este handler es el que garantiza el
// comportamiento en todos los casos. Respeta teclas de modificador (Ctrl / Cmd /
// Shift / Alt) para que el usuario pueda abrir el destino en nueva pestana.
const scrollToTop = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

// Header de Kodigo: TRANSPARENTE al inicio (z-index superior sobre el hero para que la foto pase por
// detrás) y translúcido 'frosted glass' al desplazarse. El backdrop-filter blur + saturate revela la
// marca cuando cruza el umbral de scroll. Para que el efecto sea visualmente perceptible sin tapar
// el contenido usamos alpha 0.55 + blur(32px) saturate(2.2) - más aire que un glass de marketing pero
// sin llegar a ser solido.
const Bar = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme, $scrolled }) => ($scrolled ? theme.colors.headerGlass : "transparent")};
  border-bottom: 1px solid
    ${({ theme, $scrolled }) => ($scrolled ? theme.colors.main100 : "transparent")};
  box-shadow: ${({ theme, $scrolled }) => ($scrolled ? theme.shadows.float : "0 0 0 rgba(7, 20, 49, 0)")};
  color: ${({ theme }) => theme.colors.purple};
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(32px) saturate(2.2)" : "none")};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(32px) saturate(2.2)" : "none")};
  transition:
    background-color ${({ theme }) => theme.motion.duration.base} linear,
    border-color ${({ theme }) => theme.motion.duration.base} linear,
    box-shadow ${({ theme }) => theme.motion.duration.base} linear,
    -webkit-backdrop-filter ${({ theme }) => theme.motion.duration.base} linear,
    backdrop-filter ${({ theme }) => theme.motion.duration.base} linear;
`;

/** Distancia de scroll (px) a partir de la cual la cabecera pasa de sólida a translúcida. */
const SCROLL_THRESHOLD = 24;

const Inner = styled(Container)<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(6)};
  min-height: ${({ theme, $scrolled }) =>
    $scrolled ? theme.layout.headerHeightScrolled : theme.layout.headerHeight};
  transition:
    min-height ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing};
`;

const Brand = styled(Link)<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  flex: none;
  /* Sin padding ni line-height externo, el <a> del Brand mide lo mismo que el
     <img> interno (36 -> 28 px). Asi el menu flex-row con align-items: center
     ve dos cajas de la misma altura y los items quedan sobre la misma linea
     que el logo. */
  line-height: 0;
  /* El logo queda detras del menu. Con position + z-index 0, su orden de pila
     queda anclado a esta capa inferior del stacking context del Inner. */
  position: relative;
  z-index: 0;

  img {
    display: block;
    /* Altura del cuadro fija (el maximo: 36 px). Cambiamos la 'altura visual'
       del logo con transform: scale en vez de cambiar la altura del <img>;
       asi el layout (ancho del Brand, posicion del Menu) no se ve afectado
       y los items no se desplazan hacia la izquierda al scrollear.
       Regla review-animations: animar transform (GPU) en vez de height
       (layout) siempre que se pueda. */
    height: ${({ theme }) => theme.layout.logoHeight};
    width: auto;
    transform: scale(${({ theme, $scrolled }) =>
      $scrolled ? theme.layout.logoHeightScrolledRatio : 1});
    transform-origin: left center;
    transition: transform ${({ theme }) => theme.motion.duration.base}
      ${({ theme }) => theme.motion.easing};
  }
`;

const Menu = styled.nav<{ $open: boolean }>`
  ${media.up("lg")} {
    flex: 1;
    margin-left: ${({ theme }) => theme.space(2)};
    position: relative;
    z-index: 1;
  }

  ${media.down("lg")} {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.main100};
    box-shadow: ${({ theme }) => theme.shadows.float};
    max-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
    overflow-y: auto;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(5)}`};
  }

  ul.top {
    display: flex;
    gap: ${({ theme }) => theme.space(1)};

    ${media.down("lg")} {
      flex-direction: column;
    }
  }
`;

const Item = styled.li`
  position: relative;
  /* Cada item se posiciona a la misma capa que el nav (z-index 1 del Menu) para
     que cualquier hover activo, focus ring o chevron se pinte sobre el logo. */
  z-index: 1;

  > a,
  > button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3.5)}`};
    /* line-height: 1 controla la altura de la linea del texto y, combinado
       con los 8 px de padding-top/bottom, da una altura total ~30 px.
       El logo mide 36 px (cuadro fijo); con align-items: center del Inner el menu
       queda dentro de 1-2 px de diferencia y se ve 'encima' del logo. */
    line-height: 1;
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 0.875rem;
    /* Manrope primero; cae al system stack si no esta cargada. Mantenemos el
       mismo peso en hover y en expanded (medium) para evitar el "saltito" de
       layout cuando un glyph de peso 700 mete width mayor que su version 500
       (regla review-animations: nada que mueva layout al cursor). */
    font-family: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
    font-weight: ${({ theme }) => theme.weights.medium};
    letter-spacing: 0.01em;
    /* Capitalize: solo la primera letra en mayúsculas. Mantiene "FAQ" intacto si viene
       del dato y respeta "Bootcamps", "Nosotros", etc. */
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.purple};
    transition:
      color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} ${({ theme }) => theme.motion.easing},
      box-shadow ${({ theme }) => theme.motion.duration.hover} ${({ theme }) => theme.motion.easing};
  }

  /* En hover/expanded no cambiamos font-weight: la pista visual viene del
     color (purpleDark + una linea dashed bajo el item activo via border
     aplicada al padre <li>). Asi el menu no se mueve al pasar el cursor. */
  > a:hover,
  > button:hover,
  > button[aria-expanded="true"] {
    color: ${({ theme }) => theme.colors.purpleDark};
  }

  /* CTA "Aplicar" (ultima opcion del menu): boton pill con degradado
     purpleLight->purpleDeep, texto blanco y sombra suave. En hover, lift
     translateY(-2px) para llamar la atencion + sombra mas profunda. El
     bloque se escribe al final del rule para ganar en cascada frente a
     los selectores simples (regla ui-ux-pro-max: jerarquia de
     interacciones). */
  > a[data-cta="true"],
  > button[data-cta="true"] {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.gradientCta};
    box-shadow: 0 8px 20px rgba(117, 87, 250, 0.32);
  }

  > a[data-cta="true"]:hover,
  > a[data-cta="true"]:focus-visible,
  > button[data-cta="true"]:hover,
  > button[data-cta="true"]:focus-visible,
  > button[data-cta="true"][aria-expanded="true"] {
    /* Mantener el color blanco sin importar el purpleDark del hover general. */
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(117, 87, 250, 0.45);
  }

  @media (hover: hover) and (pointer: fine) {
    > a[data-cta="true"]:hover,
    > button[data-cta="true"]:hover {
      transform: translateY(-2px);
    }
  }
`;

// Submenú: tarjeta blanca en escritorio; en móvil se integra al panel blanco.
const Submenu = styled.ul<{ $open: boolean; $wide: boolean }>`
  display: ${({ $open }) => ($open ? "block" : "none")};

  ${media.up("lg")} {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: ${({ $wide }) => ($wide ? "560px" : "280px")};
    padding: ${({ theme }) => theme.space(3)};
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.float};
  }

  ${media.down("lg")} {
    padding-left: ${({ theme }) => theme.space(4)};
  }

  .groups {
    display: grid;
    gap: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(5)};

    ${media.up("lg")} {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      padding-top: ${({ theme }) => theme.space(2)};
    }
  }

  .group-title {
    padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.purple};
  }

  a {
    display: block;
    padding: ${({ theme }) => `${theme.space(2)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.heading};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.purple};
  }
`;

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: auto;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.purple};

  ${media.up("lg")} {
    display: none;
  }
`;

const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

const Dropdown = ({ item }: { item: NavItem }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const itemRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const submenuId = `submenu-${item.to.replace(/\//g, "")}`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cierra al hacer clic fuera del elemento.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: globalThis.MouseEvent) => {
      if (!itemRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <Item
      ref={itemRef}
      onMouseEnter={() => isDesktop() && setOpen(true)}
      onMouseLeave={() => isDesktop() && setOpen(false)}
      // Cierra cuando el foco sale del elemento (Tab hacia fuera).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={pathname.startsWith(item.to) ? "active" : undefined}
        aria-expanded={open}
        aria-controls={submenuId}
        // En escritorio el hover ya abrió el menú: el clic no debe cerrarlo.
        onClick={() => setOpen((o) => (isDesktop() ? true : !o))}
      >
        {item.label} <ChevronDown />
      </button>
      <Submenu id={submenuId} $open={open} $wide={!!item.groups}>
        <li>
          <Link to={item.to}>Ver todo</Link>
        </li>
        {item.groups ? (
          <li>
            <div className="groups">
              {item.groups.map((g) => (
                <div key={g.title}>
                  <p className="group-title">{g.title}</p>
                  <ul aria-label={g.title}>
                    {g.items.map((c) => (
                      <li key={c.to}>
                        <Link to={c.to}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ) : (
          item.children?.map((c) => (
            <li key={c.to}>
              <Link to={c.to}>{c.label}</Link>
            </li>
          ))
        )}
      </Submenu>
    </Item>
  );
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cabecera sólida arriba del todo y translúcida al bajar (el estado solo cambia al cruzar el umbral).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape cierra el menú móvil.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Bar $scrolled={scrolled}>
      {/* Indicador de progreso de scroll: pegado al borde inferior del Header
          (que cambia de 84 a 64 px) gracias a position: absolute; bottom: 0.
          Solo aparece en la home; las páginas internas no lo necesitan. */}
      <ScrollProgress />
      <Inner $scrolled={scrolled}>
        <Brand
          to="/"
          $scrolled={scrolled}
          aria-label={`${siteConfig.name} - Inicio`}
          onClick={scrollToTop}
        >
          <img src={logoDark} alt={siteConfig.name} width={brand.logoDark.width} height={brand.logoDark.height} />
        </Brand>
        <Toggle
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </Toggle>
        <Menu id="main-menu" aria-label="Principal" $open={open}>
          <ul className="top">
            {navigation.map((item) =>
              item.children ? (
                <Dropdown key={item.to} item={item} />
              ) : (
                <Item key={item.to}>
                  {/* Para "Inicio" (to === "/") añadimos onClick de scroll-to-top:
                      React Router ignora navegaciones a la misma ruta, asi que el
                      handler fuerza el scroll incluso cuando ya estamos en /. El
                      bloque {behavior: "smooth"} respeta el scroll-behavior CSS.
                      "Aplicar" es el CTA final del menu: pill con gradient
                      purpleLight->purpleDeep, texto blanco y lift en hover. */}
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    data-cta={item.label === "Aplicar" ? "true" : undefined}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={item.to === "/" ? scrollToTop : undefined}
                  >
                    {item.label}
                  </NavLink>
                </Item>
              ),
            )}
          </ul>
        </Menu>
      </Inner>
    </Bar>
  );
};
