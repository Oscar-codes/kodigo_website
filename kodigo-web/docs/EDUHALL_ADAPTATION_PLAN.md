# Plan de adaptación de Eduhall a kodigo-web

_Actualizado: 2026-10-08_

**Estado:** Fases A, B (layout), C, D, E (componentes) y G (primera pasada) completadas (ver sección 6). Las fases C a E existen como componentes que solo aparecen cuando hay contenido oficial; se verificaron con contenido de EJEMPLO en modo demo (`npm run dev:demo`). Supuestos tomados al empezar sin respuesta a las decisiones 1 y 4: sistema de movimiento propio (sin AOS) e intensidad discreta.

## 0. Decisión de diseño del 2026-10-08

El diseño visual del sitio **sigue Eduhall (Home 3 "University")**, con el violeta de Kodigo como color principal, recreado en
styled-components (sin Bootstrap ni el CSS de la plantilla). Las secciones 1 a 7 de este documento describen el criterio de
adaptación original (patrón, no código) y siguen vigentes para el código; lo que cambió es el **aspecto**: ahora se copian de la
plantilla las medidas, la tipografía (Inter), la composición y los componentes visuales.

| Elemento de Eduhall | En Kodigo |
|---|---|
| Header claro con borde inferior tenue | `Header` (logo oscuro a color, menú con submenús) |
| Banner oscuro con foto y degradado azul marino | `Hero` (foto del aula `SCC1`, permisos pendientes) |
| Tarjeta blanca superpuesta con 3 tarjetas tintadas | `Benefits` (iconos oficiales sobre baldosa oscura) |
| Sección de cursos | `BootcampShowcase` + `BootcampGrid` (6 tarjetas de la fuente de datos) |
| Cabecera de página centrada con migas | `PageHeader` + `Breadcrumb` |
| Detalle de curso (tarjeta lateral con filas) | `BootcampInfo` |
| Contadores, work process, testimonios, FAQ, marcas | `Stats`, `Steps`, `Testimonials`, `Faq`, `Partners` |
| Banda de llamada a la acción | `CallToAction` (violeta, círculos flotantes) |
| Footer azul marino `#071431` | `Footer` |

**Tarjetas y efectos (2026-10-08).** Se adoptaron los de la plantilla, con sus valores:

| Eduhall | En Kodigo |
|---|---|
| `course-item` (fondo tintado, borde, imagen redondeada, zoom ×1.1) | `BootcampGrid`: degradado por área con isotipo como marca de agua (no hay fotos por programa) |
| `box-shadow-md` y `transition-2` (0.2 s lineal) | `Card` y tokens `theme.shadows.card`, `motion.duration.hover` |
| `item-hover` (el bloque se rellena de color y el texto pasa a blanco) | `Steps` |
| `animate__flipInY` en `animation-item` | iconos de `Benefits` al pasar el cursor |
| `wow bounceInDown / bounceIn / bounceInUp` en los títulos | `SectionTitle` (recorrido acortado a 60 px) |
| AOS `fade-up / fade-left / fade-right / zoom-in` | `Reveal` (direcciones `up`, `down`, `left`, `right`, `zoom`) |
| `upDown`, `scalation`, `roatation` en las formas | `PageHeader` (puntos, aro y rombo) y círculos de `CallToAction` |

No se adoptaron `wobble`, `swing`, `heartbeat` ni el efecto 3D de las imágenes (`data-tilt`). Todo respeta `prefers-reduced-motion`.

Diferencias deliberadas: el naranja y el verde de Eduhall solo se usan como fondos suaves (como texto no alcanzan contraste AA);
el menú del header no incluye buscador ni selector; los iconos oficiales (trazo lila/blanco) van sobre una baldosa oscura.

## 1. Situación actual (hecho verificado)

**(Texto histórico, anterior al 2026-10-08):** `kodigo-web` **no usaba ningún componente, estilo, animación ni asset de Eduhall.** Solo se tomó como referencia estructural la forma del header (logo, menú con submenús, menú móvil) y se reescribió desde cero. Todo lo demás (hero, beneficios, tarjetas, páginas) es diseño nuevo basado en la línea gráfica de Kodigo.

Eso fue deliberado: Eduhall usa Bootstrap, CSS global (`main.css` de ~12 000 líneas, clases utilitarias propias), jQuery-style plugins y colores propios, y el proyecto exige styled-components con tema centralizado. **Pero hay patrones valiosos que aún no aprovechamos**, sobre todo en animación y en secciones que Kodigo necesitará.

## 2. Qué tiene Eduhall (inventario)

| Categoría | Hallazgo |
|---|---|
| Tamaño | 104 componentes, 41 páginas, 6 homes. Unas 45 600 líneas en `components/` |
| Dominio | Plantilla de LMS/tutorías/kínder: mucho contenido que Kodigo no usa (productos, carrito, checkout, tutores premium, eventos, galería, blog) |
| Animación de entrada | AOS, **261 usos de `fade-up`** (59 `fade-left`, 30 `fade-up-left`, 14 `fade-right`, 14 `fade-down`, 12 `zoom-in`), duración 1200 ms, `once: true` |
| Animación de formas | Keyframes CSS propios: `upDown` (flotar ±20 px), `scalation`, `roatation`, `walking`, `wobble`, `swing`, `flipInY`, `bounce`, `heartbeat`, `textRotation`, `showHide*` |
| Otras animaciones | clases `wow bounce*` (WOW.js + animate.css), `data-tilt` (efecto 3D), `animation-item` (hover de tarjeta, 109 usos) |
| Librerías de terceros | react-slick (17 archivos), react-countup (10), react-intersection-observer (10), react-modal-video (7), react-select, react-slider, react-fast-marquee, lightgallery, AOS |
| Assets | 2.9 MB en `public/assets/images` (formas PNG, fondos, iconos, thumbs) con la paleta de Eduhall |
| Helpers | `Animation` (init AOS), `Preloader`, `RouteScrollToTop` |

## 3. Principios de adaptación

1. **Se adopta el patrón, no el código.** Cada elemento se reescribe en TypeScript + styled-components con tokens del tema.
2. **Cero dependencias nuevas** salvo justificación escrita. AOS, slick, countup, modal-video, lightgallery, WOW.js, animate.css y vanilla-tilt **no se instalan**: sus efectos se reproducen con CSS `keyframes` e `IntersectionObserver` nativos.
3. **Solo se anima `transform` y `opacity`** (sin saltos de layout) y todo respeta `prefers-reduced-motion`.
4. **Un estado oculto nunca queda atrapado.** El estado inicial "invisible" solo se aplica dentro de `@media (prefers-reduced-motion: no-preference)`; con movimiento reducido o sin JS el contenido se ve de inmediato. (Importante: el reset global ya anula animaciones en movimiento reducido; si el estado oculto estuviera fuera de esa media query, el contenido quedaría invisible.)
5. **Assets:** no se publican PNG de Eduhall como identidad de Kodigo. Se redibujan como SVG con la paleta de Kodigo. Antes de reutilizar cualquier imagen, verificar la licencia de la plantilla adquirida.
6. **Contenido real:** ninguna sección se publica con texto, cifras o logos inventados.

## 4. Qué adaptar y a qué ticket pertenece

| Eduhall (fuente) | Uso en Kodigo | Ticket | Qué se toma | Qué se descarta | Requiere |
|---|---|---|---|---|---|
| `BannerOne/Two` (formas flotantes) | Hero de la Home | W-05 | Formas geométricas que flotan lento (`upDown`) con baja opacidad | Imágenes PNG, ilustraciones infantiles | SVG de formas propias |
| `FeaturesOne`, `ChooseUsOne` | Beneficios de la Home | W-05 | Tarjetas con icono, hover que eleva y cambia borde | Slider (slick), video modal | X-02 (iconos), copy oficial |
| `WorkProcessOne` | "Cómo funciona / ruta de aprendizaje" (Home o detalle de bootcamp) | W-05 / W-07 | 3 o 4 pasos numerados con insignia y entrada escalonada | Iconos PNG, Bootstrap grid | Pasos reales (X-04) |
| `CourseDetails` | Layout del detalle de bootcamp | W-07 | Estructura: resumen, temario, panel lateral de datos y botón de inscripción | Reseñas, carrito, precios, instructor card | X-03, X-06 |
| `CounterOne` | Cifras de Nosotros (graduados, aliados, etc.) | W-08 | Conteo animado al entrar en pantalla | `react-countup`, `react-intersection-observer` (se reescribe con un hook propio) | Cifras reales (X-04) |
| `AboutOne/Two/Three` | Nosotros | W-08 | Composición texto + imagen + datos | Imágenes de plantilla | X-04 |
| `BrandOne`, `MarqueeOne` | Franja de aliados | W-09 | Carrusel continuo de logos (marquee CSS) | `react-slick`, `react-fast-marquee` | Logos de aliados (X-04) |
| `Breadcrumb` | Migas de pan en detalle de bootcamp y subsecciones | W-07 / W-09 | Patrón semántico (`nav` + `ol`) | Banner decorativo | Ninguno |
| `FaqOne`, `FAQInnerOne` | Preguntas frecuentes (Home o detalle) | FE-GAP-006 | Acordeón con entrada escalonada | Bootstrap collapse y `data-bs-*` (se hace con `<details>` o estado React) | Preguntas reales |
| `TestimonialsOne..Five` | Testimonios | FE-GAP-007 | Tarjetas de testimonio | Carrusel slick (usar rejilla o `scroll-snap`) | Testimonios reales |
| `ApplyForAdmission`, `ContactInner` | Formulario de captación | FE-GAP-001 | Estructura de campos, validación visual | Campos irrelevantes, jQuery | Destino (X-06) y campos definidos |
| `FooterOne` | Footer ampliado | W-03 (mejora) | Columnas, redes, contacto | Newsletter de plantilla | Datos de contacto |
| `InstructorOne`, `FacultyOne` | Equipo docente | Futuro | Tarjeta de persona | — | Fuera del alcance actual |
| `Preloader` | — | No adaptar | — | Empeora la carga percibida | — |

**Fuera de alcance (no se adapta):** blog, productos, carrito, checkout, tutores premium, eventos, galería, planes de suscripción, kids, políticas de plantilla, sign-in/sign-up (hasta definir FE-GAP-002).

## 5. Sistema de movimiento (nuevo, FE-GAP-005)

Reemplaza AOS/WOW/animate.css con piezas propias y pequeñas.

**Tokens en `theme.ts`:** duraciones (`fast` 150 ms, `base` 300 ms, `reveal` 600 ms), curva de easing, distancia de desplazamiento (24 px). Eduhall usa 1200 ms; es demasiado lento para una web de conversión.

**Piezas:**
| Pieza | Equivale en Eduhall | Descripción |
|---|---|---|
| `useInView` (hook) | `react-intersection-observer`, AOS | `IntersectionObserver` nativo, dispara una sola vez |
| `Reveal` (componente) | `data-aos="fade-up"` y variantes | Props `direction` (`up`, `left`, `right`, `zoom`) y `delay` para escalonar |
| `Float` (componente) | `animation: upDown`, `scalation`, `roatation` | Para formas decorativas del hero y secciones; baja opacidad |
| `useCountUp` (hook) | `react-countup` | Conteo con `requestAnimationFrame`, activado por `useInView` |
| `Marquee` (componente) | `react-fast-marquee` | Desplazamiento CSS infinito, se detiene al pasar el cursor y con movimiento reducido |
| Hover de tarjeta | `animation-item`, `item-hover` | Ya implementado en `Card` (eleva y cambia borde) |

**Mapa de equivalencia de efectos:** `fade-up` → `Reveal direction="up"`; `fade-left/right` → `direction="left/right"`; `zoom-in` → `direction="zoom"`; `upDown` → `Float`; `bounceIn*`, `flipInY`, `wobble`, `swing`, `heartbeat` → **no se adoptan** (demasiado juguetones para la marca; usar solo si diseño lo pide).

**Reglas de uso:** máximo un efecto de entrada por sección más escalonado de hijos (≤ 80 ms entre elementos); nada animado en el contenido principal del primer pliegue (el título del hero aparece sin retraso para no dañar LCP); ningún bucle infinito sobre texto.

## 6. Fases

| Fase | Contenido | Tickets | Depende de | Criterio de aceptación |
|---|---|---|---|---|
| A. Movimiento base — **HECHA** | Tokens de movimiento, `useInView`, `Reveal` (`up`, `zoom`), `Float`; aplicados a Hero (solo formas), Beneficios, CTA y listado de bootcamps | FE-GAP-005, W-05 | Nada | Verificada con 28 pruebas en Edge (normal, movimiento reducido, móvil 360): contenido visible con y sin movimiento reducido, CLS 0, sin saltos de altura, sin scroll horizontal, sin errores. Pendiente de la pieza: `useCountUp` y `Marquee` (fases C y D); direcciones `left`/`right` no implementadas a propósito (riesgo de scroll horizontal) |
| B. Detalle de bootcamp — **layout HECHO**, contenido pendiente | Layout inspirado en `CourseDetails`: panel lateral sticky con datos + inscripción (primero en móvil), migas de pan (`Breadcrumb`, también en listado y subsecciones de Profesional) | W-07, W-09 | Fase A; contenido: X-03, X-06 | Layout verificado en Edge a 1280 y 360 px con datos temporales en 3 estados (vacío, parcial, completo): panel a la derecha y sticky en escritorio, antes del temario en móvil, sin bloques vacíos, migas accesibles. **Falta:** verificación con datos oficiales |
| C. Nosotros — **componentes HECHOS**, falta contenido (X-04) | `AboutContent` + `Stats` con `useCountUp` | W-08 | Fase A, X-04 | Verificado en modo demo: el conteo ocurre una sola vez al entrar en pantalla, termina en el valor final, con movimiento reducido es inmediato; lectores de pantalla reciben el valor final. Falta: cifras reales con fuente y fecha |
| D. Aliados y Profesional — **componentes HECHOS**, falta contenido (X-02/X-04) | `Partners` + `Marquee` | W-09 | Fase A, X-02/X-04 | Verificado en modo demo: se desplaza, se pausa con hover y foco, rejilla estática con movimiento reducido, copia visual oculta a lectores de pantalla. Falta: logos con `alt` y permiso de cada aliado |
| E. Prueba social y FAQ — **componentes HECHOS**, falta contenido | `Faq` (nativo `details/summary`), `Testimonials`, `Steps` | FE-GAP-006, FE-GAP-007 | Fase A, contenido real | Verificado en modo demo: acordeón operable con Enter y Espacio, sin dependencias nuevas, 0 violaciones axe. Falta: preguntas y testimonios reales (con autorización) |
| F. Captación | Formulario | FE-GAP-001 | X-06, definir campos | Validación accesible; envío a destino real |
| G. Verificación — **primera pasada HECHA** (re-ejecutar al llegar el contenido) | Pase de rendimiento y accesibilidad de todo lo animado | W-11, W-12 | A–F | 360/768/1024/1440 px; contraste (ver X-07); Lighthouse sin regresión de rendimiento |

**Orden recomendado:** la Fase A puede empezar ya porque no depende de contenido. Las demás avanzan conforme lleguen los insumos.

## 7. Riesgos y puntos ciegos

- **Licencia:** Eduhall es una plantilla comercial; confirmar que la licencia adquirida permite reutilizar sus imágenes antes de copiar cualquiera. El plan evita depender de ellas.
- **Contenido atrapado invisible:** ver principio 4. Se prueba explícitamente con `prefers-reduced-motion`.
- **Rendimiento:** muchas animaciones simultáneas en móviles de gama baja. Presupuesto: máximo 3 elementos animados a la vez en pantalla.
- **Identidad:** Eduhall es colorido y juguetón (kínder, tutores); Kodigo es sobrio, oscuro y tecnológico. Copiar efectos sin criterio desentona.
- **Mantenimiento del baseline:** estas adaptaciones se registran como `FE-GAP-*` o dentro de tickets existentes, no como tickets W nuevos.

## 8. Decisiones pendientes

1. ¿Se aprueba el sistema de movimiento propio (sin AOS ni WOW)? (recomendado)
2. ¿Qué secciones nuevas quiere Kodigo realmente: FAQ, testimonios, aliados, cifras, pasos del proceso?
3. ¿Hay licencia confirmada de Eduhall para reutilizar imágenes, o se redibuja todo en SVG?
4. ¿Intensidad de movimiento deseada: discreta (solo entradas suaves) o expresiva (formas flotantes, conteos)?
