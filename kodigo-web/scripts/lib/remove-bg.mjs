// Quita el fondo liso de un logo (blanco u otro color uniforme) para que se vea sobre cualquier tarjeta.
// Solo actúa si el borde de la imagen es opaco y de un color uniforme: se parte de los bordes y se borran los píxeles
// conectados con ese color (los blancos interiores del logo no se tocan) y se suaviza el contorno. Si el borde ya es
// transparente o no es uniforme, devuelve la imagen igual.
import sharp from "sharp";

const TOLERANCE = 30; // diferencia máxima por canal para considerar "fondo"
const FEATHER = 110; // por encima de esta distancia al fondo, el píxel de contorno queda opaco

export const removeBackground = async (input) => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => (y * w + x) * 4;

  const border = [];
  for (let x = 0; x < w; x++) border.push(at(x, 0), at(x, h - 1));
  for (let y = 1; y < h - 1; y++) border.push(at(0, y), at(w - 1, y));
  if (border.some((i) => data[i + 3] < 250)) return { buffer: await sharp(input).png().toBuffer(), removed: false };

  const median = (c) => { const v = border.map((i) => data[i + c]).sort((a, b) => a - b); return v[v.length >> 1]; };
  const bg = [median(0), median(1), median(2)];
  const dist = (i) => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
  const uniform = border.filter((i) => dist(i) <= TOLERANCE).length / border.length;
  if (uniform < 0.85) return { buffer: await sharp(input).png().toBuffer(), removed: false };

  const flooded = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const p = y * w + x;
    if (!flooded[p] && dist(p * 4) <= TOLERANCE) { flooded[p] = 1; stack.push(p); }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop(), x = p % w, y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  const out = Buffer.from(data);
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (flooded[p]) { out[i + 3] = 0; continue; }
    const x = p % w, y = (p / w) | 0;
    const nearBg = (x > 0 && flooded[p - 1]) || (x < w - 1 && flooded[p + 1]) || (y > 0 && flooded[p - w]) || (y < h - 1 && flooded[p + w]);
    if (nearBg) out[i + 3] = Math.round(255 * Math.min(1, dist(i) / FEATHER));
  }
  const buffer = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  return { buffer, removed: true };
};
