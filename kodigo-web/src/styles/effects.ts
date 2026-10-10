import { keyframes } from "styled-components";

// Efectos de animación de Eduhall (main.css y animate.css), con los mismos valores. Solo usan transform y opacity.
// Todos se aplican dentro de `@media (prefers-reduced-motion: no-preference)` y además el reset global los anula con
// movimiento reducido. Los desplazamientos de los "bounceIn*" se acortan (60 px en vez de 3000 px) para no ampliar
// el alto de la página mientras el elemento aún no ha entrado.

/** Giro del icono al pasar el cursor por la tarjeta (`animate__flipInY` de Eduhall). */
export const flipInY = keyframes`
  0% { opacity: 0; transform: perspective(400px) rotateY(90deg); }
  40% { transform: perspective(400px) rotateY(-20deg); }
  60% { opacity: 1; transform: perspective(400px) rotateY(10deg); }
  80% { transform: perspective(400px) rotateY(-5deg); }
  100% { opacity: 1; transform: perspective(400px); }
`;

/** Formas decorativas flotantes (`upDown`, `scalation` y `roatation` de Eduhall). */
export const upDown = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

export const scalation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.5); }
  100% { transform: scale(1); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/** Entradas de los títulos de sección (`wow bounceInDown / bounceIn / bounceInUp`). */
export const bounceInDown = keyframes`
  0% { opacity: 0; transform: translate3d(0, -60px, 0); }
  60% { opacity: 1; transform: translate3d(0, 12px, 0); }
  75% { transform: translate3d(0, -5px, 0); }
  90% { transform: translate3d(0, 2px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
`;

export const bounceIn = keyframes`
  0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
  20% { transform: scale3d(1.08, 1.08, 1.08); }
  40% { transform: scale3d(0.92, 0.92, 0.92); }
  60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
  80% { transform: scale3d(0.98, 0.98, 0.98); }
  100% { opacity: 1; transform: scale3d(1, 1, 1); }
`;

export const bounceInUp = keyframes`
  0% { opacity: 0; transform: translate3d(0, 60px, 0); }
  60% { opacity: 1; transform: translate3d(0, -12px, 0); }
  75% { transform: translate3d(0, 5px, 0); }
  90% { transform: translate3d(0, -2px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
`;

/** Balanceo del icono al pasar el cursor por la tarjeta (`animate__wobble` de Eduhall). */
export const wobble = keyframes`
  0% { transform: none; }
  15% { transform: translate3d(-25%, 0, 0) rotate(-5deg); }
  30% { transform: translate3d(20%, 0, 0) rotate(3deg); }
  45% { transform: translate3d(-15%, 0, 0) rotate(-3deg); }
  60% { transform: translate3d(10%, 0, 0) rotate(2deg); }
  75% { transform: translate3d(-5%, 0, 0) rotate(-1deg); }
  100% { transform: none; }
`;
