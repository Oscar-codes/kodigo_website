// Guarda de seguridad: el contenido de EJEMPLO del modo demostración nunca debe llegar al build normal.
// Se omite cuando la suite corre en modo demo.
import { BASE, launchBrowser } from "./_env.mjs";

if (process.env.E2E_DEMO) {
  console.log("INFO  no-demo: omitido en modo demo");
  process.exit(0);
}

const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };

// --- 1) El bundle JS servido no contiene textos ni dominios de ejemplo
const html = await (await fetch(BASE + "/")).text();
const bundles = [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
t("el HTML referencia al menos un bundle JS", bundles.length > 0, `(${bundles.join(", ")})`);
const code = (await Promise.all(bundles.map(async (b) => (await fetch(BASE + b)).text()))).join("\n");
const FORBIDDEN = ["de ejemplo", "Modo demostración", "example.com", "(ejemplo)", "Aliado de ejemplo", "Pregunta de ejemplo", "Testimonio de ejemplo", "Cifra de ejemplo"];
for (const s of FORBIDDEN) t(`bundle sin "${s}"`, !code.includes(s));

// --- 2) En el navegador: ni banner de demo ni secciones que dependen de contenido aún inexistente
const b = await launchBrowser();
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
for (const route of ["/", "/nosotros/", "/profesional/alianzas", "/bootcamps/ai-data-trainee"]) {
  await p.goto(BASE + route); await p.waitForTimeout(250);
  t(`${route}: sin banner de demostración`, (await p.locator("aside[aria-label*=demostración]").count()) === 0);
  t(`${route}: sin texto "de ejemplo" visible`, !/de ejemplo|\(ejemplo\)/i.test(await p.locator("body").innerText()));
}
await p.goto(BASE + "/"); await p.waitForTimeout(250);
for (const id of ["steps-title", "testimonials-title", "faq-title"]) t(`inicio: sin sección #${id} (no hay contenido oficial)`, (await p.locator(`#${id}`).count()) === 0);
t("inicio: la sección de aliados SÍ existe (contenido real: content/partners.csv)", (await p.locator("#partners-title").count()) === 1);
await p.goto(BASE + "/nosotros/"); await p.waitForTimeout(250);
for (const id of ["about-title", "stats-title"]) t(`nosotros: sin sección #${id} (no hay contenido oficial)`, (await p.locator(`#${id}`).count()) === 0);
t("robots: el sitio normal NO lleva noindex global", (await p.locator('meta[name="robots"]').count()) === 0);
await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
