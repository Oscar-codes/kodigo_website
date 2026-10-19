// Página Alianzas ("Kodigo para empresas"): banner, cifras de impacto, workshop con tarjetas y formulario de registro.
import { BASE, launchBrowser } from "./_env.mjs";

if (process.env.E2E_DEMO) {
  console.log("INFO  alliances: omitido en modo demo");
  process.exit(0);
}

const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await launchBrowser();
const open = async (width) => {
  const ctx = await b.newContext({ viewport: { width, height: 800 } });
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push(e.message));
  await p.goto(BASE + "/profesional/alianzas");
  await sleep(400);
  return p;
};

{
  const p = await open(1280);
  // ---- 1. Banner
  t("banner: h1 'KODIGO PARA EMPRESAS'", (await p.locator("h1").innerText()).trim() === "KODIGO PARA EMPRESAS" && (await p.locator("h1").count()) === 1);
  t("banner: pregunta exacta", (await p.getByText("¿Tu equipo está listo para aplicar IA en su trabajo?", { exact: true }).filter({ visible: true }).count()) === 1);
  t("banner: subtítulo exacto", (await p.getByText("Entrenamos a tus equipos para aplicar IA en procesos y necesidades reales de tu empresa.", { exact: true }).filter({ visible: true }).count()) === 1);
  const cta = p.getByRole("link", { name: "Agendar una asesoría" }).first();
  t("banner: CTA 'Agendar una asesoría' con flecha (svg)", (await cta.isVisible()) && (await cta.locator("svg").count()) === 1);
  t("banner: el CTA baja a Contacto mientras no haya URL de agenda", (await cta.getAttribute("href")) === "#contacto");
  t("banner: el CTA es del tamaño de un botón (alto >= 48)", (await cta.boundingBox()).height >= 48);

  // ---- 2. Cifras
  const items = p.locator("section[aria-labelledby=impact-title] li");
  await items.first().scrollIntoViewIfNeeded(); await sleep(2200);
  const texts = (await items.allInnerTexts()).map((s) => s.replace(/\s+/g, " ").trim());
  t("cifras: tres métricas", texts.length === 3);
  t("cifras: +360 / +2,800 / +80 con su etiqueta", /\+360/.test(texts[0]) && /EMPRESAS CAPACITADAS/i.test(texts[0]) && /\+2,800/.test(texts[1]) && /PROFESIONALES CAPACITADOS/i.test(texts[1]) && /\+80/.test(texts[2]) && /ALIANZAS ESTRATÉGICAS/i.test(texts[2]), JSON.stringify(texts));
  t("cifras: etiquetas en mayúsculas (text-transform)", (await items.first().locator(".label").evaluate((e) => getComputedStyle(e).textTransform)) === "uppercase");
  t("cifras: número grande (>= 44 px)", parseFloat(await items.first().locator(".number").evaluate((e) => getComputedStyle(e).fontSize)) >= 44);

  // ---- 3. Workshop
  t("workshop: encabezado exacto", (await p.locator("#workshop-title").innerText()).trim() === "Descubrí cómo aplicar IA en tu empresa");
  t("workshop: descripción exacta", await p.getByText("Una sesión práctica para identificar oportunidades reales de IA en tu operación y definir por dónde empezar.", { exact: true }).isVisible());
  const steps = p.locator("section[aria-labelledby=workshop-title] ol li h3");
  t("workshop: tres pasos con el texto pedido", JSON.stringify(await steps.allInnerTexts()) === JSON.stringify(["Detectá oportunidades de IA en tu empresa", "Conocé casos de uso aplicables a tu equipo", "Definí cómo llevarlos a la práctica"]));
  t("workshop: cada paso con icono oficial cargado", await p.locator("section[aria-labelledby=workshop-title] ol .icon img").evaluateAll((l) => l.length === 3 && l.every((i) => i.complete && i.naturalWidth > 0)));

  // ---- 4. Formulario (inmediatamente después de las tarjetas)
  const form = p.locator("section[aria-labelledby=workshop-title] form");
  t("formulario: está dentro de la banda del workshop, antes de los tres pasos", (await form.count()) === 1 && (await p.locator("section[aria-labelledby=workshop-title] ol").evaluate((ol) => !!(document.querySelector("section[aria-labelledby=workshop-title] form").compareDocumentPosition(ol) & Node.DOCUMENT_POSITION_FOLLOWING))));
  t("banda: fondo con foto tratada (pseudo-elemento) y palabra clave 'empresa' en degradado", /url\(/.test(await p.locator("section[aria-labelledby=workshop-title]").evaluate((e) => getComputedStyle(e, "::before").backgroundImage)) && (await p.locator("#workshop-title em").innerText()) === "empresa" && /gradient/.test(await p.locator("#workshop-title em").evaluate((e) => getComputedStyle(e).backgroundImage)));
  const email = p.getByLabel("Correo corporativo");
  const submit = p.getByRole("button", { name: "Registrarme al Workshop" });
  t("formulario: campo con etiqueta 'Correo corporativo' y botón 'Registrarme al Workshop'", (await email.isVisible()) && (await submit.isVisible()));
  t("formulario: tipo email, autocomplete y requerido", (await email.getAttribute("type")) === "email" && (await email.getAttribute("autocomplete")) === "email" && (await email.getAttribute("required")) !== null);

  await email.focus();
  t("formulario: foco visible (anillo)", (await email.evaluate((e) => getComputedStyle(e).boxShadow)) !== "none");
  await submit.click();
  t("error: vacío muestra mensaje, marca aria-invalid y devuelve el foco al campo", (await p.getByRole("alert").innerText()).includes("Ingresa tu correo corporativo") && (await email.getAttribute("aria-invalid")) === "true" && (await email.evaluate((e) => e === document.activeElement)));
  t("error: el campo se asocia al mensaje (aria-describedby)", await email.evaluate((e) => !!document.getElementById(e.getAttribute("aria-describedby"))?.textContent));
  await sleep(300);
  t("error: borde de error (coral legible sobre el fondo morado)", (await email.evaluate((e) => getComputedStyle(e).borderColor)) === "rgb(255, 138, 122)");
  await email.fill("sin-arroba");
  t("error: al escribir, el error se limpia", (await email.getAttribute("aria-invalid")) === null);
  await submit.click();
  t("error: formato inválido", (await p.getByRole("alert").innerText()).includes("correo válido"));
  await email.fill("persona@gmail.com"); await submit.click();
  t("error: correo personal (gmail) rechazado", (await p.getByRole("alert").innerText()).includes("correo corporativo, no uno personal"));
  await email.fill("persona@empresa.com"); await submit.click(); await sleep(150);
  t("válido: sin destino configurado avisa que el registro no está habilitado (no simula éxito)", (await p.getByRole("status").last().innerText()).includes("aún no está habilitado") && (await email.getAttribute("aria-invalid")) === null);
  t("sin errores de consola", p.errors.length === 0, p.errors.join(" | "));


  // ---- 5. Próximos workshops (tarjeta de evento)
  const ev = p.locator("section[aria-labelledby=events-title]");
  t("eventos: encabezado 'Descubre nuestros workshops' y etiqueta 'Próximos workshops'", (await ev.locator("#events-title").innerText()).trim() === "Descubre nuestros workshops" && (await ev.getByText("Próximos workshops", { exact: true }).count()) === 1);
  const card = ev.locator("li").first();
  const ct = (await card.innerText()).replace(/\s+/g, " ");
  t("eventos: dos tarjetas, la segunda 'Próximamente'", (await ev.locator("li").count()) === 2 && (await ev.locator("li").nth(1).innerText()).includes("Próximamente"));
  t("eventos: globo plexus decorativo (canvas aria-hidden con tamaño)", await ev.locator("canvas[aria-hidden=true]").evaluateAll((l) => l.length === 1 && l[0].clientWidth > 100 && l[0].clientHeight > 100));
  t("eventos: tarjeta con NOV 26, título y modalidad", /26/.test(ct) && /NOV/.test(ct) && ct.includes("AI para equipos comerciales") && ct.includes("Sesión Presencial INCAF"), ct);
  t("eventos: título como h3 y fecha destacada (>= 40 px)", (await card.locator("h3").innerText()) === "AI para equipos comerciales" && parseFloat(await card.locator(".day").evaluate((e) => getComputedStyle(e).fontSize)) >= 40);
  t("eventos: CTA 'Registrarme' lleva al registro", (await card.getByRole("link", { name: "Registrarme" }).getAttribute("href")) === "#workshop-title");
  t("eventos: va inmediatamente después del bloque del workshop", await p.evaluate(() => document.querySelector("section[aria-labelledby=workshop-title]").nextElementSibling === document.querySelector("section[aria-labelledby=events-title]")));

  // ---- 6. Casos de éxito (carrusel)
  const cs = p.locator("section[aria-labelledby=cases-title]");
  t("casos: título exacto con énfasis", (await cs.locator("#cases-title").innerText()).replace(/\s+/g, " ").trim() === "Empresas que llevan la formación a resultado" && (await cs.locator("#cases-title strong").innerText()) === "la formación a resultado");
  t("casos: 5 casos y 5 pestañas con el logo de cada empresa", (await cs.locator("[role=tabpanel]").count()) === 5 && JSON.stringify(await cs.locator("[role=tab]").evaluateAll((l) => l.map((e) => e.getAttribute("aria-label")))) === JSON.stringify(["Coderland", "Vidri", "CBC", "Telus", "Casa Muñoz"]));
  t("casos: fondo con foto tratada en morado (pseudo-elemento con velo)", /url\(/.test(await cs.locator("#cases-title").evaluate((e) => getComputedStyle(e.closest("section"), "::before").backgroundImage)));
  const visibleCase = async () => cs.locator("[role=tabpanel]").evaluateAll((l) => l.filter((e) => getComputedStyle(e).visibility === "visible").map((e) => e.querySelector(".badge").textContent));
  t("casos: arranca en Coderland con una sola diapositiva visible", JSON.stringify(await visibleCase()) === JSON.stringify(["CODERLAND - PANAMÁ"]));
  await cs.getByRole("tab", { name: "Vidri" }).click(); await sleep(700);
  t("casos: la pestaña Vidri muestra su texto y cifras", JSON.stringify(await visibleCase()) === JSON.stringify(["VIDRI - EL SALVADOR"]) && (await cs.getByText("+40 profesionales").isVisible()) && (await cs.getByText("8 casos de uso de IA implementados").isVisible()));
  await cs.getByRole("tab", { name: "CBC" }).click(); await sleep(700);
  t("casos: CBC", (await cs.getByText("30 familias impactadas").isVisible()) && (await cs.getByText(/familia de tu equipo/).isVisible()));
  await cs.getByRole("tab", { name: "Telus" }).click(); await sleep(700);
  t("casos: Telus", (await cs.getByText("TELUS DIGITAL").isVisible()) && (await cs.getByText(/reskilling del talento interno/).isVisible()));
  await cs.getByRole("tab", { name: "Casa Muñoz" }).click(); await sleep(700);
  t("casos: Casa Muñoz sobre tarjeta clara como las demás", (await cs.getByText("decisiones 22X más rápidas").isVisible()) && (await cs.locator("[role=tabpanel]").nth(4).locator("div").first().evaluate((e) => getComputedStyle(e).backgroundColor)) === "rgb(244, 242, 248)");
  await cs.getByRole("tab", { name: "Casa Muñoz" }).focus(); await p.keyboard.press("ArrowRight"); await sleep(700);
  t("casos: la flecha derecha avanza (y vuelve al primero)", JSON.stringify(await visibleCase()) === JSON.stringify(["CODERLAND - PANAMÁ"]) && (await cs.getByRole("tab", { name: "Coderland" }).getAttribute("aria-selected")) === "true");
  t("casos: botón de pausa accesible", (await cs.getByRole("button", { name: "Pausar el carrusel" }).getAttribute("aria-pressed")) === "false");
  await cs.getByRole("button", { name: "Pausar el carrusel" }).click();
  t("casos: al pausar cambia a 'Reanudar'", (await cs.getByRole("button", { name: "Reanudar el carrusel" }).getAttribute("aria-pressed")) === "true");
  await cs.getByRole("button", { name: "Reanudar el carrusel" }).click();
  await p.mouse.move(5, 5); await cs.getByRole("tab", { name: "Coderland" }).click(); await p.mouse.move(5, 5); await sleep(7800);
  t("casos: avanza solo tras ~7 s (carrusel automático)", JSON.stringify(await visibleCase()) === JSON.stringify(["VIDRI - EL SALVADOR"]), JSON.stringify(await visibleCase()));
  t("casos: va después de los próximos workshops", await p.evaluate(() => document.querySelector("section[aria-labelledby=events-title]").nextElementSibling === document.querySelector("section[aria-labelledby=cases-title]")));
  t("casos: los 11 resultados van como tarjetas iguales con visto", (await cs.locator("[role=tabpanel] ul li").count()) === 11 && (await cs.locator("[role=tabpanel] ul li .check svg").count()) === 11);

  // ---- 7. Nos adaptamos a tu operación
  const ad = p.locator("section[aria-labelledby=adaptive-title]");
  await ad.scrollIntoViewIfNeeded(); await sleep(1500);
  t("adaptación: título y etiqueta exactos", (await ad.locator("#adaptive-title").innerText()).trim() === "La capacitación se adapta a tu empresa. No al revés." && (await ad.getByText("Nos adaptamos a tu operación", { exact: true }).isVisible()));
  t("adaptación: texto de apoyo", await ad.getByText("Diseñamos horarios, modalidad y ritmo alrededor de la operación de tu equipo. La formación se integra al trabajo, no compite con él.", { exact: true }).isVisible());
  t("adaptación: cuatro ventajas con título y descripción", JSON.stringify(await ad.locator("ul li h3").allInnerTexts()) === JSON.stringify(["Horarios a la medida", "Ritmo adaptable", "Modalidad flexible", "Contenido aplicado"]) && (await ad.getByText("Bloques que respetan la jornada y los picos operativos.", { exact: true }).isVisible()) && (await ad.getByText("Casos y ejercicios aterrizados a la realidad", { exact: true }).isVisible()));
  t("adaptación: iconos oficiales cargados", await ad.locator("ul .icon img").evaluateAll((l) => l.length === 4 && l.every((i) => i.complete && i.naturalWidth > 0)));
  t("adaptación: dos fotos reales cargadas con alt", await ad.locator("img.main, .small img").evaluateAll((l) => l.length === 2 && l.every((i) => i.complete && i.naturalWidth > 0 && i.alt.length > 10)));
  t("adaptación: insignia +360 Empresas capacitadas", (await ad.locator(".badge").innerText()).replace(/\s+/g, " ").includes("+360 Empresas capacitadas"));
  t("adaptación: botón 'Agendar una asesoría' con flecha", await ad.getByRole("link", { name: "Agendar una asesoría" }).locator("svg").count() === 1);
  t("adaptación: cierre 'Formación diseñada alrededor de tu operación' con su texto, debajo del botón", (await ad.getByRole("heading", { name: "Formación diseñada alrededor de tu operación" }).isVisible()) && (await ad.getByText("Definimos contigo cuándo, cómo y con qué ritmo aprende el equipo para que la formación sea sostenible y aplicable.", { exact: true }).isVisible()) && (await ad.evaluate((s) => !!(s.querySelector("a[href^='#']").compareDocumentPosition([...s.querySelectorAll("h3")].pop()) & Node.DOCUMENT_POSITION_FOLLOWING))));
  t("adaptación: foto pequeña flota (upDown)", (await ad.locator(".small").evaluate((e) => getComputedStyle(e).animationName)) !== "none");
  t("adaptación: va justo después de los casos de éxito", await p.evaluate(() => document.querySelector("section[aria-labelledby=cases-title]").nextElementSibling === document.querySelector("section[aria-labelledby=adaptive-title]")));

  // ---- 8. Nuestro equipo
  const tm = p.locator("section[aria-labelledby=team-title]");
  await tm.scrollIntoViewIfNeeded(); await sleep(1500);
  t("equipo: etiqueta, título y texto exactos", (await tm.getByText("Nuestro equipo", { exact: true }).isVisible()) && (await tm.locator("#team-title").innerText()).trim() === "Un equipo que entiende los retos de tu empresa" && (await tm.getByText("Trabajamos contigo para convertir tus necesidades en rutas de formación concretas", { exact: true }).isVisible()));
  const people = tm.locator("article");
  t("equipo: cuatro personas con su cargo", (await people.count()) === 4 && JSON.stringify(await people.evaluateAll((l) => l.map((e) => e.querySelector("h3").textContent + " | " + e.querySelector(".role").textContent))) === JSON.stringify(["Oscar Guzmán | Gerente de Alianzas y Empleabilidad", "Moisés Vega | Consultor de Soluciones Educativas y Tecnológicas", "Adriana Henríquez | Especialista de Empleabilidad Tech", "Evel Castro | Ejecutivo de Cuentas Claves"]));
  t("equipo: cuatro fotos reales cargadas con alt", await tm.locator("article img").evaluateAll((l) => l.length === 4 && l.every((i) => i.complete && i.naturalWidth > 0 && /^Retrato de /.test(i.alt))));
  t("equipo: cada persona tiene su botón de LinkedIn", (await tm.getByText("Ver perfil en LinkedIn").count()) === 4);
  t("equipo: sin URL el botón queda deshabilitado y con nombre accesible claro", (await tm.getByRole("link", { name: /Oscar Guzmán/ }).getAttribute("aria-disabled")) === "true" && (await tm.getByRole("link", { name: /Oscar Guzmán/ }).getAttribute("href")) === null);
  await people.first().hover(); await sleep(300);
  t("equipo: al pasar el cursor la foto hace zoom y aparece el resplandor violeta", (await people.first().locator("img").evaluate((e) => getComputedStyle(e).transform)) !== "none" && Number(await people.first().locator(".glow").evaluate((e) => getComputedStyle(e).opacity)) > 0);
  t("equipo: va justo después del bloque de adaptación", await p.evaluate(() => document.querySelector("section[aria-labelledby=adaptive-title]").nextElementSibling === document.querySelector("section[aria-labelledby=team-title]")));

  // orden de las secciones
  const order = await p.evaluate(() => ["h1", "#impact-title", "#workshop-title", "form"].map((s) => document.querySelector(s)).map((e, i, a) => i === 0 || !!(a[i - 1].compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING)));
  t("orden: banner > cifras > workshop > formulario", order.every(Boolean));
  await p.context().close();
}

for (const width of [360, 768]) {
  const p = await open(width);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await sleep(1200);
  t(`${width}px: sin scroll horizontal`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const box = await p.getByLabel("Correo corporativo").boundingBox();
  const btn = await p.getByRole("button", { name: "Registrarme al Workshop" }).boundingBox();
  t(`${width}px: campo y botón dentro del ancho y con alto táctil >= 48`, box.x >= 0 && box.x + box.width <= width && btn.x + btn.width <= width && btn.height >= 48 && box.height >= 48);
  const cardBox = await p.locator("section[aria-labelledby=events-title] li").first().boundingBox();
  t(`${width}px: tarjeta de evento dentro del ancho`, cardBox.x >= 0 && cardBox.x + cardBox.width <= width);
  const adBox = await p.locator("section[aria-labelledby=adaptive-title] .badge").boundingBox();
  t(`${width}px: insignia y foto de adaptación dentro del ancho`, adBox.x >= 0 && adBox.x + adBox.width <= width);
  t(`${width}px: h1 dentro del ancho`, (await p.locator("h1").boundingBox()).width <= width);
  await p.context().close();
}

{
  // Movimiento reducido: todo visible, formas quietas
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/profesional/alianzas"); await sleep(300);
  t("reducido: las cifras muestran su valor final sin animar", /\+2,800/.test(await p.locator("section[aria-labelledby=impact-title]").innerText()));
  await p.locator("section[aria-labelledby=cases-title]").scrollIntoViewIfNeeded(); await sleep(8000);
  t("reducido: el carrusel NO avanza solo", (await p.locator("section[aria-labelledby=cases-title] [role=tab][aria-selected=true]").getAttribute("aria-label")) === "Coderland");
  t("reducido: las letras del titular del banner no se ensamblan (sin animación)", (await p.locator("section[aria-label='Destacados de Alianzas'] h1 ~ p span span, section[aria-label='Destacados de Alianzas'] p[aria-label] span span").first().evaluate((e) => getComputedStyle(e).animationName)) === "none");
  await ctx.close();
}

await b.close();
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
