// Pruebas del MODO DEMOSTRACIÓN (contenido de ejemplo). Solo corren con `npm run test:demo`.
import fs from "node:fs";
import { BASE, launchBrowser } from "./_env.mjs";

const N = JSON.parse(fs.readFileSync(new URL("../../src/data/partners.json", import.meta.url), "utf8")).length; // aliados reales

if (!process.env.E2E_DEMO) {
  console.log("INFO  demo: omitido (usa `npm run test:demo`)");
  process.exit(0);
}

const b = await launchBrowser();
const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const newPage = async (opts = {}) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 500 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  return page;
};
// scrollIntoView por evaluate: Playwright espera a que un elemento deje de moverse y la marquesina nunca se detiene.
const scrollTo = async (p, sel) => { await p.locator(sel).first().evaluate((e) => e.scrollIntoView({ block: "center" })); await sleep(1500); };

// ============ aviso y salvaguardas ============
{
  const p = await newPage();
  for (const r of ["/", "/bootcamps", "/nosotros/", "/profesional/alianzas", "/bootcamps/sql-ai", "/ruta-inventada"]) {
    await p.goto(BASE + r); await p.waitForTimeout(200);
    const banner = await p.locator("aside[aria-label*=demostración]").first().innerText().catch(() => "");
    t(`${r}: banner de demostración visible`, /Modo demostración.*no oficial.*no publicar/.test(banner));
    t(`${r}: robots noindex, nofollow`, (await p.locator('meta[name="robots"]').getAttribute("content")) === "noindex, nofollow");
  }
  t("el banner queda ANTES del header (primer elemento tras el enlace de salto)", await (async () => {
    await p.goto(BASE + "/"); return p.evaluate(() => { const n = document.querySelector("aside[aria-label*=demostración]"), h = document.querySelector("header"); return !!n && !!h && (n.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0; });
  })());
  await p.close();
}

// ============ Inicio: secciones nuevas y su orden ============
{
  const p = await newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/"); await p.waitForTimeout(300);
  const order = await p.evaluate(() => [...document.querySelectorAll("main > section, main > div > section")].map((s) => s.getAttribute("aria-labelledby") || s.tagName));
  t("inicio: orden Beneficios > Pasos > Aliados > Testimonios > FAQ", ["benefits-title", "steps-title", "partners-title", "testimonials-title", "faq-title"].every((id, i, a) => order.indexOf(id) !== -1 && (i === 0 || order.indexOf(a[i - 1]) < order.indexOf(id))), `[${order.join(", ")}]`);
  t("pasos: 4 tarjetas numeradas", (await p.locator("#steps-title").locator("xpath=ancestor::section//ol/li").count()) === 4);
  // Efecto item-hover de Eduhall: el bloque tintado se rellena de violeta, el texto pasa a blanco
  await p.locator("#steps-title").evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); await sleep(1500);
  const stepInner = "section[aria-labelledby=steps-title] ol > li:first-child .inner";
  const rest = await p.locator(stepInner).evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, h3: getComputedStyle(e.querySelector("h3")).color }));
  t("pasos (reposo): bloque tintado y título oscuro", rest.bg === "rgb(242, 242, 254)" && rest.h3 === "rgb(34, 46, 72)", JSON.stringify(rest));
  await p.locator("section[aria-labelledby=steps-title] ol > li").first().hover(); await sleep(500);
  const hov = await p.locator(stepInner).evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, h3: getComputedStyle(e.querySelector("h3")).color, p: getComputedStyle(e.querySelector("p")).color }));
  t("pasos (hover): el bloque se rellena de violeta y el texto pasa a blanco", hov.bg === "rgb(75, 74, 241)" && hov.h3 === "rgb(255, 255, 255)" && hov.p === "rgb(255, 255, 255)", JSON.stringify(hov));
  t("pasos: insignia numerada con borde punteado violeta (contador CSS 01, 02…)", await p.locator("section[aria-labelledby=steps-title] ol > li:first-child .circle").evaluate((e) => { const s = getComputedStyle(e, "::before"); return /counter\(step/.test(s.content) && s.borderTopStyle === "dashed" && s.color === "rgb(75, 74, 241)"; }));
  await p.mouse.move(2, 2);
  t("testimonios: 3 citas con blockquote y figcaption", (await p.locator("section[aria-labelledby=testimonials-title] figure").count()) === 3 && (await p.locator("section[aria-labelledby=testimonials-title] figure blockquote").count()) === 3 && (await p.locator("section[aria-labelledby=testimonials-title] figcaption").count()) === 3);

  // FAQ acordeón
  const sums = p.locator("section[aria-labelledby=faq-title] details > summary");
  t("faq: 4 preguntas, todas cerradas al inicio", (await sums.count()) === 4 && (await p.locator("section[aria-labelledby=faq-title] details[open]").count()) === 0);
  await sums.nth(0).scrollIntoViewIfNeeded(); await sleep(900);
  await sums.nth(0).click();
  t("faq: clic abre la respuesta", (await p.locator("section[aria-labelledby=faq-title] details").nth(0).getAttribute("open")) !== null && (await p.locator("section[aria-labelledby=faq-title] details").nth(0).locator("p").isVisible()));
  await sums.nth(1).focus(); await p.keyboard.press("Enter");
  t("faq: Enter (teclado) abre otra pregunta", (await p.locator("section[aria-labelledby=faq-title] details").nth(1).getAttribute("open")) !== null);
  await p.keyboard.press("Space");
  t("faq: Espacio (teclado) la cierra", (await p.locator("section[aria-labelledby=faq-title] details").nth(1).getAttribute("open")) === null);
  t("faq: la pregunta enfocada tiene anillo de foco visible", await sums.nth(1).evaluate((e) => { e.focus(); return getComputedStyle(e).outlineStyle !== "none" || getComputedStyle(e).boxShadow !== "none"; }));

  // Marquesina de aliados
  // La franja se monta al acercarse (rendimiento): primero hay que llegar a su título.
  await scrollTo(p, "#partners-title");
  const track = p.locator("section[aria-labelledby=partners-title] ul");
  t(`aliados: ${N} logos reales + ${N} copias ocultas a lectores de pantalla`, (await track.locator("li").count()) === N * 2 && (await track.locator("li[aria-hidden=true]").count()) === N);
  t("aliados: la franja se anima (movimiento permitido)", (await track.evaluate((e) => getComputedStyle(e).animationName)) !== "none");
  await p.mouse.move(2, 2); // el cursor de los pasos anteriores podría quedar sobre la franja y pausarla
  await sleep(300);
  const before = await track.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  await sleep(900);
  const after = await track.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  t("aliados: realmente se desplaza (translateX cambia)", before !== after, `(${before.toFixed(1)} -> ${after.toFixed(1)})`);
  await track.hover({ force: true }); await sleep(150);
  t("aliados: se pausa al pasar el cursor", (await track.evaluate((e) => getComputedStyle(e).animationPlayState)) === "paused");
  t("aliados: no genera scroll horizontal en la página", await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  // Revelado de testimonios
  await scrollTo(p, "section[aria-labelledby=testimonials-title] figure");
  t("testimonios: visibles tras el scroll", await p.locator("section[aria-labelledby=testimonials-title] li").evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1")));
  t("inicio demo: sin errores de página", p.errors.length === 0, p.errors.join("|"));
  await p.close();
}

// ============ Marquesina con movimiento reducido ============
{
  const p = await newPage({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/"); await p.waitForTimeout(300);
  await scrollTo(p, "#partners-title");
  const track = p.locator("section[aria-labelledby=partners-title] ul");
  t("movimiento reducido: la franja NO se anima", (await track.evaluate((e) => getComputedStyle(e).animationName)) === "none");
  t("movimiento reducido: sin copias duplicadas visibles", await track.locator("li[aria-hidden=true]").evaluateAll((els) => els.every((e) => getComputedStyle(e).display === "none")));
  t("movimiento reducido: los aliados se acomodan en filas (flex-wrap)", (await track.evaluate((e) => getComputedStyle(e).flexWrap)) === "wrap");
  t("movimiento reducido: testimonios y pasos visibles sin scroll", await p.locator("section[aria-labelledby=testimonials-title] li, section[aria-labelledby=steps-title] ol > li").evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1")));
  t("movimiento reducido: sin scroll horizontal", await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await p.close();
}

// ============ Nosotros: contenido y cifras animadas ============
{
  const p = await newPage();
  await p.goto(BASE + "/nosotros/"); await p.waitForTimeout(300);
  t("nosotros: título y 2 párrafos de ejemplo", /Sobre Kodigo/.test(await p.locator("#about-title").innerText()) && (await p.locator("section[aria-labelledby=about-title] p").count()) === 2);
  const nums = p.locator("section[aria-labelledby=stats-title] .number");
  t("cifras: 4 tarjetas", (await nums.count()) === 4);
  const initial = await nums.allInnerTexts();
  t("cifras: empiezan en 0 antes de entrar en pantalla", initial.every((x) => /^0/.test(x)), `(${initial.join(" | ")})`);
  await scrollTo(p, "section[aria-labelledby=stats-title] ul");
  await sleep(1500);
  const done = await nums.allInnerTexts();
  t("cifras: terminan en el valor final (1234+, 56, 98%, 10)", JSON.stringify(done.map((x) => x.replace(/\s/g, ""))) === JSON.stringify(["1234+", "56", "98%", "10"]), `(${done.join(" | ")})`);
  const sr = await p.locator("section[aria-labelledby=stats-title] li").first().innerText();
  t("cifras: lectores de pantalla reciben el valor final (no el número a medias)", (await nums.first().getAttribute("aria-hidden")) === "true" && /1234\+/.test(await p.locator("section[aria-labelledby=stats-title] li").first().evaluate((e) => e.textContent)), `(${sr.replace(/\n/g, " ")})`);
  await p.close();

  const r = await newPage({ reducedMotion: "reduce" });
  await r.goto(BASE + "/nosotros/"); await r.waitForTimeout(300);
  const rn = await r.locator("section[aria-labelledby=stats-title] .number").allInnerTexts();
  t("cifras con movimiento reducido: valor final inmediato, sin contar", JSON.stringify(rn.map((x) => x.replace(/\s/g, ""))) === JSON.stringify(["1234+", "56", "98%", "10"]), `(${rn.join(" | ")})`);
  await r.close();
}

// ============ Alianzas vs resto de Profesional ============
{
  const p = await newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/profesional/alianzas"); await p.waitForTimeout(300);
  t("alianzas: muestra la franja de aliados", (await p.locator("#partners-title").count()) === 1);
  await p.goto(BASE + "/profesional/ppd"); await p.waitForTimeout(300);
  t("ppd: NO muestra la franja de aliados", (await p.locator("#partners-title").count()) === 0);
  await p.close();
}

// ============ Detalle de bootcamp con datos de ejemplo ============
{
  const p = await newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/bootcamps/gen-ai-to-agents"); await p.waitForTimeout(300);
  t("detalle: panel con 3 datos, 3 módulos y requisitos", (await p.locator("aside dt").count()) === 3 && (await p.locator("#syllabus-title + ol > li").count()) === 3 && (await p.locator("#requirements-title").count()) === 1);
  t("detalle: ya no muestra el aviso de próximamente", !/próximamente/.test(await p.locator("main").innerText()));
  const a = p.getByRole("link", { name: "Inscribirme" });
  t("detalle: Inscribirme es externo y seguro", (await a.getAttribute("href")) === "https://example.com/inscripcion-de-ejemplo" && (await a.getAttribute("rel")) === "noopener noreferrer" && (await a.getAttribute("target")) === "_blank");
  await p.close();
}

// ============ Encabezados sin saltos y sin desborde en móvil ============
{
  const p = await newPage({ viewport: { width: 360, height: 740 } });
  for (const r of ["/", "/nosotros/", "/profesional/alianzas", "/bootcamps/sql-ai"]) {
    await p.goto(BASE + r); await p.waitForTimeout(250);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((x) => setTimeout(x, 60)); } });
    const levels = await p.evaluate(() => [...document.querySelectorAll("h1,h2,h3,h4")].filter((h) => !h.hidden && getComputedStyle(h).display !== "none").map((h) => +h.tagName[1]));
    t(`${r} (360px): un h1, sin saltos de nivel`, levels.filter((l) => l === 1).length === 1 && levels[0] === 1 && !levels.some((l, i) => i > 0 && l - levels[i - 1] > 1), `[${levels.join(",")}]`);
    t(`${r} (360px): sin scroll horizontal`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  t("móvil demo: sin errores de página", p.errors.length === 0, p.errors.join("|"));
  await p.close();
}

await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
