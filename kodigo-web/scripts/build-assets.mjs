#!/usr/bin/env node
// Optimiza los recursos de marca que entrega Kodigo (carpeta "Recursos kodigo", FUERA del repositorio)
// y los deja listos dentro del proyecto. Reproducible: si llegan logos nuevos, edita content/partners.csv y vuelve a correrlo.
//
// Uso:
//   npm run assets:build                       (usa ../Recursos kodigo)
//   node scripts/build-assets.mjs --src "ruta/a/Recursos kodigo" [--only partners|brand|icons|photos|team|b2b|formaciones]
//
// Genera (se versiona el resultado optimizado, no los originales de 29 MB):
//   src/assets/partners/<slug>.webp + src/data/partners.json   (logos de aliados, recortados y normalizados)
//   src/assets/brand/kodigo-logo-{white,dark}.webp + brand.json (logo para fondo oscuro / claro)
//   src/assets/photos/hero.webp + hero-768.webp                 (foto del banner de Inicio, FOTOS/SCC1; versión móvil)
//   public/favicon-32.png, favicon-48.png, favicon-192.png, apple-touch-icon.png (la "K" a color recortada del logo oscuro)
//   src/assets/icons/*.png                                      (iconos de trazo fino)

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? undefined : args[i + 1]; };
const SRC = resolve(opt("--src") ?? join(ROOT, "..", "Recursos kodigo"));
const ONLY = opt("--only");
const want = (x) => !ONLY || ONLY === x;

if (!existsSync(SRC)) { console.error(`No se encontró la carpeta de recursos: ${SRC}\nUsa --src "ruta".`); process.exit(2); }

// Los nombres de archivo de Windows/Drive traen espacios duros, acentos descompuestos, etc.
const norm = (s) => s.normalize("NFC").replace(/ /g, " ").replace(/\s+/g, " ").trim().toLowerCase();
const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const findFile = (dir, wanted) => {
  const hit = readdirSync(dir).find((f) => norm(f) === norm(wanted));
  if (!hit) throw new Error(`No existe "${wanted}" en ${dir}`);
  return join(dir, hit);
};
const ensure = (d) => mkdirSync(d, { recursive: true });
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

// ---------- CSV mínimo (comillas, BOM, ; o ,) ----------
const parseCsv = (raw) => {
  const text = raw.replace(/^﻿/, "");
  const first = text.split(/\r?\n/, 1)[0];
  const delim = (first.match(/;/g) ?? []).length > (first.match(/,/g) ?? []).length ? ";" : ",";
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') q = false; else field += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(field); field = ""; rows.push(row); row = []; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [h, ...b] = rows.filter((r) => r.some((c) => c.trim()));
  return b.map((r) => Object.fromEntries(h.map((k, i) => [k.trim(), (r[i] ?? "").trim()])));
};

// ---------- Aliados ----------
// Recorta el margen (lienzos 1920x1080 con el logo al centro, o PNG con relleno transparente) y normaliza el tamaño.
const buildPartners = async () => {
  const srcDir = join(SRC, "ALIANZAS ACTIVAS - WEBSITE");
  const outDir = join(ROOT, "src/assets/partners");
  rmSync(outDir, { recursive: true, force: true }); ensure(outDir);
  const rows = parseCsv(readFileSync(join(ROOT, "content/partners.csv"), "utf8"));
  const seen = new Set(); const out = []; let total = 0;
  for (const r of rows) {
    if (!r.file || !r.name) throw new Error(`content/partners.csv: fila incompleta (${JSON.stringify(r)})`);
    if (r.url && !/^https:\/\/\S+$/i.test(r.url)) throw new Error(`content/partners.csv: la URL de "${r.name}" debe empezar con https://`);
    const slug = slugify(r.name);
    if (seen.has(slug)) throw new Error(`content/partners.csv: nombre repetido "${r.name}"`);
    seen.add(slug);
    const file = findFile(srcDir, r.file);
    let original = await sharp(file).toBuffer();
    // notes=contraste: logos de trazo muy claro (p. ej. celeste pálido sobre blanco) no se leen en tarjetas blancas.
    // Se refuerza el color alejándolo del blanco (out = 2.2*in - 306: el blanco se mantiene y el trazo pálido se oscurece).
    if (/contraste/i.test(r.notes ?? "")) original = await sharp(original).linear(2.2, 255 * (1 - 2.2)).png().toBuffer();
    // El recorte se calcula sobre una copia aplanada en blanco y se aplica al original (conserva la transparencia).
    const { info } = await sharp(original).flatten({ background: "#ffffff" }).trim({ threshold: 14 }).toBuffer({ resolveWithObject: true });
    const box = { left: -(info.trimOffsetLeft ?? 0), top: -(info.trimOffsetTop ?? 0), width: info.width, height: info.height };
    const buf = await sharp(original).extract(box).resize({ width: 360, height: 132, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100, effort: 5 }).toBuffer({ resolveWithObject: true });
    writeFileSync(join(outDir, `${slug}.webp`), buf.data);
    total += buf.data.length;
    out.push({ name: r.name, file: `${slug}.webp`, width: buf.info.width, height: buf.info.height, ...(r.url ? { url: r.url } : {}) });
  }
  writeFileSync(join(ROOT, "src/data/partners.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`aliados: ${out.length} logos -> src/assets/partners (${kb(total)} en total) + src/data/partners.json`);
};

// ---------- Marca ----------
const buildBrand = async () => {
  const el = join(SRC, "ELEMENTOS");
  const outDir = join(ROOT, "src/assets/brand"); ensure(outDir);
  // Logo blanco (fondos oscuros: footer) y logo oscuro a color (fondos claros: header). El original oscuro mide
  // 8192 px de ancho; se reduce a 640 (se muestra a ~30 px de alto).
  const white = await sharp(findFile(el, "KODIGO-BL.png")).webp({ quality: 95, alphaQuality: 100, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "kodigo-logo-white.webp"), white.data);
  const dark = await sharp(findFile(el, "KODIGO Logo- Oscuro.png")).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 95, alphaQuality: 100, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "kodigo-logo-dark.webp"), dark.data);
  writeFileSync(join(outDir, "brand.json"), JSON.stringify({
    logoWhite: { width: white.info.width, height: white.info.height },
    logoDark: { width: dark.info.width, height: dark.info.height },
  }, null, 2) + "\n");
  // Favicons con la "K" a color de Kodigo: se recorta del logo oscuro (la marca queda a la izquierda, separada del texto
  // por un hueco amplio; se detecta por columnas con píxeles opacos) y se centra en lienzos cuadrados transparentes.
  const mark = findFile(el, "Recurso 5element 4.png");
  const pub = join(ROOT, "public");
  const kMark = async () => {
    const src = findFile(el, "KODIGO Logo- Oscuro.png");
    const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const filled = (x) => { for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 40) return true; return false; };
    let end = 0, gap = 0;
    for (let x = 0; x < info.width; x++) {
      if (filled(x)) { end = x; gap = 0; } else if (++gap > 300) break;
    }
    const left = await sharp(src).extract({ left: 0, top: 0, width: end + 1, height: info.height }).png().toBuffer();
    return sharp(left).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 }).png().toBuffer();
  };
  const k = await kMark();
  const square = (size, pad, bg) => {
    let img = sharp(k).resize(size - 2 * pad, size - 2 * pad, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } });
    if (bg) img = img.flatten({ background: bg });
    return img.png({ compressionLevel: 9 });
  };
  await square(32, 1).toFile(join(pub, "favicon-32.png"));
  await square(48, 2).toFile(join(pub, "favicon-48.png"));
  await square(192, 24).toFile(join(pub, "favicon-192.png"));
  await square(180, 28, "#ffffff").toFile(join(pub, "apple-touch-icon.png"));
  // Isotipo en blanco (marca de agua de las tarjetas de bootcamps): un lienzo blanco al que se le aplica la forma del isotipo.
  const markPng = await sharp(mark).resize({ height: 240 }).png().toBuffer();
  const mm = await sharp(markPng).metadata();
  const markWhite = await sharp({ create: { width: mm.width, height: mm.height, channels: 4, background: "#ffffff" } })
    .composite([{ input: markPng, blend: "dest-in" }]).webp({ quality: 90, alphaQuality: 100, effort: 5 }).toBuffer();
  writeFileSync(join(outDir, "isotype-white.webp"), markWhite);
  console.log(`marca: logo blanco ${white.info.width}x${white.info.height} (${kb(white.data.length)}), logo oscuro ${dark.info.width}x${dark.info.height} (${kb(dark.data.length)}), favicon-32/48/192 y apple-touch-icon con la K a color`);
};

// ---------- Iconos ----------
const buildIcons = async () => {
  const srcDir = join(SRC, "ELEMENTOS", "icons");
  const outDir = join(ROOT, "src/assets/icons"); rmSync(outDir, { recursive: true, force: true }); ensure(outDir);
  const names = { "icon contenido.png": "contenido", "icon horarios.png": "horarios", "icon modalidad.png": "modalidad", "icon ritmo.png": "ritmo", "bulb icon.png": "bulb", "path icon.png": "path", "target icon.png": "target" };
  let n = 0;
  for (const [file, slug] of Object.entries(names)) {
    await sharp(findFile(srcDir, file)).png({ compressionLevel: 9 }).toFile(join(outDir, `${slug}.png`)); n++;
  }
  console.log(`iconos: ${n} -> src/assets/icons (originales de 46x46 px; ideal pedir SVG)`);
};

// ---------- Fotos ----------
// Banner de Inicio (FOTOS/SCC1/O1.png), capacitación (SCC6) y las del bloque de experiencia (SCC6 y SCC4). Permisos y licencias pendientes (ver docs/SOLICITUD_DE_INSUMOS.md).
const buildPhotos = async () => {
  const outDir = join(ROOT, "src/assets/photos"); ensure(outDir);
  const hero = await sharp(findFile(join(SRC, "FOTOS", "SCC1"), "O1.png")).webp({ quality: 82, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "hero.webp"), hero.data);
  // Versión para móvil (pantallas <= 768 px): ~3x más liviana; con la capa oscura encima no se nota la diferencia.
  const heroSmall = await sharp(findFile(join(SRC, "FOTOS", "SCC1"), "O1.png")).resize({ width: 768 }).webp({ quality: 70, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "hero-768.webp"), heroSmall.data);
  // Foto de capacitación para el bloque de adaptación a la empresa (FOTOS/SCC6/IMG_7197.jpeg): recorte vertical 9:10.
  const training = await sharp(findFile(join(SRC, "FOTOS", "SCC6"), "IMG_7197.jpeg")).rotate().resize({ width: 900, height: 1000, fit: "cover", position: "right" }).webp({ quality: 74, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "training.webp"), training.data);
  // Fotos horizontales del bloque "La experiencia Kodigo": la capacitación completa (SCC6) y la automatización (SCC4, render de stock: confirmar licencia).
  const expClass = await sharp(findFile(join(SRC, "FOTOS", "SCC6"), "IMG_7197.jpeg")).rotate().resize({ width: 1200 }).webp({ quality: 72, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "experience-class.webp"), expClass.data);
  const expAuto = await sharp(findFile(join(SRC, "FOTOS", "SCC4"), "automated-delivery-robots-carrying-boxes-in-modern-2026-01-07-05-51-08-utc.jpg")).rotate().resize({ width: 1200 }).webp({ quality: 72, effort: 5 }).toBuffer({ resolveWithObject: true });
  writeFileSync(join(outDir, "experience-automation.webp"), expAuto.data);
  console.log(`fotos: experience-class ${expClass.info.width}x${expClass.info.height} (${kb(expClass.data.length)}), experience-automation ${expAuto.info.width}x${expAuto.info.height} (${kb(expAuto.data.length)})`);
  console.log(`fotos: training ${training.info.width}x${training.info.height} (${kb(training.data.length)})`);
  console.log(`fotos: hero ${hero.info.width}x${hero.info.height} (${kb(hero.data.length)}), hero-768 ${heroSmall.info.width}x${heroSmall.info.height} (${kb(heroSmall.data.length)})`);
};

// ---------- Equipo ----------
// Retratos de FOTOS/SCC7 (entregados por Kodigo para la página Alianzas), recortados en 4:5 y optimizados.
const buildTeam = async () => {
  const srcDir = join(SRC, "FOTOS", "SCC7");
  const outDir = join(ROOT, "src/assets/team"); ensure(outDir);
  const people = { "OSCAR.jpeg": "oscar-guzman", "MOISES.png": "moises-vega", "ADRI.png": "adriana-henriquez", "EVEL.png": "evel-castro" };
  let total = 0;
  for (const [file, slug] of Object.entries(people)) {
    const buf = await sharp(findFile(srcDir, file)).rotate().resize({ width: 480, height: 600, fit: "cover", position: "attention" }).webp({ quality: 78, effort: 5 }).toBuffer();
    writeFileSync(join(outDir, `${slug}.webp`), buf); total += buf.length;
  }
  console.log(`equipo: ${Object.keys(people).length} retratos -> src/assets/team (${kb(total)} en total)`);
};

// ---------- Landing B2B (página Alianzas) ----------
// Carpeta "recursos-landing-b2b" (dentro de Recursos kodigo): fondos ya tratados en morado (PNG enormes de 3840 px) -> WebP
// optimizados, íconos SVG de línea teal (sin la metadata C2PA que traen embebida) y la fuente Matimo (woff2 tal cual).
const buildB2b = async () => {
  const srcDir = join(SRC, "recursos-landing-b2b");
  const outDir = join(ROOT, "src/assets/b2b"); rmSync(outDir, { recursive: true, force: true }); ensure(outDir);
  const webp = async (rel, out, width, quality, height) => {
    const buf = await sharp(join(srcDir, rel)).resize({ width, height, fit: height ? "cover" : "inside", withoutEnlargement: true })
      .webp({ quality, effort: 5 }).toBuffer();
    writeFileSync(join(outDir, out), buf);
    return buf.length;
  };
  const jobs = [
    ["01-hero/tratadas/hero-slide-1-tratada-desktop-3840x2160.png", "hero-1.webp", 2560, 74],
    ["01-hero/tratadas/hero-slide-1-tratada-movil-2160x3840.png", "hero-1-m.webp", 1080, 72],
    ["01-hero/tratadas/hero-slide-2-tratada-desktop-3840x2160.png", "hero-2.webp", 2560, 74],
    ["01-hero/tratadas/hero-slide-2-tratada-movil-2160x3840.png", "hero-2-m.webp", 1080, 72],
    ["02-workshop/tratadas/workshop-fondo-tratada-3840x2160.png", "workshop-bg.webp", 2560, 68],
    ["02-workshop/tratadas/workshop-ticket-cabecera-tratada-1840x800.png", "ticket-cabecera.webp", 1200, 80],
    ["04-casos-de-exito/tratadas/casos-fondo-tratada-3840x2160.png", "casos-bg.webp", 2560, 68],
    ["05-adaptacion/tratadas/adaptacion-fondo-tratada-3840x2160.png", "adaptacion-bg.webp", 2560, 68],
    ["05-adaptacion/tratadas/lista-01-horarios-a-la-medida-tratada-800x800.png", "lista-01.webp", 400, 78],
    ["05-adaptacion/tratadas/lista-02-ritmo-adaptable-tratada-800x800.png", "lista-02.webp", 400, 78],
    ["05-adaptacion/tratadas/lista-03-modalidad-flexible-tratada-800x800.png", "lista-03.webp", 400, 78],
    ["05-adaptacion/tratadas/lista-04-contenido-aplicado-tratada-800x800.png", "lista-04.webp", 400, 78],
    ["07-aliados/tratadas/aliados-fondo-tratada-3840x2160.png", "aliados-bg.webp", 2560, 68],
  ];
  let total = 0;
  for (const [rel, out, w, q] of jobs) total += await webp(rel, out, w, q);
  // Íconos: solo los que usa la página.
  const iconDir = join(srcDir, "08-iconos", "svg-linea-teal"); const iconOut = join(outDir, "icons"); ensure(iconOut);
  const icons = readdirSync(iconDir).filter((f) => f.endsWith(".svg"));
  for (const f of icons) {
    const svg = readFileSync(join(iconDir, f), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/g, "").replace(/\s+xmlns:c2pa="[^"]*"/g, "").replace(/\s+width="512"\s+height="512"/, "");
    writeFileSync(join(iconOut, f), svg);
  }
  const linkedin = readFileSync(join(srcDir, "08-iconos", "svg-linkedin.svg"), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/g, "").replace(/\s+xmlns:c2pa="[^"]*"/g, "");
  writeFileSync(join(iconOut, "linkedin.svg"), linkedin);
  // Fuente Matimo (5 pesos woff2, autoalojada).
  const fontOut = join(ROOT, "src/assets/fonts/matimo"); rmSync(fontOut, { recursive: true, force: true }); ensure(fontOut);
  const fontSrc = join(srcDir, "00-marca", "fuente-matimo");
  for (const f of readdirSync(fontSrc).filter((x) => x.endsWith(".woff2"))) writeFileSync(join(fontOut, f), readFileSync(join(fontSrc, f)));
  console.log(`b2b: ${jobs.length} imágenes (${kb(total)}), ${icons.length + 1} íconos SVG, fuente Matimo -> src/assets/b2b y src/assets/fonts/matimo`);
};

// ---------- Formaciones ----------
// Fondos de las tarjetas de bootcamps (carpeta FORMACIONES, 1200x560, ya tratados en morado). El nombre del archivo lleva
// el orden y el slug del bootcamp ("03-gen-ai-to-agents.png"); se guardan como src/assets/formaciones/<slug>.webp.
const buildFormaciones = async () => {
  const srcDir = join(SRC, "FORMACIONES");
  const outDir = join(ROOT, "src/assets/formaciones"); rmSync(outDir, { recursive: true, force: true }); ensure(outDir);
  let total = 0, n = 0;
  for (const f of readdirSync(srcDir).filter((x) => /^\d+-.+\.png$/i.test(x))) {
    const slug = f.replace(/^\d+-/, "").replace(/\.png$/i, "");
    const buf = await sharp(join(srcDir, f)).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
    writeFileSync(join(outDir, `${slug}.webp`), buf); total += buf.length; n++;
  }
  console.log(`formaciones: ${n} fondos -> src/assets/formaciones (${kb(total)} en total)`);
};

try {
  if (want("formaciones")) await buildFormaciones();
  if (want("b2b")) await buildB2b();
  if (want("partners")) await buildPartners();
  if (want("photos")) await buildPhotos();
  if (want("team")) await buildTeam();
  if (want("brand")) await buildBrand();
  if (want("icons")) await buildIcons();
} catch (e) { console.error(`ERROR: ${e.message}`); process.exit(1); }
