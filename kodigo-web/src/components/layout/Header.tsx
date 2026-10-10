import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import logoDark from "@/assets/brand/kodigo-logo-dark.webp";
import brand from "@/assets/brand/brand.json";
import { navigation, type NavItem } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { Container } from "../ui/Container";
import { ChevronDown, Phone } from "../ui/Icons";
import { ScrollProgress } from "../ui/ScrollProgress";

// Header de Kodigo: barra blanca, logo a color, menú en mayúsculas con texto morado
// y botón "Contáctanos" con borde morado. theme.colors.purple (#5B2EA6) sobre blanco cumple contraste AA.
// Como el header "fixed-header" de Eduhall: sólido arriba y, al bajar, translúcido con desenfoque y sombra suave.
// Solo cambian colores y sombra (sin movimiento), así que también se aplica con movimiento reducido.
const Bar = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme, $scrolled }) => ($scrolled ? theme.colors.headerGlass : "transparent")};
  border-bottom: 1px solid
    ${({ theme, $scrolled }) => ($scrolled ? theme.colors.main100 : "transparent")};
  box-shadow: ${({ theme, $scrolled }) => ($scrolled ? theme.shadows.float : "0 0 0 rgba(7, 20, 49, 0)")};
  color: ${({ theme }) => theme.colors.purple};
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(28px) saturate(1.8)" : "none")};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(28px) saturate(1.8)" : "none")};
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

const Cta = styled.a`
  display: none;
  flex: none;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(6)}`};
  border: 2px solid ${({ theme }) => theme.colors.purple};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.purple};
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear, color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white};
  }

  ${media.up("lg")} {
    display: inline-flex;
  }
`;

const Brand = styled(Link)<{ $scrolled: boolean }>`
  display: inline-flex;
  align-items: center;
  flex: none;

  img {
    display: block;
    height: ${({ theme, $scrolled }) =>
      $scrolled ? theme.layout.logoHeightScrolled : theme.layout.logoHeight};
    width: auto;
    transition:
      height ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing};
  }
`;

const Menu = styled.nav<{ $open: boolean }>`
  ${media.up("lg")} {
    flex: 1;
    margin-left: ${({ theme }) => theme.space(4)};
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

  > a,
  > button {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(3.5)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 0.875rem;
    /* Manrope primero; cae al system stack si no esta cargada. Sin negrita por
       defecto para que el menu se sienta ligero: el bold solo se activa en
       hover/expanded (regla review-animations: hover gated por hover/pointer). */
    font-family: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
    font-weight: ${({ theme }) => theme.weights.medium};
    letter-spacing: 0.01em;
    /* Capitalize: solo la primera letra en mayúsculas. Mantiene "FAQ" intacto si viene
       del dato y respeta "Bootcamps", "Nosotros", etc. */
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.purple};
    transition:
      color ${({ theme }) => theme.motion.duration.hover} linear,
      font-weight ${({ theme }) => theme.motion.duration.hover} linear;

    /* Activar bold al pasar el cursor o cuando el dropdown ya esta abierto.
       Solo en dispositivos con hover real (evita bold permanente en tactiles). */
    @media (hover: hover) and (pointer: fine) {
      &:hover,
      &[aria-expanded="true"] {
        font-weight: ${({ theme }) => theme.weights.bold};
      }
    }
  }

  /* Color de hover/expanded sin dispositivo de hover (touch). */
  > a:hover,
  > button[aria-expanded="true"] {
    color: ${({ theme }) => theme.colors.purpleDark};
  }

  > button svg {
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  > button[aria-expanded="true"] svg {
    transform: rotate(180deg);
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
    const onPointerDown = (e: MouseEvent) => {
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
        <Brand to="/" $scrolled={scrolled} aria-label={`${siteConfig.name} - Inicio`}>
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
                  <NavLink to={item.to} end={item.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                    {item.label}
                  </NavLink>
                </Item>
              ),
            )}
          </ul>
        </Menu>
        <Cta href="#contacto">
          <Phone size={18} /> Contáctanos
        </Cta>
      </Inner>
    </Bar>
  );
};
