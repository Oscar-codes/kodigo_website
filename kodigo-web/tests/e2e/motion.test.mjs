import { BASE, launchBrowser } from "./_env.mjs";
const base = BASE;
const browser = await launchBrowser();
const out = []; const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const st = (page, sel, prop, i = 0) => page.locator(sel).nth(i).evaluate((e, p) => getComputedStyle(e)[p], prop);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ============ MOVIMIENTO PERMITIDO ============
let ctx = await browser.newContext({ viewport: { width: 1280, height: 600 }, reducedMotion: "no-preference" });
let page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
await page.goto(base + "/"); await sleep(300);
t("N1 h1 visible y sin animacion (protege LCP)", (await st(page, "h1", "opacity")) === "1" && (await st(page, "h1", "animationName")) === "none");
t("N2 botones del hero visibles de inmediato", (await st(page, "main section >> nth=0 >> a", "opacity")) === "1");
const shape = "main section:last-of-type span[aria-hidden=true]"; // círculos flotantes de la banda violeta (CTA)
t("N3 2 formas flotantes con animacion", (await page.locator(shape).count()) === 2 && (await st(page, shape, "animationName")) !== "none");
t("N3b formas translúcidas (fondo blanco al 10%) y redondas", (await st(page, shape, "backgroundColor")) === "rgba(255, 255, 255, 0.1)" && (await st(page, shape, "borderRadius")) === "50%");
t("N3c formas desfasadas (delay distinto)", (await st(page, shape, "animationDelay", 0)) !== (await st(page, shape, "animationDelay", 1)));
const li = "section[aria-labelledby=benefits-title] ul > li";
const top0 = await page.locator(li).first().evaluate((e) => e.getBoundingClientRect().top);
t("N4 beneficios fuera de pantalla al inicio", top0 > 600, `(top=${Math.round(top0)})`);
t("N5 beneficios ocultos antes de entrar (opacity 0)", (await st(page, li, "opacity")) === "0");
t("N5b sin scroll horizontal mientras estan ocultos", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
await page.locator(li).first().scrollIntoViewIfNeeded(); await sleep(1300);
for (let i = 0; i < 3; i++) t(`N6 beneficio ${i + 1} visible tras scroll`, (await st(page, li, "opacity", i)) === "1" && (await st(page, li, "transform", i)) === "none");
const delays = [0, 1, 2].map(async (i) => parseFloat((await st(page, li, "transitionDelay", i)).split(",")[0]));
const d = await Promise.all(delays);
t("N7 escalonado 0 / 80 / 160 ms", d[0] === 0 && Math.abs(d[1] - 0.08) < 1e-6 && Math.abs(d[2] - 0.16) < 1e-6, JSON.stringify(d));
t("N8 la altura de la pagina no cambia al revelar (sin saltos)", (await page.evaluate(() => document.documentElement.scrollHeight)) === h0);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(1300);
t("N9 CTA visible tras scroll", (await page.locator("main h2:has-text('Empieza hoy')").evaluate((e) => getComputedStyle(e.parentElement.parentElement).opacity)) === "1");
await page.goto(base + "/bootcamps"); await sleep(300);
const cards = "main ul > li";
t("N10 listado: 10 elementos", (await page.locator(cards).count()) === 10);
const hiddenBelow = await page.locator(cards).evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().top > innerHeight && getComputedStyle(e).opacity === "0").length);
t("N11 listado: los de abajo empiezan ocultos", hiddenBelow >= 3, `(${hiddenBelow})`);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(1500);
t("N12 listado: todos visibles tras recorrer", (await page.locator(cards).evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1"))));
const maxDelay = await page.locator(cards).evaluateAll((els) => Math.max(...els.map((e) => parseFloat(getComputedStyle(e).transitionDelay.split(",")[0]))));
t("N13 retraso maximo <= 160 ms (no se acumula)", maxDelay <= 0.16 + 1e-6, `(${maxDelay}s)`);
t("N14 enlaces de tarjetas siguen funcionando", await page.locator(cards + " a").first().evaluate((a) => a.getAttribute("href") === "/bootcamps/gen-ai-to-agents"));
await page.locator(cards + " article").first().hover(); await sleep(450);
t("N15 hover real (Eduhall): la imagen hace zoom x1.1 y el borde de la tarjeta se tiñe de violeta", (await page.locator(cards + " article").first().evaluate((e) => { const z = getComputedStyle(e.querySelector(".zoom")).transform, s = getComputedStyle(e); return z === "matrix(1.1, 0, 0, 1.1, 0, 0)" && s.borderColor.includes("201, 201, 251"); })));
t("N16 CLS acumulado < 0.1", (await page.evaluate(() => window.__cls)) < 0.1, `(${(await page.evaluate(() => window.__cls)).toFixed(4)})`);
t("N17 sin errores de pagina", errs.length === 0, errs.join("|"));
await ctx.close();

// ============ MOVIMIENTO REDUCIDO ============
ctx = await browser.newContext({ viewport: { width: 1280, height: 600 }, reducedMotion: "reduce" });
page = await ctx.newPage(); await page.goto(base + "/"); await sleep(300);
t("R1 beneficios visibles SIN hacer scroll", (await page.locator(li).evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === "1" && getComputedStyle(e).transform === "none"))));
t("R2 formas sin animacion", (await st(page, shape, "animationName")) === "none");
t("R2b formas conservan rotacion estatica", (await st(page, shape, "transform")) !== "none");
t("R3 CTA visible sin scroll", (await page.locator("main h2:has-text('Empieza hoy')").evaluate((e) => getComputedStyle(e.parentElement.parentElement).opacity)) === "1");
await page.goto(base + "/bootcamps"); await sleep(300);
t("R4 listado: 10 tarjetas visibles sin scroll", (await page.locator(cards).evaluateAll((els) => els.length === 10 && els.every((e) => getComputedStyle(e).opacity === "1"))));
await ctx.close();

// ============ MOVIL 360 ============
ctx = await browser.newContext({ viewport: { width: 360, height: 740 } }); page = await ctx.newPage();
await page.goto(base + "/"); await page.evaluate(() => window.scrollTo(0, 800)); await sleep(1300);
t("M1 movil: sin scroll horizontal tras animar", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await ctx.close();
await browser.close(); process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
