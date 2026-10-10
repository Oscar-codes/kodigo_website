import { BASE, launchBrowser } from "./_env.mjs";
const base = BASE;
 const mode = process.argv[2];
const browser = await launchBrowser();
const out = []; const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  [${mode}] ${n} ${x}`; out.push(r); console.log(r); };
for (const [w, h] of [[1280, 900], [360, 900]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(base + "/bootcamps/sql-ai");
  const txt = await page.locator("main").innerText();
  const crumbs = page.getByRole("navigation", { name: "Migas de pan" });
  t(`${w} migas: Inicio > Bootcamps > SQL AI`, (await crumbs.locator("li").allInnerTexts()).join("|") === "Inicio|Bootcamps|SQL AI");
  t(`${w} migas: enlaces correctos`, (await crumbs.getByRole("link", { name: "Inicio" }).getAttribute("href")) === "/" && (await crumbs.getByRole("link", { name: "Bootcamps" }).getAttribute("href")) === "/bootcamps");
  t(`${w} migas: pagina actual con aria-current y sin enlace`, (await crumbs.locator("[aria-current=page]").innerText()) === "SQL AI" && (await crumbs.getByRole("link").count()) === 2);
  const crumbText = (await crumbs.innerText()).split(String.fromCharCode(10)).join(" ");
  t(`${w} migas: sin marcadores de lista ni numeracion`, (await crumbs.locator("ol").evaluate((o) => getComputedStyle(o).listStyleType === "none" && getComputedStyle(o).paddingLeft === "0px")) && !/[0-9]\./.test(crumbText), `("${crumbText}")`);
  t(`${w} sin h2 vacios`, (await page.locator("main h2").evaluateAll((hs) => hs.filter((x) => !x.textContent.trim()).length)) === 0);
  t(`${w} sin scroll horizontal`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  t(`${w} sin errores`, errs.length === 0, errs.join("|"));
  const aside = page.locator("aside");
  const asideCount = await aside.count();
  {  // Estado publicado hoy: sin datos oficiales. Con datos, ver nota en tests/README.md.
    t(`${w} sin panel lateral`, asideCount === 0);
    t(`${w} aviso proximamente`, /se publicarán próximamente/.test(txt));
    t(`${w} sin Temario/Requisitos/Inscribirme`, !/Temario|Requisitos|Inscribirme/.test(txt));
  }
  await page.close();
}
// teclado en migas
const kp = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await kp.goto(base + "/bootcamps/sql-ai"); await kp.getByRole("navigation", { name: "Migas de pan" }).getByRole("link", { name: "Bootcamps" }).focus(); await kp.keyboard.press("Enter");
t("teclado: Enter en miga navega a /bootcamps", kp.url().endsWith("/bootcamps"));
await browser.close(); process.exit(out.some((r) => r.includes("FAIL")) ? 1 : 0);
