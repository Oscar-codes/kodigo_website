#!/usr/bin/env node
// Genera versiones MONOCROMAS BLANCAS de los logos de aliados (src/assets/partners-white/<slug>.webp) para usarlas sobre
// fondos azules (sección "Clientes" del Inicio). Si el logo tiene transparencia se conserva su silueta; si trae fondo blanco
// opaco, la opacidad sale de la "tinta" (1 - luminosidad), de modo que el fondo desaparece y el trazo queda blanco.
//
// Uso: node scripts/build-white-logos.mjs
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(ROOT, "src/assets/partners");
const out = join(ROOT, "src/assets/partners-white");
mkdirSync(out, { recursive: true });

for (const file of readdirSync(src).filter((f) => f.endsWith(".webp"))) {
  const { data, info } = await sharp(join(src, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 20) transparent++;
  const hasAlpha = transparent / (info.width * info.height) > 0.05;
  const rgba = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    // Tinta: con alfa real se usa la silueta; sin alfa, cuánto se aleja el píxel del blanco (con un pequeño realce).
    const ink = hasAlpha ? data[i + 3] / 255 : Math.min(1, Math.max(0, (1 - lum) * 1.25));
    rgba[i] = rgba[i + 1] = rgba[i + 2] = 255;
    rgba[i + 3] = Math.round(ink * 255);
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(join(out, file));
}
console.log(`logos blancos -> ${out}`);
