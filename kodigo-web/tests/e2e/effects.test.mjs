// Efectos y estilos de tarjetas tomados de Eduhall: entradas de títulos (bounce), giro del icono (flipInY),
// formas decorativas (upDown / scalation / giro), zoom de imagen, sombra de tarjeta, y su respaldo con movimiento reducido.
import { BASE, launchBrowser } from "./_env.mjs";

if (process.env.E2E_DEMO) {
  console.log("INFO  effects: omitido en modo demo (los efectos de las secciones demo están en demo.test)");
  process.exit(0);
}

const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await launchBrowser();
const newPage = async (opts = {}) => { const ctx = await b.newContext({ viewport: { width: 1280, height: 700 }, ...opts }); const p = await ctx.newPage(); p.errors = []; p.on("pageerror", (e) => p.errors.push(e.message)); return p; };
const style = (p, sel, prop, pseudo) => p.locator(sel).first().evaluate((e, [pr, ps]) => getComputedStyle(e, ps || null)[pr], [prop, pseudo]);

// ============ movimiento permitido ============
{
  const p = await newPage();
  await p.goto(BASE + "/"); await sleep(500);
  // Título de sección: bounce (etiqueta cae, título rebota, párrafo sube) al entrar en pantalla
  const h2 = "#bootcamps-title";
  t("título de sección: oculto antes de entrar en pantalla (opacity 0)", (await style(p, h2, "opacity")) === "0");
  await p.locator(h2).evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); await sleep(120);
  t("título de sección: arranca la animación bounce al entrar", (await style(p, h2, "animationName")) !== "none");
  t("título de sección: la etiqueta tiene su propia animación (bounceInDown)", (await style(p, "section[aria-labelledby=bootcamps-title] .label", "animationName")) !== "none");
  await sleep(1500);
  t("título de sección: termina visible (opacity 1)", (await style(p, h2, "opacity")) === "1");

  // Icono de beneficios: flipInY al pasar el cursor por la tarjeta (animation-item de Eduhall)
  const card = p.locator("section[aria-labelledby=benefits-title] ul > li").first();
  await card.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); await sleep(1400);
  const iconSel = "section[aria-labelledby=benefits-title] ul > li:first-child .icon";
  t("icono: sin animación en reposo", (await style(p, iconSel, "animationName")) === "none");
  await card.hover(); await sleep(150);
  t("icono: gira (flipInY) al pasar el cursor", (await style(p, iconSel, "animationName")) !== "none" && (await style(p, iconSel, "animationDuration")) === "1s");
  await p.mouse.move(2, 2);

  // Tarjetas de bootcamps: zoom de la imagen, etiqueta, marca de agua y borde
  await p.locator("#bootcamps-title").evaluate((e) => e.scrollIntoView({ block: "start", behavior: "instant" })); await sleep(1800);
  const bc = p.locator("section[aria-labelledby=bootcamps-title] ul > li").first();
  t("tarjeta: la imagen es un degradado corporativo con símbolo de marca de agua (sin fotos inventadas)", (await style(p, "section[aria-labelledby=bootcamps-title] .zoom", "backgroundImage")).includes("gradient") && (await bc.locator(".glyph").innerText()) === "</>");
  t("tarjeta: etiqueta de área en píldora blanca sobre la imagen", (await bc.locator(".pill").innerText()).toLowerCase() === "desarrollo" && (await style(p, "section[aria-labelledby=bootcamps-title] .pill", "backgroundColor")) === "rgb(255, 255, 255)");
  t("tarjeta: blanca, con borde y 16px de radio como course-item", await bc.locator("article").evaluate((e) => { const s = getComputedStyle(e); return s.backgroundColor === "rgb(255, 255, 255)" && s.borderRadius === "16px" && s.borderTopWidth === "1px"; }));
  t("tarjeta: la imagen tiene 12px de radio", (await bc.locator("article > div > div").first().evaluate((e) => getComputedStyle(e).borderRadius)) === "12px");
  t("tarjeta: sin datos oficiales no hay filas de datos vacías", (await bc.locator("ul[aria-label]").count()) === 0);
  t("tarjeta: separador punteado, 'Ficha del programa' y acción ('Aplicar' con formulario o 'Ver detalles')", (await bc.locator(".more").evaluate((e) => getComputedStyle(e).borderTopStyle)) === "dashed" && /Ficha del programa/.test(await bc.locator(".more").innerText()) && /Aplicar|Ver detalles/.test(await bc.locator(".more").innerText()));
  await bc.hover(); await sleep(500);
  t("tarjeta: al pasar el cursor la imagen hace zoom x1.1", (await style(p, "section[aria-labelledby=bootcamps-title] ul > li:first-child .zoom", "transform")) === "matrix(1.1, 0, 0, 1.1, 0, 0)");
  t("tarjeta: la flecha avanza 4px al pasar el cursor", (await bc.locator(".more svg").evaluate((e) => getComputedStyle(e).transform)) === "matrix(1, 0, 0, 1, 4, 0)");
  t("tarjeta: el borde se tiñe de violeta", (await bc.locator("article").evaluate((e) => getComputedStyle(e).borderColor)).includes("201, 201, 251"));
  await p.mouse.move(2, 2);
  t("inicio: sin errores de página", p.errors.length === 0, p.errors.join("|"));
  await p.close();
}

// ============ tarjeta Card genérica (Profesional) y formas de la cabecera ============
{
  const p = await newPage();
  await p.goto(BASE + "/profesional"); await sleep(500);
  const card = p.locator("main ul > li article").first();
  t("Card: sombra suave de Eduhall (0 6px 30px al 4%)", (await card.evaluate((e) => getComputedStyle(e).boxShadow)) === "rgba(0, 0, 0, 0.04) 0px 6px 30px 0px");
  await card.hover(); await sleep(350);
  t("Card: al pasar el cursor crece la sombra y se tiñe el borde", await card.evaluate((e) => { const s = getComputedStyle(e); return s.borderColor.includes("201, 201, 251") && s.boxShadow !== "rgba(0, 0, 0, 0.04) 0px 6px 30px 0px"; }));
  await p.mouse.move(2, 2);
  const hdr = "main header";
  t("cabecera: los puntos suben y bajan (upDown)", (await style(p, hdr, "animationName", "::before")) !== "none");
  t("cabecera: el aro pulsa (scalation)", (await style(p, hdr, "animationName", "::after")) !== "none");
  t("cabecera: el rombo gira (roatation)", (await style(p, "main header .shape", "animationName")) !== "none" && (await style(p, "main header .shape", "animationDuration")) === "14s");
  await p.close();
}

// ============ sin desbordes horizontales mientras las tarjetas esperan (fade-left/right) ============
for (const w of [360, 768]) {
  const p = await newPage({ viewport: { width: w, height: 700 } });
  for (const r of ["/", "/bootcamps"]) {
    await p.goto(BASE + r); await sleep(500);
    t(`${w}px ${r}: sin scroll horizontal con las entradas laterales pendientes`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await p.close();
}

// ============ movimiento reducido: todo visible y sin animaciones ============
{
  const p = await newPage({ reducedMotion: "reduce" });
  await p.goto(BASE + "/"); await sleep(500);
  t("reducido: el título de sección se ve sin hacer scroll y sin animación", (await style(p, "#bootcamps-title", "opacity")) === "1" && (await style(p, "#bootcamps-title", "animationName")) === "none");
  t("reducido: las etiquetas de sección también", (await style(p, "section[aria-labelledby=bootcamps-title] .label", "opacity")) === "1");
  const card = p.locator("section[aria-labelledby=benefits-title] ul > li").first();
  await card.hover(); await sleep(150);
  t("reducido: el icono NO gira al pasar el cursor", (await style(p, "section[aria-labelledby=benefits-title] ul > li:first-child .icon", "animationName")) === "none");
  await p.goto(BASE + "/profesional"); await sleep(400);
  t("reducido: las formas de la cabecera quedan quietas", (await style(p, "main header", "animationName", "::before")) === "none" && (await style(p, "main header .shape", "animationName")) === "none");
  t("reducido: las tarjetas de Inicio se ven completas sin scroll", await (async () => { await p.goto(BASE + "/"); await sleep(400); return p.locator("section[aria-labelledby=bootcamps-title] ul > li").evaluateAll((els) => els.length === 10 && els.every((e) => getComputedStyle(e).opacity === "1")); })());
  await p.close();
}

// ============ cabecera: sólida arriba, translúcida al bajar (fixed-header de Eduhall) ============
{
  const p = await newPage();
  await p.goto(BASE + "/"); await sleep(500);
  t("cabecera: arriba es blanca sólida y sin desenfoque", (await style(p, "body > div > header", "backgroundColor")) === "rgb(255, 255, 255)" && (await style(p, "body > div > header", "backdropFilter")) === "none");
  await p.evaluate(() => window.scrollTo(0, 600)); await sleep(600);
  const bg = await style(p, "body > div > header", "backgroundColor");
  t("cabecera: al bajar pasa a blanco translúcido con desenfoque", /^rgba\(255, 255, 255, 0\.\d+\)$/.test(bg) && (await style(p, "body > div > header", "backdropFilter")).includes("blur"), `(${bg})`);
  t("cabecera: sigue fija arriba al bajar", (await p.locator("body > div > header").evaluate((e) => Math.round(e.getBoundingClientRect().top))) === 0);
  await p.evaluate(() => window.scrollTo(0, 0)); await sleep(600);
  t("cabecera: al volver arriba recupera el blanco sólido", (await style(p, "body > div > header", "backgroundColor")) === "rgb(255, 255, 255)");
  await p.close();
}

await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
