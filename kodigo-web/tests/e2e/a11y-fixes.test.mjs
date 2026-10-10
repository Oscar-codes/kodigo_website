import { BASE, launchBrowser } from "./_env.mjs";
const base = BASE;
const browser = await launchBrowser();
const out = []; const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));

// ---- títulos por ruta (WCAG 2.4.2)
const titles = [["/", "Kodigo | Bootcamps de tecnología e IA"], ["/bootcamps", "Bootcamps | Kodigo"], ["/bootcamps/sql-ai", "SQL AI | Kodigo"],
  ["/nosotros/", "Nosotros | Kodigo"], ["/profesional", "Profesional | Kodigo"], ["/profesional/ppd", "PPD | Kodigo"],
  ["/bootcamps/no-existe", "Página no encontrada | Kodigo"], ["/profesional/no-existe", "Página no encontrada | Kodigo"], ["/ruta-inventada", "Página no encontrada | Kodigo"]];
for (const [r, title] of titles) { await page.goto(base + r); await page.waitForTimeout(150); t(`titulo ${r}`, (await page.title()) === title, `("${await page.title()}")`); }
await page.goto(base + "/"); await page.getByRole("link", { name: "Explorar bootcamps" }).click(); await page.waitForTimeout(150);
t("titulo se actualiza en navegacion cliente", (await page.title()) === "Bootcamps | Kodigo");
const all = []; for (const r of ["/", "/bootcamps", "/nosotros/", "/profesional", "/profesional/ppd", "/profesional/alianzas", "/bootcamps/sql-ai"]) { await page.goto(base + r); await page.waitForTimeout(100); all.push(await page.title()); }
t("titulos unicos entre paginas distintas", new Set(all).size === all.length);

// ---- enlace saltar al contenido (WCAG 2.4.1)
await page.goto(base + "/"); await page.waitForTimeout(200);
const skip = page.getByRole("link", { name: "Saltar al contenido" });
t("skip: existe y esta fuera de pantalla antes de enfocarlo", (await skip.boundingBox()).y < 0);
await page.keyboard.press("Tab");
t("skip: primer Tab lo enfoca", await skip.evaluate((e) => e === document.activeElement));
t("skip: visible al enfocarlo", (await skip.boundingBox()).y >= 0);
await page.keyboard.press("Enter"); await page.waitForTimeout(150);
t("skip: Enter mueve el foco al contenido principal", await page.evaluate(() => document.activeElement?.id === "contenido"));
await page.keyboard.press("Tab");
t("skip: siguiente Tab cae dentro del contenido (no en el header)", await page.evaluate(() => !!document.activeElement?.closest("main")));

// ---- encabezados
const routes = ["/", "/bootcamps", "/nosotros/", "/profesional", "/profesional/ppd", "/bootcamps/sql-ai", "/ruta-inventada"];
for (const r of routes) {
  await page.goto(base + r); await page.waitForTimeout(150);
  const levels = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4")].filter((h) => !h.hidden && getComputedStyle(h).display !== "none").map((h) => +h[0 === 0 ? "tagName" : "tagName"][1]));
  const skips = levels.some((l, i) => i > 0 && l - levels[i - 1] > 1);
  t(`encabezados ${r}: un solo h1 y sin saltos`, levels.filter((l) => l === 1).length === 1 && !skips && levels[0] === 1, `[${levels.join(",")}]`);
}
await page.goto(base + "/");
t("home: h2 'Nuestras rutas formativas' expuesto a lectores de pantalla", (await page.getByRole("heading", { name: "Nuestras rutas formativas", level: 2 }).count()) === 1);
t("home: el h2 no se ve en pantalla", await page.getByRole("heading", { name: "Nuestras rutas formativas", level: 2 }).evaluate((e) => { const b = e.getBoundingClientRect(); return b.width <= 1 && b.height <= 1; }));
await page.goto(base + "/bootcamps");
t("listado: 10 titulos de tarjeta son h2", (await page.locator("main ul > li h2").count()) === 10);
t("sin errores de pagina", errs.length === 0, errs.join("|"));
await browser.close(); process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
