#!/usr/bin/env node
// Convierte content/bootcamps.csv en src/data/bootcamps.json (fuente de datos del sitio).
//
// Uso:
//   node scripts/import-bootcamps.mjs [archivo.csv] [--check] [--allow-removal] [--out ruta.json]
//
//   --check          solo valida, no escribe nada
//   --allow-removal  permite que desaparezca un slug existente (cambia su URL pública)
//   --out            archivo de salida (por defecto src/data/bootcamps.json)
//
// Sin dependencias. Acepta CSV de Excel (BOM UTF-8, CRLF y separador "," o ";").

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AREAS = ["IA", "Datos", "Desarrollo", "Programación", "Educación"]; // "Desarrollo" se publica como "Programación"
const COLUMNS = ["slug", "name", "area", "summary", "duration", "modality", "level", "requirements", "syllabus", "enrollmentUrl"];

// ---------- CSV ----------
export const parseCsv = (raw) => {
  const text = raw.replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0];
  const delimiter = (firstLine.match(/;/g) ?? []).length > (firstLine.match(/,/g) ?? []).length ? ";" : ",";
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delimiter) { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      rows.push(row); row = [];
    } else field += c;
  }
  if (quoted) throw new Error("Una celda entre comillas no se cierra. Revisa las comillas (\") del archivo.");
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
};

// ---------- Campos compuestos ----------
// requisitos: "Requisito 1; Requisito 2"
const parseList = (s) => s.split(";").map((x) => x.trim()).filter(Boolean);

// temario: "Módulo 1: tema a; tema b | Módulo 2: tema c | Módulo 3 (sin temas)"
const parseSyllabus = (s, where, errors) => {
  const modules = [];
  for (const part of s.split("|").map((x) => x.trim()).filter(Boolean)) {
    const i = part.indexOf(":");
    const title = (i === -1 ? part : part.slice(0, i)).trim();
    const topics = i === -1 ? [] : parseList(part.slice(i + 1));
    if (!title) { errors.push(`${where}: un módulo del temario no tiene título ("${part}")`); continue; }
    modules.push(topics.length ? { title, topics } : { title });
  }
  return modules;
};

const duplicates = (arr) => arr.filter((x, i) => arr.indexOf(x) !== i);

// ---------- Validación y conversión ----------
export const convert = (rows, { existingSlugs = [], allowRemoval = false } = {}) => {
  const errors = [];
  const [header, ...body] = rows;
  const cols = (header ?? []).map((h) => h.trim());
  const missing = COLUMNS.filter((c) => !cols.includes(c));
  const extra = cols.filter((c) => !COLUMNS.includes(c));
  if (missing.length) errors.push(`Faltan columnas: ${missing.join(", ")}.`);
  if (extra.length) errors.push(`Columnas desconocidas: ${extra.join(", ")}.`);
  if (errors.length) return { errors, data: [] };

  const seen = new Set();
  const data = body.map((cells, idx) => {
    const line = idx + 2; // fila en la hoja (la 1 es el encabezado)
    const get = (c) => (cells[cols.indexOf(c)] ?? "").trim();
    const where = `Fila ${line}`;
    const slug = get("slug"), name = get("name"), area = get("area"), summary = get("summary");

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push(`${where}: slug inválido "${slug}" (solo minúsculas, números y guiones; ej. sql-ai).`);
    if (seen.has(slug)) errors.push(`${where}: el slug "${slug}" está repetido.`);
    seen.add(slug);
    if (!name) errors.push(`${where}: falta el nombre.`);
    if (!AREAS.includes(area)) errors.push(`${where}: área "${area}" no válida. Opciones: ${AREAS.join(", ")}.`);
    if (!summary) errors.push(`${where}: falta la descripción corta (summary).`);

    // La plantilla dice "Desarrollo"; el sitio (filtros, estilos de tarjeta) usa el área "Programación".
    const out = { slug, name, area: area === "Desarrollo" ? "Programación" : area, summary };
    for (const f of ["duration", "modality", "level"]) if (get(f)) out[f] = get(f);

    const requirements = parseList(get("requirements"));
    if (requirements.length) {
      const d = duplicates(requirements);
      if (d.length) errors.push(`${where}: requisitos repetidos: ${[...new Set(d)].join(", ")}.`);
      out.requirements = requirements;
    }
    const syllabus = parseSyllabus(get("syllabus"), where, errors);
    if (syllabus.length) {
      const dm = duplicates(syllabus.map((m) => m.title));
      if (dm.length) errors.push(`${where}: módulos repetidos: ${[...new Set(dm)].join(", ")}.`);
      for (const m of syllabus) {
        const dt = duplicates(m.topics ?? []);
        if (dt.length) errors.push(`${where}: temas repetidos en "${m.title}": ${[...new Set(dt)].join(", ")}.`);
      }
      out.syllabus = syllabus;
    }
    const url = get("enrollmentUrl");
    if (url) {
      if (!/^https:\/\/[^\s]+$/i.test(url)) errors.push(`${where}: enrollmentUrl debe ser una URL https:// completa.`);
      out.enrollmentUrl = url;
    }
    return out;
  });

  if (!data.length) errors.push("El archivo no tiene filas de bootcamps.");
  const removed = existingSlugs.filter((s) => !seen.has(s));
  if (removed.length && !allowRemoval)
    errors.push(`Se eliminarían slugs que ya existen (cambiarían las URLs públicas): ${removed.join(", ")}. Si es intencional, usa --allow-removal.`);
  return { errors, data };
};

// ---------- CLI ----------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const flag = (f) => args.includes(f);
  const outIdx = args.indexOf("--out");
  const outPath = outIdx !== -1 ? resolve(args[outIdx + 1]) : resolve(ROOT, "src/data/bootcamps.json");
  const input = resolve(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--out") ?? resolve(ROOT, "content/bootcamps.csv"));

  if (!existsSync(input)) { console.error(`No se encontró el archivo: ${input}`); process.exit(2); }
  let rows;
  try { rows = parseCsv(readFileSync(input, "utf8")); } catch (e) { console.error(`Error leyendo el CSV: ${e.message}`); process.exit(1); }

  const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")).map((b) => b.slug) : [];
  const { errors, data } = convert(rows, { existingSlugs: existing, allowRemoval: flag("--allow-removal") });
  if (errors.length) {
    console.error(`No se importó nada. ${errors.length} problema(s):\n` + errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  const withDetail = data.filter((b) => b.syllabus || b.duration || b.requirements).length;
  console.log(`OK: ${data.length} bootcamps válidos (${withDetail} con detalle oficial).`);
  if (flag("--check")) console.log("Modo --check: no se escribió ningún archivo.");
  else { writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8"); console.log(`Escrito: ${outPath}`); }
}
