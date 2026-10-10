# Kodigo Web (kodigo.org)

Sitio corporativo de Kodigo. React 18 + TypeScript + Vite + React Router 7 + styled-components.
Diseño: sigue la plantilla Eduhall (`../eduall`), variante Home 3 "University", con el violeta de Kodigo como color principal y tipografía Inter. Se recrea en styled-components: no se copia su CSS ni Bootstrap (ver `docs/EDUHALL_ADAPTATION_PLAN.md`).

## Comandos

```bash
npm install
npm run dev            # desarrollo
npm run build          # build de producción en dist/
npm start              # sirve dist/ (como en Railway)
npm run lint           # ESLint
npx tsc -b             # typecheck
npm test               # importador de contenido + build + pruebas de navegador contra el servidor de producción
npm run content:check  # valida content/bootcamps.csv sin cambiar nada
npm run content:import # carga content/bootcamps.csv en src/data/bootcamps.json

npm run assets:build   # optimiza logos/iconos/favicons desde la carpeta de recursos (ver content/README.md)
npm run dev:demo       # MODO DEMOSTRACIÓN: contenido de EJEMPLO para ver el sitio completo (aviso visible, noindex)
npm run test:demo      # pruebas del modo demostración
```

Antes de dar algo por terminado: `npm run lint`, `npx tsc -b` y `npm test`. Detalles en [tests/README.md](tests/README.md).

## Estructura

```
src/
  components/{ui,layout,sections}   piezas reutilizables (todo con styled-components)
  pages/                            una página por ruta
  data/                             contenido: bootcamps.json (generado), navigation, professional, site
  hooks/                            useInView, usePageMeta
  styles/                           tema (colores, movimiento, breakpoints) y reset global
content/                            plantilla CSV para cargar el contenido de los bootcamps
scripts/                            importador de contenido y ejecutor de pruebas
tests/                              pruebas de navegador (e2e) y del importador
docs/                               PRD vivo, plan de adaptación de Eduhall, despliegue
.agents/skill/                      skills para trabajar el proyecto con agentes
```

## Documentos

- [docs/FRONTEND_PRD.md](docs/FRONTEND_PRD.md): estado real de cada ticket (W-01 a W-12), bloqueos y registro de cambios.
- [docs/EDUHALL_ADAPTATION_PLAN.md](docs/EDUHALL_ADAPTATION_PLAN.md): qué se adapta de Eduhall y qué no.
- [docs/DEPLOY.md](docs/DEPLOY.md): GitHub + Railway.
- [content/README.md](content/README.md): cómo cargar el contenido de los bootcamps.
- [docs/SOLICITUD_DE_INSUMOS.md](docs/SOLICITUD_DE_INSUMOS.md): qué falta recibir de cada área para cerrar el sitio.

## Modo demostración

El sitio real solo muestra secciones cuyo contenido oficial ya existe (cifras, aliados, FAQ, testimonios, pasos).
Para ver cómo quedará completo existe el modo demo (`npm run dev:demo`, `npm run build:demo`): carga textos **de ejemplo**
de `src/data/demo/`, muestra un aviso en todas las páginas y envía `noindex, nofollow`. **No se incluye en el build de
producción** (`tests/e2e/no-demo.test.mjs` lo verifica en cada ejecución). Nunca publiques `dist-demo/`.

Para cargar contenido oficial edita `src/data/content.ts` (y el CSV de bootcamps); las secciones aparecen solas.

## Reglas del proyecto

- Estilos solo con styled-components y los tokens del tema (`src/styles/theme.ts`, medidos de Eduhall). Sin Bootstrap ni Tailwind.
- El contenido vive en `src/data`, no dentro del JSX. No se inventa contenido: lo provisional se marca `PROVISIONAL`.
- Movimiento: solo `transform` y `opacity`, respetando `prefers-reduced-motion`.
