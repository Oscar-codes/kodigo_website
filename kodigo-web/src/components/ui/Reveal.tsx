import styled from "styled-components";
import { useInView } from "@/hooks/useInView";

// Equivalentes de AOS en Eduhall: fade-up, fade-down, fade-left, fade-right y zoom-in.
type Direction = "up" | "down" | "left" | "right" | "zoom";
type Tag = "div" | "li" | "section" | "article";

const hiddenTransform: Record<Direction, string> = {
  up: "translateY(var(--reveal-distance))",
  down: "translateY(calc(var(--reveal-distance) * -1))",
  // fade-left llega desde la derecha y fade-right desde la izquierda (como AOS). Recorrido corto: no ampliar el ancho.
  left: "translateX(32px)",
  right: "translateX(-32px)",
  zoom: "scale(0.96)",
};

const Wrapper = styled.div<{ $visible: boolean; $direction: Direction; $index: number }>`
  --reveal-distance: ${({ theme }) => theme.motion.distance};

  /* El estado oculto SOLO existe con movimiento permitido: con movimiento
     reducido el contenido se ve siempre, nunca queda atrapado invisible. */
  @media (prefers-reduced-motion: no-preference) {
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: ${({ $visible, $direction }) => ($visible ? "none" : hiddenTransform[$direction])};
    transition:
      opacity ${({ theme }) => theme.motion.duration.reveal} ${({ theme }) => theme.motion.easing}
        ${({ $index, theme }) => $index * theme.motion.stagger}ms,
      transform ${({ theme }) => theme.motion.duration.reveal} ${({ theme }) => theme.motion.easing}
        ${({ $index, theme }) => $index * theme.motion.stagger}ms;
  }
`;

interface RevealProps {
  /** Elemento HTML a renderizar (p. ej. "li" dentro de una lista). */
  tag?: Tag;
  direction?: Direction;
  /** Posición entre hermanos; escalona la entrada (index * theme.motion.stagger). */
  index?: number;
  className?: string;
  children: React.ReactNode;
}

/** Entrada suave al hacer scroll. Solo anima opacity y transform (sin saltos de layout). */
export const Reveal = ({ tag = "div", direction = "up", index = 0, className, children }: RevealProps) => {
  const [ref, visible] = useInView<HTMLElement>();
  return (
    <Wrapper
      as={tag}
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      $visible={visible}
      $direction={direction}
      $index={index}
    >
      {children}
    </Wrapper>
  );
};
