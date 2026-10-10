> **Estado 2026-10-08:** Matimo **no se usa actualmente**. El diseño sigue a Eduhall, que usa Inter, y el sitio carga Inter
> autoalojada desde `@fontsource-variable/inter` (ver `src/main.tsx`). Esta carpeta solo se usa si Kodigo decide volver a Matimo
> (decisión X-09 en `docs/FRONTEND_PRD.md`): habría que volver a declarar los `@font-face` en `src/styles/GlobalStyle.tsx`.

# Fuente Matimo (ticket W-01, dependencia X-01)

Coloca aquí los archivos de la fuente de marca, con estos nombres exactos:

| Archivo | Peso | Uso |
|---|---|---|
| `Matimo-Regular.woff2` | 400 | Textos |
| `Matimo-SemiBold.woff2` | 600 | Botones y etiquetas |
| `Matimo-Bold.woff2` | 700 | Títulos |

Si solo tienes `.ttf` u `.otf`, conviértelos a `.woff2` (o ajusta el `format()` en `src/styles/GlobalStyle.tsx`).
Confirma que la licencia de Matimo permite uso web.

## Verificación

Con `npm run dev`, en la consola del navegador:

```js
await Promise.all([400, 600, 700].map((w) => document.fonts.load(`${w} 1em Matimo`)));
[...document.fonts].filter((f) => f.family.includes("Matimo")).map((f) => [f.weight, f.status]);
// esperado: tres entradas con status "loaded"
```

Importante: si un archivo falta, Vite responde `index.html` con 200 (no 404) y el navegador lo descarta en silencio
usando la fuente de respaldo. En Network, cada `/fonts/*.woff2` debe mostrar tipo `font`, no `document`;
un `status` distinto de `loaded` indica archivo ausente o corrupto.
