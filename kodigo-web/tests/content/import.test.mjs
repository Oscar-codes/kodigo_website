import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SCRIPT = join(ROOT, "scripts/import-bootcamps.mjs");
const dir = mkdtempSync(join(tmpdir(), "imp-")); const out = join(dir, "out.json"); const real = join(ROOT, "src/data/bootcamps.json");
const results = []; const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; results.push(r); console.log(r); };
const H = "slug,name,area,summary,duration,modality,level,requirements,syllabus,enrollmentUrl";
const run = (csv, extra = [], { seed = true, file = "in.csv" } = {}) => {
  const f = join(dir, file); writeFileSync(f, csv, "utf8");
  if (seed) copyFileSync(real, out); else if (existsSync(out)) writeFileSync(out, "[]");
  const r = spawnSync("node", [SCRIPT, f, "--out", out, ...extra], { encoding: "utf8" });
  return { code: r.status, text: r.stdout + r.stderr, json: existsSync(out) ? readFileSync(out, "utf8") : "" };
};
const base = JSON.parse(readFileSync(real, "utf8"));
const row = (o) => ["slug", "name", "area", "summary", "duration", "modality", "level", "requirements", "syllabus", "enrollmentUrl"].map((c) => { const v = o[c] ?? ""; return /[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(",");
const allRows = (mod = (x) => x) => base.map((b) => row(mod({ ...b })));

// 1 ida y vuelta con la plantilla real
let r = run(readFileSync(join(ROOT, "content/bootcamps.csv"), "utf8"));
t("plantilla real: valida y reproduce el JSON actual exacto", r.code === 0 && r.json === readFileSync(real, "utf8"), r.text.split("\n")[0]);

// 2 contenido completo con comillas, comas, saltos de linea y acentos
const full = allRows((b) => b.slug === "sql-ai" ? { ...b, duration: "8 semanas", modality: "Virtual, en vivo", level: 'Nivel "inicial"', requirements: "Computadora; Internet estable", syllabus: "Fundamentos: Consultas básicas; Filtros | Modelado: Joins\nsubconsultas | Cierre", enrollmentUrl: "https://example.com/x?a=1&b=2" } : b);
r = run([H, ...full].join("\r\n") + "\r\n");
const sql = JSON.parse(r.json).find((b) => b.slug === "sql-ai");
t("completo: exit 0 y 10 bootcamps", r.code === 0 && JSON.parse(r.json).length === 10);
t("completo: coma, comillas dobles y acentos conservados", sql?.modality === "Virtual, en vivo" && sql?.level === 'Nivel "inicial"');
t("completo: requisitos separados por ;", JSON.stringify(sql?.requirements) === JSON.stringify(["Computadora", "Internet estable"]));
t("completo: temario en modulos con temas (y modulo sin temas)", JSON.stringify(sql?.syllabus) === JSON.stringify([{ title: "Fundamentos", topics: ["Consultas básicas", "Filtros"] }, { title: "Modelado", topics: ["Joins\nsubconsultas"] }, { title: "Cierre" }]), JSON.stringify(sql?.syllabus));
t("completo: URL conservada con & y ?", sql?.enrollmentUrl === "https://example.com/x?a=1&b=2");
t("completo: campos vacios se omiten (sin claves vacias)", !JSON.stringify(JSON.parse(r.json)[0]).includes('""') && Object.keys(JSON.parse(r.json)[0]).join() === "slug,name,area,summary");

// 3 Excel espanol: BOM + punto y coma + CRLF
r = run("\uFEFF" + [H.replaceAll(",", ";"), ...base.map((b) => [b.slug, b.name, b.area, b.summary, "", "", "", "", "", ""].join(";"))].join("\r\n"));
t("Excel (BOM + ; + CRLF) se importa igual", r.code === 0 && r.json === readFileSync(real, "utf8"));

// 4 validaciones: cada una debe fallar con mensaje claro y SIN escribir
const fail = (name, csv, re, extra = []) => { const before = readFileSync(real, "utf8"); const x = run(csv, extra); t(name, x.code === 1 && re.test(x.text) && x.json === before, `(${(x.text.match(re) || [""])[0].slice(0, 80)})`); };
fail("slug invalido (mayusculas/espacios)", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, slug: "SQL AI" } : b)].join("\n"), /slug inválido "SQL AI"/);
fail("slug repetido", [H, ...allRows(), row(base[0])].join("\n"), /slug "gen-ai-to-agents" está repetido/);
fail("area no valida", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, area: "Marketing" } : b)].join("\n"), /área "Marketing" no válida/);
fail("falta descripcion", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, summary: "" } : b)].join("\n"), /falta la descripción corta/);
fail("falta nombre", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, name: "" } : b)].join("\n"), /falta el nombre/);
fail("URL http (no https)", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, enrollmentUrl: "http://x.com" } : b)].join("\n"), /enrollmentUrl debe ser una URL https/);
fail("URL sin protocolo", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, enrollmentUrl: "www.x.com" } : b)].join("\n"), /enrollmentUrl debe ser una URL https/);
fail("temas repetidos en un modulo", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, syllabus: "A: x; x" } : b)].join("\n"), /temas repetidos en "A": x/);
fail("modulos repetidos", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, syllabus: "A: x | A: y" } : b)].join("\n"), /módulos repetidos: A/);
fail("requisitos repetidos", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, requirements: "PC; PC" } : b)].join("\n"), /requisitos repetidos: PC/);
fail("modulo sin titulo (': tema')", [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, syllabus: ": solo temas" } : b)].join("\n"), /no tiene título/);
fail("columna desconocida", [H + ",extra", ...base.map((b) => row(b) + ",x")].join("\n"), /Columnas desconocidas: extra/);
fail("columna faltante", ["slug,name,area,summary", ...base.map((b) => [b.slug, b.name, b.area, b.summary].join(","))].join("\n"), /Faltan columnas: duration/);
fail("comillas sin cerrar", [H, ...allRows(), 'x,"abierta'].join("\n"), /no se cierra/);
fail("archivo sin filas", H + "\n", /no tiene filas/);
fail("slug existente eliminado (URL publica cambiaria)", [H, ...allRows().slice(1)].join("\n"), /Se eliminarían slugs.*gen-ai-to-agents/);
r = run([H, ...allRows().slice(1)].join("\n"), ["--allow-removal"]);
t("--allow-removal permite eliminar", r.code === 0 && JSON.parse(r.json).length === 9);
r = run([H, ...allRows(), row({ slug: "nuevo-programa", name: "Nuevo", area: "IA", summary: "Descripcion" })].join("\n"));
t("slug nuevo se agrega sin problema (11)", r.code === 0 && JSON.parse(r.json).length === 11);
const reord = run([H, ...allRows().reverse()].join("\n"));
t("el orden del CSV define el orden del sitio", reord.code === 0 && JSON.parse(reord.json)[0].slug === "full-stack-jr");

// 5 --check no escribe; archivo inexistente
copyFileSync(real, out); writeFileSync(join(dir, "c.csv"), [H, ...allRows((b) => b.slug === "sql-ai" ? { ...b, duration: "9 sem" } : b)].join("\n"));
r = spawnSync("node", [SCRIPT, join(dir, "c.csv"), "--out", out, "--check"], { encoding: "utf8" });
t("--check valida y NO escribe", r.status === 0 && /no se escribió/.test(r.stdout) && readFileSync(out, "utf8") === readFileSync(real, "utf8"));
r = spawnSync("node", [SCRIPT, join(dir, "no-existe.csv")], { encoding: "utf8" });
t("archivo inexistente: exit 2 con mensaje", r.status === 2 && /No se encontró/.test(r.stderr));
t("los datos reales del sitio no se tocaron", readFileSync(real, "utf8") === JSON.stringify(base, null, 2) + "\n");
process.exit(results.some((x) => x.startsWith("FAIL")) ? 1 : 0);
