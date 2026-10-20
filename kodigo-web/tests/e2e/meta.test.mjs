import { BASE, launchBrowser } from "./_env.mjs";
const base = BASE;
const b = await launchBrowser(); const p = await (await b.newContext()).newPage();
const out = []; const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const desc = () => p.evaluate(() => [...document.querySelectorAll('meta[name="description"]')].map((m) => m.content));
const robots = () => p.evaluate(() => [...document.querySelectorAll('meta[name="robots"]')].map((m) => m.content));
const SITE = "Kodigo: formación en tecnología e inteligencia artificial para El Salvador y Latinoamérica.";
const cases = [["/", SITE], ["/bootcamps", "Programas de formación en IA, datos y desarrollo."], ["/bootcamps/ai-data-trainee", "Desarrolla capacidades de análisis de información y empieza a utilizar IA en tareas relacionadas con datos."],
  ["/nosotros/", "Formamos talento tech en El Salvador y Latinoamérica"], ["/profesional", SITE], ["/profesional/ppd", "Contenido de PPD pendiente de definir."]];
for (const [r, d] of cases) { await p.goto(base + r); await p.waitForTimeout(150); const x = await desc(); t(`descripcion ${r}`, x.length === 1 && x[0] === d, `(${x.length} meta: "${x[0]?.slice(0, 50)}")`); t(`robots ${r}: sin noindex`, (await robots()).length === 0); }
for (const r of ["/bootcamps/no-existe", "/profesional/no-existe", "/ruta-inventada"]) { await p.goto(base + r); await p.waitForTimeout(150); t(`404 ${r}: noindex y descripcion del sitio`, (await robots()).join() === "noindex" && (await desc())[0] === SITE); }
await p.goto(base + "/ruta-inventada"); await p.waitForTimeout(150); await p.getByRole("link", { name: "Volver al inicio" }).click(); await p.waitForTimeout(200);
t("navegar del 404 al inicio quita el noindex", (await robots()).length === 0 && (await p.title()) === "Kodigo | Bootcamps de tecnología e IA");
await p.getByRole("link", { name: "Explorar bootcamps" }).click(); await p.waitForTimeout(200);
t("navegacion cliente actualiza la descripcion", (await desc())[0] === "Programas de formación en IA, datos y desarrollo." && (await desc()).length === 1);
await b.close(); process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
