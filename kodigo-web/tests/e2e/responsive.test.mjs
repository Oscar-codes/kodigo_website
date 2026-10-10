import fs from "node:fs";
import { BASE, launchBrowser } from "./_env.mjs";

const slugs = JSON.parse(fs.readFileSync(new URL("../../src/data/bootcamps.json", import.meta.url), "utf8")).map((b) => b.slug);
const routes = ["/", "/bootcamps", "/nosotros/", "/profesional", "/profesional/ppd", "/profesional/alianzas", "/ruta-inventada", ...slugs.map((s) => `/bootcamps/${s}`)];
const widths = [360, 768, 1024, 1440]; // anchos exigidos por W-11

const b = await launchBrowser();
const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };

for (const w of widths) {
  const page = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage();
  const problems = [];
  for (const r of routes) {
    await page.goto(BASE + r); await page.waitForTimeout(120);
    const m = await page.evaluate(() => {
      const vis = (s) => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0; };
      const h1 = document.querySelector("h1")?.getBoundingClientRect();
      return {
        overflowX: document.documentElement.scrollWidth - innerWidth,
        h1Inside: !!h1 && h1.left >= 0 && h1.right <= innerWidth + 0.5,
        toggle: vis("header button[aria-controls=main-menu]"),
        nav: vis("#main-menu"),
        footer: vis("footer"),
        main: vis("main"),
      };
    });
    const mobile = w < 992;
    if (m.overflowX > 0) problems.push(`${r}: desborda ${m.overflowX}px`);
    if (!m.h1Inside) problems.push(`${r}: h1 fuera del ancho`);
    if (mobile && (!m.toggle || m.nav)) problems.push(`${r}: en móvil debe verse solo el botón de menú`);
    if (!mobile && (m.toggle || !m.nav)) problems.push(`${r}: en escritorio debe verse el menú, no el botón`);
    if (!m.footer || !m.main) problems.push(`${r}: falta main/footer`);
  }
  t(`${w}px: ${routes.length} rutas sin desborde horizontal, h1 dentro del ancho, menú correcto (${w < 992 ? "móvil" : "escritorio"}), main y footer`, problems.length === 0, problems.slice(0, 3).join(" | "));
  await page.close();
}
await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
