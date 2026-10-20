# Contenido de los bootcamps

El archivo [bootcamps.csv](bootcamps.csv) es la plantilla para cargar el contenido oficial de cada bootcamp.
Se abre con Excel o Google Sheets. **Una fila = un bootcamp.** No cambies los nombres de las columnas.

## Columnas

| Columna | Obligatoria | Qué poner | Ejemplo |
|---|---|---|---|
| `slug` | Sí | Parte final de la URL: minúsculas, números y guiones. **No lo cambies** en los bootcamps existentes (cambiaría su dirección web) | `sql-ai` |
| `name` | Sí | Nombre oficial del bootcamp | `SQL AI` |
| `area` | Sí | Una de: `IA`, `Datos`, `Desarrollo`, `Educación` | `Datos` |
| `summary` | Sí | Descripción corta (1 o 2 frases). Aparece en el listado y en Google | `SQL y bases de datos con apoyo de IA.` |
| `duration` | No | Duración | `8 semanas` |
| `modality` | No | Modalidad | `Virtual en vivo` |
| `level` | No | Nivel | `Inicial` |
| `requirements` | No | Requisitos separados por `;` | `Computadora; Internet estable` |
| `syllabus` | No | Temario (ver formato abajo) | `Fundamentos: Consultas; Filtros \| Modelado: Joins` |
| `enrollmentUrl` | No | Enlace de inscripción de ESE bootcamp (debe empezar con `https://`) | `https://forms.example.com/sql-ai` |

Lo que dejes vacío **no se muestra** en la página (no aparecen títulos vacíos). Si un bootcamp no tiene
ningún dato de detalle, la página muestra "se publicarán próximamente".

## Formato del temario (`syllabus`)

- Los **módulos** se separan con ` | ` (barra vertical).
- Dentro de cada módulo: `Título del módulo: tema 1; tema 2; tema 3`.
- Un módulo puede ir sin temas: solo el título.
- No repitas módulos ni temas dentro de un mismo bootcamp.

Ejemplo: `Fundamentos: Consultas básicas; Filtros | Modelado: Joins; Subconsultas | Proyecto final`

## Cómo se carga (para quien tenga acceso al proyecto)

```bash
npm run content:check    # solo valida y explica los errores, no cambia nada
npm run content:import   # valida y actualiza src/data/bootcamps.json
```

El importador se detiene **sin cambiar nada** si encuentra un problema, e indica la fila y la causa
(por ejemplo: área no válida, slug repetido, URL sin `https://`, módulos repetidos).

- **Orden:** el orden de las filas es el orden en que aparecen los bootcamps en el sitio.
- **Agregar un bootcamp:** añade una fila con un `slug` nuevo.
- **Quitar un bootcamp:** el importador lo bloquea porque su URL dejaría de existir. Si es intencional: `node scripts/import-bootcamps.mjs --allow-removal`.
- **Excel en español** guarda CSV con `;` como separador y con BOM: el importador lo reconoce. Guarda como "CSV UTF-8".

## Pendiente de confirmar

- Python Analyst, SQL AI y Full Stack Jr salieron del listado (no tienen formulario de HubSpot); en su lugar están Gen AI Skills, Claude y AI for Developers Jr. Sus URLs anteriores ya no existen.
- Las descripciones (`summary`) actuales son **provisionales**: reemplázalas con las oficiales.

---

# Aliados (`partners.csv`)

`partners.csv` define los **logos de aliados** que se muestran en Alianzas (rejilla) y en Inicio (franja).
Una fila = un aliado. Los logos originales viven en la carpeta `Recursos kodigo/ALIANZAS ACTIVAS - WEBSITE`
(fuera del repositorio).

| Columna | Qué poner |
|---|---|
| `file` | Nombre del archivo del logo en esa carpeta (da igual mayúsculas o espacios raros) |
| `name` | Nombre del aliado: es el texto alternativo del logo (lo que leen los lectores de pantalla) |
| `url` | Opcional. Sitio del aliado (`https://...`). Con URL el logo es un enlace; sin URL, solo imagen |
| `notes` | Opcional. Comentarios internos (no se publican) |

Para agregar, quitar o corregir un aliado: edita el CSV y ejecuta `npm run assets:build`. El script recorta los márgenes
de cada logo, lo normaliza y regenera `src/data/partners.json`. El orden de las filas es el orden en el sitio.

Los nombres actuales se leyeron de los propios logos y de los nombres de archivo: **revísalos**. Las filas con
observaciones en `notes` necesitan confirmación (por ejemplo Tigo y el Ministerio de Salud).
