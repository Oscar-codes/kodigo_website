# Despliegue: GitHub + Railway

Estado: la configuración está lista y **verificada localmente**. Lo que ocurre dentro de GitHub y Railway
(primer CI, primer despliegue, dominio) **no se ha podido probar** desde este equipo; está marcado abajo.

## Cómo está armado

| Pieza | Archivo | Qué hace |
|---|---|---|
| Build | `nixpacks.toml` | `npm ci --include=dev` y `npm run build` (vite y typescript están en devDependencies) |
| Arranque | `package.json` → `start` | `serve dist`: servidor estático que respeta la variable `PORT` que inyecta Railway |
| Servidor | `public/serve.json` (se copia a `dist/`) | Reescritura SPA, redirecciones de `/index`, sin listado de directorios, caché, cabeceras de seguridad |
| Salud | `railway.json` | Healthcheck en `/` y reinicio ante fallos |
| Node | `package.json` → `engines`, `.nvmrc` | Node 20 |
| CI | `.github/workflows/ci.yml` | lint, typecheck, validación de contenido y `npm test` en cada push a `main` y en cada PR |

## Pasos para publicar

1. **Subir el código a GitHub** (desde `kodigo-web/`, que ya es un repositorio git):
   ```bash
   git remote add origin https://github.com/<ORG>/<REPO>.git
   git push -u origin main
   ```
2. **Primer CI:** en la pestaña *Actions* debe aparecer el workflow `CI` en verde. *(No verificado: es la primera vez que corre en GitHub.)*
3. **Railway:** *New Project → Deploy from GitHub repo →* elegir el repositorio. Railway detecta `nixpacks.toml` y `railway.json`. No hay variables de entorno que configurar (`PORT` lo pone Railway). *(No verificado en Railway.)*
4. **Que el despliegue espere al CI:** en los ajustes del servicio de Railway, activar la opción que hace esperar a los checks de GitHub ("Wait for CI"), para que un commit con pruebas en rojo no se publique. Los nombres del menú pueden variar.
5. **Dominio:** generar el dominio de Railway para probar; luego añadir `kodigo.org` (o el subdominio elegido) en *Settings → Networking → Custom Domain* y crear en el DNS el registro que Railway indique. Hasta decidir el dominio, el sitio **no debe indexarse** como definitivo.

## Qué se verificó localmente (con el mismo servidor que usará Railway)

`npm run test:e2e:prod` sirve `dist/` con `serve` y comprueba, además de todas las pruebas de navegador:

- La raíz y las rutas internas (`/bootcamps/ai-data-trainee`, `/nosotros/`…) devuelven la SPA con 200; abrir una URL interna directamente funciona.
- **La raíz nunca muestra el listado de archivos del servidor.** Esto falló en una configuración intermedia y quedó cubierto por una prueba.
- Archivos o assets inexistentes devuelven 404 real (no HTML con 200).
- `/index.html` e `/index` redirigen a `/` sin pasar por la página 404 de la SPA.
- Assets con hash: `Cache-Control: public, max-age=31536000, immutable` y gzip (238 KB → 79 KB). HTML: `no-cache`.
- Cabeceras: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.

## Limitaciones conocidas

- **404 blando:** las rutas desconocidas devuelven HTTP 200 con la página "no encontrada" de la SPA (con `noindex`). Es el comportamiento estándar de una SPA; un 404 HTTP real exigiría renderizado en servidor.
- **Sin Content-Security-Policy:** no se añadió porque styled-components inyecta estilos en línea y una CSP mal calibrada rompería el sitio. Conviene definirla cuando estén fijos los orígenes de fuentes, analítica e imágenes.
- **Fuente Matimo:** sin los `.woff2` en `public/fonts/` el navegador pide los tres archivos y recibe 404; el sitio usa la fuente de sistema hasta que se agreguen (X-01).
- **Sin favicon** hasta recibir el logo oficial (X-02).
- `serve.json` queda accesible públicamente en `/serve.json` (no contiene secretos).
- Si cambia el tamaño o número de assets, revisar el rendimiento: medido 1.0 s de LCP en móvil emulado con la fuente aún ausente (ver `docs/FRONTEND_PRD.md`, W-12).

## Reversión

Railway conserva los despliegues anteriores: se puede redesplegar uno anterior desde su panel. En git, revertir el commit y subir a `main`.
