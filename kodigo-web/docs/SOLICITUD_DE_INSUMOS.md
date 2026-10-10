# Solicitud de insumos para el sitio kodigo.org

_Actualizado: 2026-10-08 · Estado de cada ticket: [FRONTEND_PRD.md](FRONTEND_PRD.md)_

El sitio ya está construido y probado. **Ya está integrado lo que enviaron** (logo, favicons, iconos y los 49 logos de aliados).
Para cerrarlo faltan confirmaciones, contenido oficial y algunos archivos que solo Kodigo puede dar.

## Cómo responder (lo más fácil)

Se preparó un Excel con **todo lo recibido a la vista** (logos, retratos, fotos, carteles e iconos incrustados) y celdas amarillas
con listas desplegables Sí/No. Cada área llena solo su hoja y lo devuelve.

> **`Solicitud de insumos/Revision-de-recursos-recibidos.xlsx`** (en la carpeta del espacio de trabajo, junto a `Recursos kodigo/`).
> Está **fuera del repositorio** a propósito: contiene fotografías de personas.

| Hoja | Quién | Qué confirma |
|---|---|---|
| Aliados | Gerencia / Alianzas | Nombre de cada uno de los 49 logos, autorización para mostrarlo y sitio web |
| Equipo | Gerencia / RR. HH. | Nombre completo, cargo y autorización escrita de cada retrato |
| Fotos | Diseño / Marca | Dónde va cada foto, texto alternativo, origen/licencia y permisos |
| Workshops | Gerencia / Marketing | Si habrá sección de eventos y los datos de cada uno (con año) |
| Iconos | Diseño / Marca | A qué corresponde cada icono y si existe versión SVG |
| Formas | Diseño / Marca | En qué sección va cada forma decorativa |
| Pendientes | Todas | Lista de verificación de lo que aún no llega |

Lo que **no** se llena en el Excel (contenido de bootcamps) va en `content/bootcamps.csv`; sus instrucciones están en [content/README.md](../content/README.md).

## Estado de lo recibido (carpeta `Recursos kodigo/`)

| Recurso | Estado | Pendiente |
|---|---|---|
| Logo blanco, logo oscuro, isotipo | **Integrado**: header, footer y favicons | Versión SVG; el logo oscuro aún no se usa |
| 49 logos de aliados | **Integrado**: rejilla en Alianzas y franja en Inicio | Confirmar nombres y autorización (hoja Aliados) |
| 3 iconos lila/blanco | **Integrado** en los beneficios de Inicio | Confirmar el uso; versión SVG (miden 46 px) |
| 4 iconos blancos | Recibidos, sin colocar | Confirmar si son atributos de cada bootcamp |
| Foto del aula (`SCC1/O1`) | **Colocada en el banner de Inicio** (sin publicar) | **Autorización para publicarla**: muestra personas identificables |
| 2 fotos más, 4 retratos, 3 imágenes de workshops, 5 formas | Recibidos, sin colocar | Diseño de referencia (X-08), permisos y datos (hojas respectivas) |
| Fuente Matimo | **No recibida** | Pendiente |
| CSV de bootcamps completado | **No recibido** | Pendiente |

## Lo que falta, por área

### Diseño / Marca
- **Tipografía (X-09):** confirmar Inter (la del diseño de Eduhall, ya en uso) **o** entregar Matimo Regular (400), SemiBold (600) y Bold (700) en `.woff2` con la **confirmación de licencia web** → W-01.
- **Logo e iconos en SVG** (los PNG se ven blandos en pantallas de alta resolución) → W-10.
- **Diseño de referencia** de las secciones `SCC1`…`SCC7` (enlace a Figma/Canva o capturas) para colocar fotos y formas donde se diseñaron → W-05, W-08.
- Hojas **Fotos**, **Iconos** y **Formas** del Excel.

### Académico
- **`content/bootcamps.csv` completado** para los 10 programas (descripción, duración, modalidad, nivel, requisitos, temario, enlace de inscripción) → W-06, W-07.
- **Decisión:** ¿"Full Stack Jr" y "Full Stack AI Jr" son uno o dos programas? → W-04, W-06.

### Gerencia
- Hojas **Aliados**, **Equipo** y **Workshops** del Excel.
- **Texto de "Nosotros"** y **cifras con fuente y fecha** (no se publican números sin respaldo) → W-08.
- **PPD:** qué es, qué debe contener y qué acción se espera → W-09. Texto de introducción de "Alianzas" (opcional).
- Otras subsecciones de "Profesional", **datos de contacto** del pie de página y **páginas legales** (o decisión de no incluirlas aún).
- ¿Se quieren **FAQ**, **testimonios** y "**cómo funciona**"? Si sí, el contenido real (testimonios con autorización).

### Tecnología / Infraestructura
- **Repositorio de GitHub** (para el primer `push` y ver el CI) y **proyecto de Railway** con acceso → W-12. Guía: [DEPLOY.md](DEPLOY.md).
- **Dominio** y quién administra el DNS.
- **Destino de inscripción** (formulario, plataforma o correo; URL `https://`) → W-07.
- ¿Se usará **analítica/cookies**? ¿El sitio debe enlazar al **login de Self-Learning**?

## Preguntas abiertas a partir de lo recibido

1. **Diseño de referencia.** Los archivos vienen nombrados por sección (`SCC1`…`SCC7`) de un diseño que no está en el proyecto: ¿pueden compartirlo?
2. **Equipo (4 retratos).** ¿Qué sección es? Hace falta nombre completo, cargo y **autorización escrita** de cada persona; hoy solo hay nombres de pila.
3. **Workshops.** Cartel "26 de noviembre · IA para equipos comerciales · Sesión presencial INCAF" y una imagen "Próximo workshop · Coming soon": ¿habrá sección de eventos? ¿Año, enlace de registro, quién la mantiene? La foto base del cartel está marcada como generada con Gemini: confirmar que se quiere publicar.
4. **Derechos de imagen.** La foto de robots tiene nombre de banco de imágenes (confirmar licencia) y la del aula muestra personas identificables (confirmar autorización).
5. **Tigo.** El archivo se llama `Tigo-Bolivia-Logo`: ¿es el logo correcto para El Salvador?
6. **Tipografía.** La guía de marca indica Matimo, pero el diseño de Eduhall (que se decidió seguir) usa Inter, que es lo que el sitio usa hoy. ¿Se confirma Inter o se entrega Matimo (archivos `.woff2` y licencia web)?

---

## Mensajes listos para enviar

**Diseño / Marca**
> Hola equipo. Ya integramos el logo, los favicons, los 3 iconos lila/blanco y los logos de aliados en el sitio. Para terminar necesitamos:
> (1) la fuente Matimo (Regular, SemiBold y Bold, .woff2) y confirmar que su licencia permite uso web; (2) el logo y los iconos en SVG; (3) el diseño de referencia (Figma/Canva) de las secciones SCC1–SCC7 para colocar las fotos y formas donde se diseñaron.
> Además, en el Excel adjunto (hojas Fotos, Iconos y Formas) confirmen dónde va cada pieza y el origen/licencia de las fotos. ¡Gracias!

**Académico**
> Hola. Para publicar las páginas de los bootcamps necesitamos que completen el archivo content/bootcamps.csv (una fila por programa; las instrucciones están en content/README.md): descripción corta oficial, duración, modalidad, nivel, requisitos, temario y enlace de inscripción. Lo que dejen vacío no se muestra. También necesitamos saber si "Full Stack Jr" y "Full Stack AI Jr" son un programa o dos. ¡Gracias!

**Gerencia**
> Hola. El sitio ya muestra los 49 logos de aliados. Les pedimos revisar el Excel adjunto, hojas Aliados, Equipo y Workshops: (1) confirmar el nombre de cada aliado y que autoriza mostrar su logo; (2) para los 4 retratos, nombre completo, cargo y autorización escrita; (3) decirnos si habrá sección de talleres. Además necesitamos el texto de "Nosotros", las cifras a destacar con su fuente y fecha, qué debe contener la sección PPD, los datos de contacto y las páginas legales. No publicaremos logos, fotos ni cifras sin esta confirmación.

**Tecnología**
> Hola. El sitio está listo para publicarse (probado localmente, con CI y configuración de Railway incluidas). Necesitamos: (1) un repositorio de GitHub y acceso para subir el código y ver el primer CI; (2) un proyecto de Railway con acceso a ese repositorio; (3) el dominio y quién administra el DNS; (4) el destino de inscripción (URL https://); (5) si se usará analítica/cookies y si debe enlazar a Self-Learning. La guía paso a paso está en docs/DEPLOY.md.

## Qué se hace cuando llegan las respuestas

- **Excel de aliados:** se actualizan nombres y enlaces en `content/partners.csv`, se retiran los logos sin autorización y se ejecuta `npm run assets:build`.
- **Retratos y fotos:** solo se publican los que tengan nombre, cargo, texto alternativo y autorización; se optimizan con el mismo script.
- **CSV de bootcamps:** `npm run content:check` valida y `npm run content:import` carga; se verifica cada página en el navegador.
- **Fuente, SVG y logos nuevos:** se integran y se repiten las pruebas de accesibilidad y rendimiento (`npm test`).
- Después, la **revisión interna final** (W-QA-01): una lista única y priorizada de comentarios; tras ella solo entran correcciones.
