import { useMemo } from "react";

// Mapa mundial decorativo formado por puntos (estilo "Techno / Eduall" footer).
// Se renderiza como SVG y se usa de fondo del Footer. Las siluetas de los continentes
// son aproximaciones simplificadas (no cartograficamente exactas) hechas a partir de
// polígonos en un viewBox 1000x500. Para cada continente se genera una rejilla regular
// de puntos y se conservan solo los que caen dentro del polígono (point-in-polygon),
// produciendo el efecto punteado caracteristico del fondo.

// Polígonos detallados de los continentes en el viewBox 1000x500.
// Los vertices siguen la silueta real de cada masa continental en sentido horario para
// que el test point-in-polygon los recorra correctamente. Las formas son aproximaciones
// estilizadas (no cartograficamente exactas) pero reconocibles.
const CONTINENTS: [number, number][][] = [
  // Groenlandia
  [
    [330, 45], [360, 40], [390, 50], [400, 75], [395, 100], [380, 120],
    [355, 125], [335, 115], [325, 95], [320, 70],
  ],
  // Norteamérica (Alaska + Canadá + EE.UU. + México + Centroamérica)
  [
    [55, 105], [70, 85], [95, 75], [125, 78], [150, 70], [175, 60], [205, 58],
    [235, 62], [265, 70], [290, 85], [308, 105], [318, 130], [320, 155],
    [315, 175], [305, 188], [290, 200], [295, 215], [285, 230], [265, 240],
    [245, 248], [235, 262], [240, 278], [250, 290], [258, 300], [265, 312],
    [258, 320], [248, 318], [240, 305], [228, 295], [215, 282], [200, 268],
    [185, 252], [170, 235], [155, 218], [140, 200], [125, 182], [110, 165],
    [95, 148], [82, 130], [72, 115],
  ],
  // Sudamérica
  [
    [260, 305], [280, 298], [300, 295], [320, 300], [335, 318], [348, 345],
    [355, 375], [352, 405], [340, 432], [320, 452], [298, 462], [280, 458],
    [268, 442], [258, 418], [252, 392], [248, 365], [248, 340], [252, 320],
  ],
  // Europa
  [
    [438, 78], [465, 70], [495, 65], [528, 68], [558, 75], [582, 88],
    [595, 108], [598, 132], [588, 152], [570, 168], [545, 175], [518, 178],
    [492, 175], [468, 170], [448, 158], [432, 140], [425, 118], [428, 95],
  ],
  // África
  [
    [442, 182], [470, 178], [502, 176], [535, 178], [568, 184], [592, 198],
    [608, 218], [618, 242], [622, 268], [620, 295], [612, 322], [598, 350],
    [578, 375], [552, 395], [522, 408], [492, 412], [468, 405], [452, 388],
    [442, 365], [438, 338], [436, 308], [436, 278], [438, 248], [440, 218],
  ],
  // Oriente Medio / Arabia (puente África-Asia)
  [
    [575, 178], [605, 172], [632, 175], [652, 185], [660, 202], [655, 222],
    [638, 232], [612, 235], [588, 228], [572, 215], [568, 198],
  ],
  // Asia (la gran masa continental)
  [
    [582, 72], [620, 62], [660, 55], [702, 52], [745, 55], [788, 62],
    [828, 72], [862, 85], [890, 102], [912, 122], [928, 145], [932, 170],
    [925, 192], [908, 208], [882, 220], [852, 228], [818, 232], [782, 232],
    [748, 228], [718, 222], [692, 215], [670, 208], [648, 200], [625, 192],
    [605, 180], [590, 162], [580, 140], [575, 115], [578, 92],
  ],
  // India
  [
    [688, 215], [712, 218], [732, 232], [742, 255], [742, 278], [732, 295],
    [715, 300], [698, 292], [688, 275], [682, 255], [680, 235],
  ],
  // Indochina
  [
    [758, 232], [778, 235], [790, 252], [788, 275], [778, 288], [762, 285],
    [752, 268], [752, 250],
  ],
  // Indonesia (Java/Sumatra/Borneo como un archipielago simplificado)
  [
    [772, 300], [802, 295], [832, 298], [862, 302], [882, 312], [875, 322],
    [845, 325], [815, 322], [788, 318], [772, 312],
  ],
  // Japón
  [
    [892, 152], [908, 148], [920, 162], [918, 182], [908, 198], [892, 200],
    [882, 188], [880, 170],
  ],
  // Filipinas
  [
    [852, 262], [862, 258], [868, 272], [865, 288], [855, 290], [848, 278],
  ],
  // Australia
  [
    [788, 338], [822, 328], [858, 325], [890, 330], [912, 342], [918, 360],
    [912, 378], [895, 392], [868, 400], [835, 402], [805, 398], [785, 385],
    [778, 368],
  ],
  // Nueva Zelanda
  [
    [928, 378], [938, 375], [942, 392], [935, 408], [925, 405], [922, 390],
  ],
  // Antártida (franja continua al pie)
  [
    [0, 472], [55, 468], [120, 465], [190, 462], [260, 460], [330, 460],
    [400, 462], [470, 465], [540, 467], [610, 468], [680, 470], [750, 472],
    [820, 473], [890, 474], [960, 475], [1000, 476], [1000, 500], [0, 500],
  ],
];

// Test de punto en polígono (ray casting). Polígonos simples convexos/cóncavos.
const pointInPolygon = (x: number, y: number, poly: [number, number][]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

interface WorldMapDotsProps {
  /** Separación entre puntos en unidades del viewBox. Menor = más denso. */
  spacing?: number;
  /** Radio de cada punto en unidades del viewBox. */
  radius?: number;
  /** Color de los puntos. */
  color?: string;
  /** Opacidad global de la capa. */
  opacity?: number;
  /** viewBox del SVG (ancho x alto). */
  viewBox?: string;
  className?: string;
  ariaLabel?: string;
  /** Comportamiento de escalado del SVG dentro de su contenedor. */
  preserveAspectRatio?: string;
}

export const WorldMapDots = ({
  spacing = 10,
  radius = 1.4,
  color = "#ffffff",
  opacity = 0.18,
  viewBox = "0 0 1000 500",
  className,
  ariaLabel = "Mapa mundial decorativo",
  preserveAspectRatio = "xMidYMid meet",
}: WorldMapDotsProps) => {
  // Genera los puntos una sola vez por combinación de parámetros.
  const dots = useMemo(() => {
    const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
    const out: { cx: number; cy: number }[] = [];
    for (let x = vx + spacing / 2; x < vx + vw; x += spacing) {
      for (let y = vy + spacing / 2; y < vy + vh; y += spacing) {
        if (CONTINENTS.some((poly) => pointInPolygon(x, y, poly))) {
          out.push({ cx: x, cy: y });
        }
      }
    }
    return out;
  }, [spacing, viewBox]);

  return (
    <svg
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio={preserveAspectRatio}
    >
      <g fill={color} opacity={opacity}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={radius} />
        ))}
      </g>
    </svg>
  );
};
