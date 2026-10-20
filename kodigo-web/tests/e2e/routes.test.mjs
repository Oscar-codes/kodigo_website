import { BASE, launchBrowser } from "./_env.mjs";
import fs from "node:fs";
const base = BASE;
const bootcamps = JSON.parse(fs.readFileSync(new URL("../../src/data/bootcamps.json", import.meta.url), "utf8"));
const browser = await launchBrowser();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
let errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => m.type() === "error" && !/favicon|404/.test(m.text()) && errors.push("console: " + m.text()));
const out = [];
const t = (name, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${name} ${x}`; out.push(r); console.log(r); };
const h1 = async () => (await page.locator("h1").first().innerText().catch(() => "")).trim();

t("data: 10 bootcamps leidos", bootcamps.length === 10, `(${bootcamps.length})`);
const routes = [["/", /El futuro no/], ["/bootcamps", /^Bootcamps$/], ["/nosotros/", /^Nosotros$/], ["/nosotros", /^Nosotros$/],
  ["/profesional", /^Profesional$/], ["/profesional/ppd", /^PPD$/], ["/profesional/alianzas", /^KODIGO PARA EMPRESAS$/]];
for (const b of bootcamps) routes.push([`/bootcamps/${b.slug}`, { test: (s) => s === b.name }]);
for (const [path, re] of routes) { await page.goto(base + path); t(`ruta directa ${path}`, re.test(await h1()), `h1="${await h1()}"`); }
for (const bad of ["/bootcamps/no-existe", "/profesional/no-existe", "/ruta-inventada", "/bootcamps/gen-ai-to-agents/extra"]) {
  await page.goto(base + bad); t(`404 en ${bad}`, (await h1()) === "Página no encontrada");
}
await page.goto(base + "/bootcamps");
t("listado: 10 tarjetas", (await page.locator("main ul > li").count()) === 10, `(${await page.locator("main ul > li").count()})`);
// El enlace del título es el primero de cada tarjeta (las que tienen formulario añaden "Ficha del programa" y el botón "Aplicar").
const hrefs = await page.locator("main ul > li").evaluateAll((lis) => lis.map((li) => li.querySelector("a").getAttribute("href")));
t("listado: enlaces == datos", JSON.stringify(hrefs) === JSON.stringify(bootcamps.map((b) => `/bootcamps/${b.slug}`)));
await page.goto(base + "/");
await page.getByRole("button", { name: /Profesional/ }).hover();
const menuLinks = await page.locator("#submenu-profesional a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
t("menu: Profesional tiene Ver todo + 2 secciones", menuLinks.length === 3 && menuLinks[0] === "/profesional", `(${menuLinks.length})`);
await page.goBack(); await page.goForward();
t("back/forward funcionan", page.url().endsWith("/nosotros/") && (await h1()) === "Nosotros");
await page.goto(base + "/bootcamps/ai-data-trainee"); await page.getByRole("navigation", { name: "Migas de pan" }).getByRole("link", { name: "Bootcamps" }).click();
t("detalle -> miga Bootcamps vuelve al listado", page.url().endsWith("/bootcamps"));
await page.evaluate(() => window.scrollTo(0, 400)); await page.getByRole("link", { name: "Gen AI to Agents" }).first().click();
t("scroll arriba al cambiar de ruta", (await page.evaluate(() => scrollY)) === 0);
t("sin errores de consola/pagina", errors.length === 0, errors.join(" | "));
await browser.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
