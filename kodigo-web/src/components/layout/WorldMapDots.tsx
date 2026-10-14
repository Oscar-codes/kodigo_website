import { useMemo } from "react";

// Mapa mundial decorativo formado por puntos (estilo "Techno / Eduall" footer).
// Se renderiza como SVG y se usa de fondo del Footer. Las siluetas de los continentes
// son aproximaciones simplificadas (no cartograficamente exactas) hechas a partir de
// polígonos en un viewBox 1000x500. Para cada continente se genera una rejilla regular
// de puntos y se conservan solo los que caen dentro del polígono (point-in-polygon),
// produciendo el efecto punteado caracteristico del fondo.

// Polígonos simplificados de los continentes (orden de vertices en sentido horario).
// Coordenadas en el viewBox 0..1000 (ancho) x 0..500 (alto).
const CONTINENTS: [number, number][][] = [
  // Norteamérica
  [
    [80, 80], [180, 60], [260, 70], [300, 100], [310, 150], [300, 200], [270, 240],
    [220, 260], [170, 270], [130, 250], [100, 210], [80, 160], [70, 110],
  ],
  // Centroamérica + Caribe (puente hacia Sudamérica)
  [
    [210, 250], [270, 250], [290, 280], [270, 300], [230, 300], [200, 280],
  ],
  // Sudamérica
  [
    [230, 290], [310, 285], [340, 320], [350, 380], [320, 430], [280, 450],
    [240, 440], [220, 400], [215, 350],
  ],
  // Europa
  [
    [440, 70], [540, 65], [580, 90], [580, 130], [550, 170], [500, 180],
    [460, 170], [435, 140], [430, 100],
  ],
  // África
  [
    [450, 180], [570, 175], [610, 220], [615, 290], [590, 360], [540, 410],
    [490, 415], [460, 380], [445, 320], [440, 250],
  ],
  // Oriente Medio / Asia occidental (puente)
  [
    [570, 160], [650, 155], [680, 180], [660, 210], [600, 210], [570, 195],
  ],
  // Asia
  [
    [620, 70], [760, 60], [850, 70], [900, 110], [910, 160], [880, 210],
    [820, 240], [760, 250], [700, 230], [650, 200], [620, 160], [605, 110],
  ],
  // India
  [
    [680, 210], [730, 210], [740, 270], [710, 290], [680, 270],
  ],
  // Sureste asiático / Indonesia
  [
    [780, 260], [870, 255], [890, 285], [860, 305], [800, 300], [775, 280],
  ],
  // Australia
  [
    [790, 330], [900, 325], [915, 360], [890, 390], [830, 395], [790, 375],
  ],
  // Japón
  [
    [880, 165], [905, 160], [915, 185], [895, 200], [875, 190],
  ],
  // Antártida (franja fina al pie)
  [
    [0, 470], [1000, 470], [1000, 500], [0, 500],
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
