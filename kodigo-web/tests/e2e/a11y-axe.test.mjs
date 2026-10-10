import { BASE, launchBrowser } from "./_env.mjs";
import fs from "node:fs";
import { createRequire } from "node:module";
const base = BASE;
const axeSrc = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const browser = await launchBrowser();
const slugs = JSON.parse(fs.readFileSync(new URL("../../src/data/bootcamps.json", import.meta.url), "utf8")).map((b) => b.slug);
const routes = ["/", "/bootcamps", "/nosotros/", "/profesional", "/profesional/ppd", "/profesional/alianzas", "/ruta-inventada", ...slugs.map((s) => `/bootcamps/${s}`)];
const agg = {}; let scans = 0; const fgSeen = new Set();
// Sin tolerancias: X-07 (contraste de marca) se resolvió con los tonos AA aprobados. Cualquier violación falla.
const KNOWN_RULES = new Set(); const KNOWN_FG = new Set();
const scan = async (page, label) => {
  await page.evaluate(axeSrc);
  const r = await page.evaluate(() => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
  scans++;
  for (const v of r.violations) {
    if (v.id === "color-contrast") for (const n of v.nodes) fgSeen.add(n.any[0]?.data?.fgColor);
    const a = (agg[v.id] ??= { impact: v.impact, help: v.help, nodes: 0, where: new Set(), sample: new Set() });
    a.nodes += v.nodes.length; a.where.add(label);
    for (const n of v.nodes.slice(0, 2)) a.sample.add(n.target.join(" ") + " :: " + (n.any[0]?.message || n.all[0]?.message || n.none[0]?.message || "").slice(0, 110));
  }
};
for (const [w, h] of [[1280, 800], [360, 740]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  for (const r of routes) { await page.goto(base + r); await page.waitForTimeout(250); await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(900); await scan(page, `${w}${r}`); }
  await page.goto(base + "/"); await page.waitForTimeout(250);
  if (w >= 992) { await page.getByRole("button", { name: /Bootcamps/ }).hover(); await page.waitForTimeout(200); await scan(page, `${w}/ (submenu abierto)`); }
  else { await page.getByRole("button", { name: /menú/i }).click(); await scan(page, `${w}/ (menu movil abierto)`); }
  await page.close();
}
await browser.close();
const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
t(`axe: ${scans} escaneos completados (17 rutas x 2 anchos + menus abiertos)`, scans === 36, `(${scans})`);
const unexpected = Object.keys(agg).filter((id) => !KNOWN_RULES.has(id));
t("axe: ninguna regla violada fuera de la lista de problemas conocidos", unexpected.length === 0, unexpected.map((id) => `${id} [${[...agg[id].sample][0]}]`).join(" | "));
const newFg = [...fgSeen].filter((c) => !KNOWN_FG.has(c));
t("axe: ningún color en falla de contraste", newFg.length === 0, newFg.join(", "));
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
