// Recursos reales de marca: logo, favicon, iconos oficiales y logos de aliados (49).
import fs from "node:fs";
import { BASE, launchBrowser } from "./_env.mjs";

if (process.env.E2E_DEMO) {
  console.log("INFO  brand: omitido en modo demo (la suite de producción lo cubre)");
  process.exit(0);
}

const partners = JSON.parse(fs.readFileSync(new URL("../../src/data/partners.json", import.meta.url), "utf8"));
const stems = partners.map((p) => p.file.replace(/\.webp$/, ""));
const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await launchBrowser();

// ============ logo, favicon y color de tema ============
{
  const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await page.goto(BASE + "/"); await page.waitForTimeout(400);
  const head = page.locator("header img").first();
  t("header: logo oficial con alt 'Kodigo' y cargado", (await head.getAttribute("alt")) === "Kodigo" && (await head.evaluate((e) => e.complete && e.naturalWidth > 0)));
  t("header: logo con width/height (sin saltos de layout) y 30 px de alto", (await head.getAttribute("width")) === "640" && (await head.getAttribute("height")) === "134" && Math.round((await head.boundingBox()).height) === 30);
  t("header: el enlace del logo lleva a '/' y tiene nombre accesible", (await page.locator("header a:has(img)").getAttribute("href")) === "/" && /Kodigo/.test((await page.locator("header a:has(img)").getAttribute("aria-label")) ?? ""));
  t("header: es el logo a color (fondo blanco) y el footer usa el logo blanco", /kodigo-logo-dark|^data:image\/webp/.test((await page.locator("header img").first().getAttribute("src")) ?? "") && (await page.locator("header img").first().getAttribute("width")) === "640" && (await page.locator("footer img").first().getAttribute("width")) === "486");
  t("footer: logo oficial cargado", await page.locator("footer img").first().evaluate((e) => e.alt === "Kodigo" && e.complete && e.naturalWidth > 0));
  for (const [rel, sizes] of [["icon", "32x32"], ["icon", "48x48"], ["apple-touch-icon", null]]) {
    const sel = `link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ""}`;
    const href = await page.locator(sel).getAttribute("href").catch(() => null);
    const res = href ? await fetch(BASE + href) : null;
    t(`favicon ${rel} ${sizes ?? ""}: enlazado y responde imagen`, !!res && res.status === 200 && (res.headers.get("content-type") ?? "").startsWith("image/"), `(${href} ${res?.status} ${res?.headers.get("content-type")})`);
  }
  t("meta theme-color violeta (header violeta)", (await page.locator('meta[name="theme-color"]').getAttribute("content")) === "#4B4AF1");
  // Rutas formativas: 3 tarjetas con icono SVG decorativo
  const icons = page.locator("section[aria-labelledby=benefits-title] .icon svg");
  t("rutas: 3 iconos SVG decorativos", (await icons.count()) === 3 && (await icons.evaluateAll((els) => els.every((e) => e.getAttribute("aria-hidden") === "true"))));
  t("rutas: títulos Inteligencia Artificial / Data Analyst / Programación", JSON.stringify(await page.locator("section[aria-labelledby=benefits-title] h3").allTextContents()) === JSON.stringify(["Ruta de Inteligencia Artificial", "Ruta de Data Analyst", "Ruta de Programación"]));
  const bgs = await page.locator("section[aria-labelledby=benefits-title] ul > li").evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundColor));
  t("rutas: fondos morado / verde / naranja suaves", JSON.stringify(bgs) === JSON.stringify(["rgb(237, 237, 254)", "rgb(232, 248, 239)", "rgb(254, 241, 235)"]), JSON.stringify(bgs));
  await page.close();
}

// ============ Inicio: la franja de aliados no descarga logos hasta acercarse ============
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 700 } }); // la franja queda ~1100 px: fuera del margen de 200 px
  const page = await ctx.newPage();
  const logoReqs = new Set();
  page.on("request", (r) => { const m = r.url().match(/\/assets\/([a-z0-9-]+?)-[A-Za-z0-9_-]{8}\.webp/); if (m && stems.includes(m[1])) logoReqs.add(m[1]); });
  await page.goto(BASE + "/"); await sleep(900);
  t("inicio: 0 logos de aliados descargados antes de acercarse a la franja", logoReqs.size === 0, `(${logoReqs.size} descargados)`);
  await page.locator("#partners-title").evaluate((e) => e.scrollIntoView({ block: "center" })); await sleep(1800);
  const items = page.locator("section[aria-labelledby=partners-title] ul > li");
  t(`inicio: franja con ${partners.length} logos + ${partners.length} copias ocultas`, (await items.count()) === partners.length * 2 && (await items.locator("xpath=self::*[@aria-hidden='true']").count()) === partners.length);
  const broken = await page.locator("section[aria-labelledby=partners-title] ul > li:not([aria-hidden]) img").evaluateAll((els) => els.filter((e) => !(e.complete && e.naturalWidth > 0)).map((e) => e.alt));
  t(`inicio: los ${partners.length} logos de la franja cargan (ninguna imagen rota)`, broken.length === 0, broken.join(", "));
  t("inicio: enlace 'Ver todos los aliados' a /profesional/alianzas", (await page.getByRole("link", { name: "Ver todos los aliados" }).getAttribute("href")) === "/profesional/alianzas");
  t("inicio: la franja no genera scroll horizontal", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const track = page.locator("section[aria-labelledby=partners-title] ul").first();
  const dur = parseFloat(await track.evaluate((e) => getComputedStyle(e).animationDuration));
  t("inicio: duración proporcional a la cantidad (>= 30 s; velocidad razonable)", dur >= 30 && dur <= 200, `(${dur}s)`);
  await ctx.close();
}

// ============ Inicio con movimiento reducido: rejilla estática acotada ============
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/"); await page.locator("#partners-title").evaluate((e) => e.scrollIntoView({ block: "center" })); await sleep(1200);
  const visible = await page.locator("section[aria-labelledby=partners-title] ul > li").evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  t("movimiento reducido: rejilla estática de 12 logos (no los 49) en Inicio", visible === 12, `(${visible})`);
  await ctx.close();
}

// ============ Alianzas: rejilla completa ============
{
  const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(BASE + "/profesional/alianzas"); await page.waitForTimeout(300);
  const imgs = page.locator("section[aria-labelledby=partners-title] ul img");
  t(`alianzas: ${partners.length} logos en rejilla`, (await imgs.count()) === partners.length);
  // los logos son lazy: recorrer la página para que todos carguen
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
  await sleep(1200);
  const info = await imgs.evaluateAll((els) => els.map((e) => ({ alt: e.alt, ok: e.complete && e.naturalWidth > 0, w: e.getAttribute("width"), h: e.getAttribute("height") })));
  t("alianzas: ninguna imagen rota tras recorrer la página", info.every((i) => i.ok), info.filter((i) => !i.ok).map((i) => i.alt).join(", "));
  t("alianzas: todos los logos con alt (nombre) no vacío y único", info.every((i) => i.alt.trim().length > 1) && new Set(info.map((i) => i.alt)).size === partners.length);
  t("alianzas: los alt coinciden con los nombres de content/partners.csv", JSON.stringify(info.map((i) => i.alt)) === JSON.stringify(partners.map((p) => p.name)));
  t("alianzas: cada logo trae width/height (reserva de espacio, sin saltos)", info.every((i) => Number(i.w) > 0 && Number(i.h) > 0));
  t("alianzas: sin textos de ejemplo", !/ejemplo/i.test(await page.locator("main").innerText()));
  t("alianzas: sin párrafo de contenido pendiente", !/pendiente de definir/i.test(await page.locator("main").innerText()));
  t("alianzas: sin scroll horizontal", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  t("alianzas: sin errores de página", errs.length === 0, errs.join("|"));
  await page.close();
  const m = await (await b.newContext({ viewport: { width: 360, height: 740 } })).newPage();
  await m.goto(BASE + "/profesional/alianzas"); await sleep(500);
  t("alianzas (360px): rejilla sin desborde horizontal", await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const cols = await m.locator("section[aria-labelledby=partners-title] ul").evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length);
  t("alianzas (360px): 2 columnas legibles", cols === 2, `(${cols})`);
  await m.close();
}

await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
