# Pruebas

```bash
npm test               # importador + producción (`serve`) + modo demo; es lo que corre el CI
npm run test:content   # solo el importador de bootcamps (rápido, sin navegador)
npm run test:e2e       # build + vista previa de Vite + pruebas de navegador + apagado del servidor
npm run test:demo      # construye con `--mode demo` (contenido de EJEMPLO) y corre demo + a11y-axe + responsive
npm run test:e2e:prod  # igual, pero sirve dist/ con `serve` (como Railway) y activa deploy.test
npm run test:e2e -- nav meta        # solo las pruebas cuyo nombre contenga "nav" o "meta"
npm run test:e2e -- --skip-build    # reutiliza dist/
```

Antes de dar por cerrado cualquier ticket: `npm run lint`, `npx tsc -b` y `npm test`.

## Requisitos

- Un navegador instalado. Por defecto **Microsoft Edge** (no se descarga nada).
  - `E2E_BROWSER_CHANNEL=chrome` usa Google Chrome.
  - `E2E_BROWSER_CHANNEL=chromium` usa el Chromium de Playwright (`npx playwright-core install chromium`; típico en CI Linux).
- Puerto libre `4173` (cámbialo con `E2E_PORT`).

## Qué cubre `tests/e2e`

| Archivo | Cubre |
|---|---|
| `nav.test` | Menú de escritorio y móvil: hover, clic, Enter, Escape, clic fuera, Tab, navegación, estado activo |
| `routes.test` | Las 17 rutas cargan, 4 URLs inválidas dan 404, listado y menú coinciden con los datos, atrás/adelante, scroll |
| `effects.test` | Efectos y tarjetas de Eduhall: títulos con bounce, icono con flipInY, formas animadas de las cabeceras, tarjeta con zoom de imagen y sombra suave, sin desbordes con las entradas laterales, y todo quieto/visible con movimiento reducido |
| `motion.test` | Entradas al hacer scroll, formas flotantes, **contenido visible con movimiento reducido**, escalonado, CLS, hover |
| `meta.test` | Título, meta descripción y `noindex` en los 404 por ruta |
| `a11y-fixes.test` | Títulos únicos, enlace "Saltar al contenido", orden de encabezados |
| `a11y-axe.test` | Escaneo axe-core (WCAG 2.0/2.1/2.2 AA + buenas prácticas) en todas las rutas, escritorio y móvil, con menús abiertos |
| `responsive.test` | 17 rutas a 360/768/1024/1440 px: sin desborde horizontal, h1 dentro del ancho, modo de menú correcto, main/footer |
| `deploy.test` | Solo con `--prod`: reescritura SPA en URLs directas, sin listado de archivos, 404 reales, redirecciones de `/index`, caché, gzip y cabeceras de seguridad |
| `no-demo.test` | **Guarda:** el contenido de EJEMPLO no está en el bundle de producción ni se ve en el sitio normal |
| `demo.test` | Solo con `--demo`: banner y `noindex`, orden de secciones, FAQ con teclado, marquesina (se mueve, se pausa, movimiento reducido), cifras que cuentan, Nosotros, Alianzas, detalle con datos, encabezados y desborde en móvil |
| `detail.test` | Página de detalle de bootcamp en el estado publicado (sin datos oficiales), migas de pan |
| `icons.test` | Iconos de beneficios |

`tests/content/import.test.mjs` prueba el importador de `content/bootcamps.csv` (formatos de Excel, comillas, 16 entradas inválidas que deben fallar sin escribir, protección de slugs públicos).

## Accesibilidad sin tolerancias

`a11y-axe.test` falla con **cualquier** violación: el contraste de marca (X-07) ya está resuelto con los tonos AA del tema. No hay lista de excepciones.

## Limitaciones

- `detail.test` solo verifica el estado **sin datos**. Los estados con datos (panel lateral, temario, botón de inscripción) se verificaron manualmente con datos temporales; al recibir el contenido oficial conviene añadir una prueba que cargue un CSV de ejemplo mediante el importador a un JSON temporal.
- No hay pruebas de lector de pantalla ni de rendimiento (se midieron una vez, ver `docs/FRONTEND_PRD.md`, W-12).
