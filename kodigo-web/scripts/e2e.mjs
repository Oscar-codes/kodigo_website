#!/usr/bin/env node
// Construye el sitio, lo sirve con `vite preview`, corre las pruebas de navegador de tests/e2e
// y apaga el servidor. Sin dependencias extra (usa playwright-core con el navegador instalado).
//
// Uso:
//   npm run test:e2e                 build + todas las pruebas
//   npm run test:e2e -- nav meta     solo las pruebas cuyo nombre contenga "nav" o "meta"
//   npm run test:e2e -- --skip-build reutiliza el dist/
//   npm run test:e2e -- --prod       sirve dist/ con `serve` (igual que Railway: reescritura SPA, cabeceras, gzip)
//                                    y activa tests/e2e/deploy.test.mjs
//   npm run test:e2e -- --demo       construye con `--mode demo` (contenido de EJEMPLO en dist-demo/) y corre las
//                                    pruebas del modo demostración + accesibilidad + responsive sobre ese contenido
//
// Variables: E2E_PORT (por defecto 4173), E2E_BROWSER_CHANNEL (msedge | chrome | chromium).

import { spawn, spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const prod = args.includes("--prod");
const demo = args.includes("--demo");
const OUT_DIR = demo ? "dist-demo" : "dist";
const DEMO_SUITES = ["demo", "a11y-axe", "responsive"]; // las demás suites asumen el contenido real (vacío)
const filters = args.filter((a) => !a.startsWith("--"));
const PORT = process.env.E2E_PORT ?? "4173";
const BASE = `http://localhost:${PORT}`;

const tests = readdirSync(join(ROOT, "tests/e2e"))
  .filter((f) => f.endsWith(".test.mjs"))
  .filter((f) => !filters.length || filters.some((x) => f.includes(x)))
  .filter((f) => !demo || filters.length || DEMO_SUITES.some((x) => f.startsWith(x)))
  .sort();
if (!tests.length) { console.error("Ninguna prueba coincide con el filtro."); process.exit(2); }

if (!skipBuild) {
  console.log("> build");
  const buildArgs = demo ? ["build", "--mode", "demo", "--outDir", OUT_DIR] : ["build"];
  const b = spawnSync(process.execPath, [join(ROOT, "node_modules/vite/bin/vite.js"), ...buildArgs], { cwd: ROOT, stdio: "inherit" });
  if (b.status !== 0) { console.error("El build falló; no se ejecutan las pruebas."); process.exit(1); }
}

const server = prod
  ? spawn(process.execPath, [join(ROOT, "node_modules/serve/build/main.js"), OUT_DIR, "--no-clipboard"], { cwd: ROOT, stdio: "ignore", env: { ...process.env, PORT } })
  : spawn(process.execPath, [join(ROOT, "node_modules/vite/bin/vite.js"), "preview", "--outDir", OUT_DIR, "--port", PORT, "--strictPort"], { cwd: ROOT, stdio: "ignore" });
const stop = () => { if (!server.killed) server.kill(); };
process.on("exit", stop);
process.on("SIGINT", () => { stop(); process.exit(130); });

const waitUp = async () => {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return true; } catch { /* aún no responde */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
};

if (!(await waitUp())) { console.error(`El servidor no respondió en ${BASE} (¿puerto ocupado? usa E2E_PORT).`); stop(); process.exit(1); }

let failed = 0;
const summary = [];
for (const file of tests) {
  const r = spawnSync(process.execPath, [join(ROOT, "tests/e2e", file)], { cwd: ROOT, encoding: "utf8", env: { ...process.env, BASE, ...(prod ? { E2E_PROD: "1" } : {}), ...(demo ? { E2E_DEMO: "1" } : {}) }, timeout: 300_000 });
  const lines = (r.stdout ?? "").split(/\r?\n/);
  const pass = lines.filter((l) => l.startsWith("PASS")).length;
  const fails = lines.filter((l) => l.startsWith("FAIL"));
  const crashed = r.status !== 0 && !fails.length; // la prueba murió sin reportar (timeout, navegador ausente...)
  summary.push({ file, pass, fail: fails.length + (crashed ? 1 : 0) });
  lines.filter((l) => l.startsWith("INFO")).forEach((l) => console.log(`  ${file}: ${l}`));
  fails.forEach((l) => console.log(`  ${file}: ${l}`));
  if (crashed) console.log(`  ${file}: FALLÓ SIN RESULTADOS\n${(r.stderr || "").trim().split("\n").slice(0, 6).join("\n")}`);
  failed += fails.length + (crashed ? 1 : 0);
}
stop();

console.log("\nResumen");
for (const s of summary) console.log(`  ${s.fail ? "FAIL" : "ok  "}  ${s.file.padEnd(24)} ${String(s.pass).padStart(3)} pasan${s.fail ? `, ${s.fail} fallan` : ""}`);
console.log(`\n${failed ? "FALLARON" : "TODO OK"}: ${summary.reduce((a, s) => a + s.pass, 0)} pasan, ${failed} fallan.`);
process.exit(failed ? 1 : 0);
