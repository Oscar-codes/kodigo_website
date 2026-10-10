// Verifica la configuración de servidor de producción (Railway: `serve dist` + public/serve.json).
// Solo corre con `npm run test:e2e -- --prod`; con la vista previa de Vite no aplica.
import { BASE } from "./_env.mjs";

if (!process.env.E2E_PROD) {
  console.log("INFO  deploy: omitido (usa `npm run test:e2e -- --prod`)");
  process.exit(0);
}

const out = [];
const t = (n, ok, x = "") => { const r = `${ok ? "PASS" : "FAIL"}  ${n} ${x}`; out.push(r); console.log(r); };
const get = (path, init = {}) => fetch(BASE + path, { redirect: "manual", ...init });
const isSpa = async (res) => (await res.text()).includes('<div id="root">');

// --- la raíz y las rutas internas entregan la SPA (reescritura), nunca un listado de archivos
{
  const r = await get("/"); const body = await r.text();
  t("raíz: 200 con la SPA", r.status === 200 && body.includes('<div id="root">'));
  t("raíz: NO muestra listado de archivos del servidor", !/Files within|Index of/i.test(body));
}
for (const path of ["/bootcamps", "/bootcamps/sql-ai", "/bootcamps/full-stack-jr", "/nosotros/", "/nosotros", "/profesional", "/profesional/ppd", "/ruta-inventada"]) {
  const r = await get(path);
  t(`ruta directa ${path}: 200 con la SPA`, r.status === 200 && (r.headers.get("content-type") ?? "").includes("text/html") && (await isSpa(r)));
}
for (const start of ["/index.html", "/index"]) {
  // Sigue la cadena de redirecciones a mano (serve normaliza .html y luego aplica la regla).
  let path = start, hops = 0, status = 0;
  while (hops < 4) {
    const r = await get(path); status = r.status;
    if (status >= 300 && status < 400) { path = new URL(r.headers.get("location"), BASE).pathname; hops++; } else break;
  }
  t(`${start} termina en la raíz (sin pasar por la página 404 de la SPA)`, path === "/" && status === 200 && hops >= 1 && hops <= 2, `(${hops} redirección(es) -> ${path}, ${status})`);
}

// --- directorios sin listado; archivos inexistentes dan 404 real (no HTML con 200)
for (const path of ["/assets", "/assets/", "/fonts/"]) {
  const body = await (await get(path)).text();
  t(`directorio ${path}: sin listado de archivos`, !/Files within|Index of/i.test(body));
}
for (const path of ["/assets/no-existe.js", "/fonts/no-existe.woff2", "/favicon-que-no-existe.ico"]) {
  const r = await get(path);
  t(`archivo inexistente ${path}: 404`, r.status === 404, `(${r.status})`);
}

// --- caché y cabeceras
const html = await (await get("/")).text();
const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
t("el HTML referencia un bundle con hash en /assets", Boolean(asset), `(${asset})`);
const ra = await get(asset, { headers: { "Accept-Encoding": "gzip" } });
t("asset con hash: caché inmutable de 1 año", /max-age=31536000/.test(ra.headers.get("cache-control") ?? "") && /immutable/.test(ra.headers.get("cache-control") ?? ""), `(${ra.headers.get("cache-control")})`);
t("asset: se sirve comprimido (gzip)", ra.headers.get("content-encoding") === "gzip", `(${ra.headers.get("content-encoding")})`);
const bundleText = await (await get(asset)).text();
const imgUrl = bundleText.match(/\/assets\/[a-z0-9-]+-[A-Za-z0-9_-]{8}\.webp/)?.[0];
const ri = imgUrl ? await get(imgUrl) : null;
t("imágenes con hash (logo/aliados): caché inmutable de 1 año", !!ri && /max-age=31536000/.test(ri.headers.get("cache-control") ?? "") && /immutable/.test(ri.headers.get("cache-control") ?? ""), `(${imgUrl} ${ri?.headers.get("cache-control")})`);
t("imágenes: content-type image/webp", (ri?.headers.get("content-type") ?? "") === "image/webp", `(${ri?.headers.get("content-type")})`);
t("asset: content-type javascript", (ra.headers.get("content-type") ?? "").includes("javascript"));
const rh = await get("/bootcamps");
t("HTML: no-cache (los despliegues nuevos se ven de inmediato)", rh.headers.get("cache-control") === "no-cache", `(${rh.headers.get("cache-control")})`);
for (const [name, res] of [["HTML", rh], ["asset", ra]]) {
  t(`${name}: X-Content-Type-Options nosniff`, res.headers.get("x-content-type-options") === "nosniff");
  t(`${name}: X-Frame-Options DENY`, res.headers.get("x-frame-options") === "DENY");
  t(`${name}: Referrer-Policy`, res.headers.get("referrer-policy") === "strict-origin-when-cross-origin");
}
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
