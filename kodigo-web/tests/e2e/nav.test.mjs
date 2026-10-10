import { BASE, launchBrowser } from "./_env.mjs";
const base = process.env.BASE || BASE;
const browser = await launchBrowser();
const results = [];
const check = (name, ok, extra = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${name} ${extra}`; results.push(r); console.log(r); };

// ---------- Desktop 1280 ----------
// El unico dropdown del nuevo menu con submenu aparte de "Bootcamps" eliminado es
// "Profesional", asi el test de dropdown apunta a ese boton.
let ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
let page = await ctx.newPage();
await page.goto(base);
const bc = page.getByRole("button", { name: /Profesional/ });
const expanded = async (b) => (await b.getAttribute("aria-expanded")) === "true";

await bc.hover(); check("D1 hover abre submenu", await expanded(bc));
await bc.click(); check("D2 click tras hover mantiene abierto", await expanded(bc));
await page.mouse.move(640, 600); check("D3 mouseleave cierra", !(await expanded(bc)));
await bc.focus(); await page.keyboard.press("Enter"); check("D4 Enter abre", await expanded(bc));
await page.keyboard.press("Escape"); check("D5 Escape cierra", !(await expanded(bc)));
check("D5b Escape devuelve foco al boton", await bc.evaluate((e) => e === document.activeElement));
await page.keyboard.press("Enter"); await page.mouse.move(640, 700);
await page.mouse.click(640, 700); check("D6 click fuera cierra", !(await expanded(bc)));
await bc.focus(); await page.keyboard.press("Enter");
await page.keyboard.press("Tab"); // primer enlace "Ver todo"
check("D7 Tab entra al submenu", await page.evaluate(() => document.activeElement?.textContent === "Ver todo"));
for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
check("D8 Tab fuera del menu cierra", !(await expanded(bc)));
await bc.hover(); await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "PPD" }).click();
check("D9 navega a detalle", page.url().endsWith("/profesional/ppd"));
await page.waitForTimeout(150); // el cierre ocurre en un efecto tras el cambio de ruta
check("D9b submenu cerrado tras navegar", !(await expanded(bc)));
check("D9c boton Profesional marcado activo", (await bc.getAttribute("class"))?.includes("active") ?? false, "(clase)");
check("D10 sin scroll horizontal", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await ctx.close();

// ---------- Mobile 360 ----------
ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
page = await ctx.newPage();
await page.goto(base);
const toggle = page.getByRole("button", { name: /menú/i });
const menuVisible = async () => page.locator("#main-menu").isVisible();
check("M1 menu oculto al inicio", !(await menuVisible()));
await toggle.click(); check("M2 toggle abre menu", await menuVisible() && (await toggle.getAttribute("aria-expanded")) === "true");
await page.keyboard.press("Escape"); check("M3 Escape cierra menu movil", !(await menuVisible()));
await toggle.click();
await page.getByRole("button", { name: /Profesional/ }).click();
await page.getByRole("link", { name: "PPD" }).click();
check("M4 navegar cierra menu y va a /profesional/ppd", page.url().endsWith("/profesional/ppd") && !(await menuVisible()));
check("M5 sin scroll horizontal", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await ctx.close();

await browser.close();
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
