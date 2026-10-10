import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

// "Indicador de progreso de scroll" del Hero: una línea fina de gradiente
// (cian → azul → magenta → violeta) pegada al borde inferior de la barra de
// navegación. Rellena de izquierda a derecha según la posición real del scroll
// (0 al inicio del documento, 1 al final). Solo decorativo: aria-hidden.

const BAR_HEIGHT = "1px";

// Etiquetas CSS custom: dejamos que el navegador interpole el progreso via
// transform: scaleX() en lugar de width, así animamos solo GPU (regla #7 del
// review-animations skill). Transform-origin a la izquierda para que rellene
// en la dirección esperada por el usuario.
const Bar = styled.div.attrs({ "aria-hidden": true })`
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: ${BAR_HEIGHT};
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      #06b6d4 0%,
      #3b82f6 33%,
      #e91e63 66%,
      #8b5cf6 100%
    );
  transform: scaleX(var(--scroll-progress, 0));
  transform-origin: left center;
  will-change: transform;
  /* Sin transitions: el progreso se actualiza por cada frame de scroll, el
     scrubbng de 60-80 ms no aporta y mete latencia. */
`;

/**
 * Hook de cálculo: lee el scroll real y actualiza un CSS variable en el ref
 * con un único requestAnimationFrame por frame (no state React, no reflows).
 * Cero a inicio del documento, 1 al final (sin desbordes >1 ni <0).
 */
const useScrollProgress = (target: HTMLElement | null) => {
  useEffect(() => {
    if (!target || typeof window === "undefined") return;
    let frame = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const next = Math.min(1, Math.max(0, window.scrollY / max));
      target.style.setProperty("--scroll-progress", String(next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update(); // estado inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
};

interface Props {
  /** Si true, sólo se muestra en la home (porque las otras páginas no requieren
   *  el indicador de progreso y seria ruido). Por defecto, true. */
  onlyHome?: boolean;
}

/**
 * Indicador de progreso de scroll. Pensado para vivir dentro del Header
 * (position: absolute, bottom 0) para que se mantenga pegado al borde
 * inferior de la barra al cambiar de 84 -> 64 px.
 */
export const ScrollProgress = ({ onlyHome = true }: Props) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  useScrollProgress(barRef.current);

  if (onlyHome) {
    const path = pathname.replace(/\/$/, "") || "/";
    const home = path === "/" || path === "/inicio" || path === "/home";
    if (!home) return null;
  }

  return <Bar ref={barRef} />;
};
