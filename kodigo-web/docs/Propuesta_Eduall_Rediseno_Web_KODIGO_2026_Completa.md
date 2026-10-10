# Propuesta gráfica Eduall para el rediseño del sitio web de KODIGO Academia 2026

## 1. Situación actual del sitio web de KODIGO Academia

### 1.1. Estructura del sitio

#### Estructura principal

Dominio: **kodigo.org**.

- Inicio.
- Bootcamps.
- Nosotros.
- Blogs.
- Profesional.
- Contáctanos.

#### Estructura extendida

- **Inicio**
  - Ruta: `/`.
- **Bootcamps**
  - Gen AI to Agents.
  - AI for Teachers.
  - AI Agents Essentials.
  - AI Data Trainee.
  - BI Analyst AI.
  - Python Analyst.
  - SQL AI.
  - AI Machine Learning.
  - Web Developer Frontend.
  - Full Stack Jr / Full Stack AI Jr.
- **Nosotros**
  - Ruta: `/nosotros/`.
- **Blogs**
  - Página principal: `/blogs/`.
  - Categorías:
    - `/category/uncategorized/`.
    - `/category/desarrollo-de-software/`.
    - `/category/kodigo-news/`.
  - Artículos:
    - `/blog/2`.
    - `/diferencia-entre-desarrollador-backend-y-frontend/`.
    - `/por-que-debes-aprender-a-desarrollar-con-java/`.
    - `/como-me-beneficia-laboralmente-inscribirme-a-un-bootcamp-tecnologico/`.
    - `/bootcamps-de-codificacion-vale-la-pena/`.
    - Otros artículos.
- **Profesional**
  - PPD.
  - Alianzas.
  - KODIGO Jobs:
    - Ruta: `/kodijobs/`.
    - Ofertas individuales: `/job/{slug}/`.
- **Contáctanos**.

#### Estructura del blog

El blog tiene una estructura de taxonomías de WordPress, además de las páginas individuales.

Página principal: `/blogs/`.

- **Categorías**
  - `/category/uncategorized/`.
  - `/category/desarrollo-de-software/`.
  - `/category/kodigo-news/`.
- **Posts**
  - `/diferencia-entre-desarrollador-backend-y-frontend/`.
  - `/por-que-debes-aprender-a-desarrollar-con-java/`.
  - `/como-me-beneficia-laboralmente-inscribirme-a-un-bootcamp-tecnologico/`.
  - `/bootcamps-de-codificacion-vale-la-pena/`.
  - Otros posts.

#### Páginas externas de inscripción

Los botones de inscripción de KODIGO también llevan a un subdominio diferente, **info.kodigo.org**, por lo que no deberían mezclarse técnicamente con el árbol de **kodigo.org**.

| Subdominio | Ruta |
| --- | --- |
| info.kodigo.org | `/inicia-tu-inscripcion` |
| info.kodigo.org | `/preinscripcion-becas` |
| info.kodigo.org | `/kodigo-data-trainee-beca-de-alto-impacto-social` |
| info.kodigo.org | `/beca-fullstackai` |
| info.kodigo.org | `/kodigo-python-con-ai-beca-de-alto-impacto-social` |

### 1.2. Diagnóstico del sitio

#### Diagnóstico general

El sitio tiene una base sólida, pero actualmente funciona mejor como catálogo institucional de bootcamps que como una máquina de conversión.

| Área | Evaluación |
| --- | --- |
| Propuesta de valor | 🟢 8/10 |
| Oferta de cursos | 🟢 8/10 |
| Claridad del recorrido | 🟡 6/10 |
| Diseño orientado a conversión | 🟡 6/10 |
| Confianza / prueba social | 🟢 8/10 |
| Información para tomar decisión | 🟡 6/10 |
| CTAs | 🟡 6/10 |
| Segmentación de públicos | 🟡 5/10 |
| Arquitectura de información | 🟡 6/10 |
| Potencial comercial | 🟢 8/10 |
| **Resultado global** | **6.8/10** |

Es probable que la página no esté organizada de la manera más efectiva para llevar a una persona desde «me interesa» hasta «quiero inscribirme».

## 2. Recomendaciones de mejora para el diseño

### 2.1. Propuesta del trabajo para el diseño del sitio

El recorrido propuesto sigue esta secuencia:

1. **ATRAER:** captar atención.
2. **EXPLICAR:** qué puedo aprender.
3. **CONECTAR:** ¿por qué esto me sirve a mí?
4. **GENERAR CONFIANZA:** ¿por qué KODIGO?
5. **REDUCIR RIESGO:** responder las siguientes preguntas:
   - ¿Qué voy a obtener?
   - ¿Cuánto dura?
   - ¿Necesito experiencia?
   - ¿Cuánto cuesta?
   - ¿Hay becas?
   - ¿Tiene salida laboral?
6. **CONVERTIR.**
7. **INSCRIPCIÓN / POSTULACIÓN.**

### 2.2. Ideas para el contenido

#### ¿Cuál es el bootcamp adecuado para mí?

Actualmente el usuario tiene que descubrirlo. Se recomienda incorporar inmediatamente encima o debajo del catálogo un mensaje como:

> **¿No sabes qué bootcamp elegir?**
>
> Te ayudamos a encontrar el programa que mejor se adapta a tu perfil y objetivos.
>
> **Botón: Descubre tu ruta.**

#### Mostrar el resultado: «De estudiante a profesional»

El sitio dice:

> «Inicia una carrera tech con nosotros».

Y:

> «Nuestros bootcamps están diseñados para que te incorpores a un trabajo en corto plazo».

Se propone mostrar el recorrido **«De estudiante a profesional»**:

1. KODIGO.
2. Bootcamp.
3. Proyectos reales.
4. Portafolio.
5. Preparación laboral.
6. Conexión empresarial.
7. Primer empleo.

Este recorrido debe acompañarse con datos reales.

#### Los aliados

La página muestra una gran cantidad de organizaciones y empresas como aliados, incluyendo nombres como Tigo, Telus, Foundever, DollarCity, Movistar, RSM, PBS y Coderland, entre muchas otras.

Esto puede convertirse en uno de los elementos de mayor confianza del sitio. Actualmente funciona principalmente como **«Nuestros aliados»**, con una colección de logos.

Se propone el mensaje:

> **Conectados con el mercado laboral.**
>
> No estudias tecnología en un vacío.
>
> Formamos talento en conexión con empresas y organizaciones que necesitan profesionales tecnológicos.

Después se mostrarían los siguientes indicadores, utilizando cifras reales y verificables:

- +X empresas aliadas.
- +X estudiantes formados.
- +X graduados trabajando.
- +X años formando talento.

El visitante debe entender que **KODIGO tiene relación con el mundo laboral**. Eso es mucho más poderoso que simplemente mostrar logos.

#### Testimonios reales

El sitio habla de:

> «La experiencia de Kodis que están demostrando su potencial en el mercado laboral».

Para conversión educativa se propone desarrollar este contenido con mayor profundidad. Una academia necesita mostrar personas.

Ejemplos de testimonios propuestos:

- «Yo estudié en KODIGO y ahora…». María — Data Analyst.
- «Antes trabajaba en X. Después del bootcamp…». Carlos — Full Stack Developer.
- «No tenía experiencia profesional en desarrollo…».

Cada testimonio debería incluir:

- Fotografía.
- Nombre.
- Programa cursado.
- Puesto actual.
- Empresa, si existe autorización.
- Breve historia.

Eventualmente se incorporaría el llamado a la acción **«Ver historias de Kodis →»**.

#### Las páginas de cada bootcamp deberían ser auténticas landing pages

La portada dice **«Inscríbete»**, pero el usuario necesita una página donde pueda responder las siguientes preguntas:

1. ¿Este programa es para mí?
2. ¿Qué voy a aprender?
3. ¿Qué voy a poder hacer al terminar?
4. ¿Qué necesito antes de comenzar?
5. ¿Cuánto dura?
6. ¿Cuándo comienza?
7. ¿Cuál es el horario?
8. ¿Es en vivo?
9. ¿Es virtual?
10. ¿Cuánto cuesta?
11. ¿Hay beca?
12. ¿Qué certificación obtengo?
13. ¿Qué oportunidades laborales tengo?
14. ¿Qué dicen otros estudiantes?

La información existe parcialmente en el ecosistema de KODIGO, pero está distribuida entre diferentes páginas y subdominios. Por ejemplo, las páginas de **info.kodigo.org** incluyen detalles bastante más concretos sobre requisitos, próximos grupos, pensum, condiciones y proceso de aplicación.

Desde el punto de vista del visitante, esto debería sentirse como un único proceso.

#### Fragmentación entre kodigo.org e info.kodigo.org

El visitante puede comenzar en **kodigo.org** y terminar realizando la inscripción en **info.kodigo.org**.

Eso técnicamente puede estar perfectamente bien, pero comercialmente existe un riesgo en el recorrido:

1. El visitante entra a kodigo.org.
2. Selecciona «Inscríbete».
3. Llega a otro dominio.
4. Encuentra otra apariencia.
5. Entra en otro contexto.
6. Completa el formulario.

La sensación puede ser: **«¿Estoy todavía en KODIGO?»**.

En las páginas de **info.kodigo.org** sí existe información mucho más orientada a conversión: requisitos, grupos, pensums, condiciones académicas y formulario.

Se recomienda valorar mantener la infraestructura si es necesaria, pero hacer que la transición sea visual y conceptualmente invisible.

#### La navegación tiene demasiada orientación institucional

La navegación actual contiene:

- Bootcamps.
- Nosotros.
- Blogs.
- Profesional.
- PPD.
- Alianzas.
- Contáctanos.

Desde una perspectiva institucional está bien. Desde una perspectiva B2C/B2B, se recomienda considerar qué necesita ver una persona que está evaluando invertir tiempo y dinero en estudiar aquí.

Probablemente necesita encontrar:

- Bootcamps.
- Encuentra tu programa.
- ¿Por qué KODIGO?
- Historias de estudiantes.
- Becas.
- Empleabilidad.
- Preguntas frecuentes.

No necesariamente se deben eliminar las secciones institucionales, pero no se recomienda que tengan el mismo protagonismo que el camino hacia la inscripción.

#### La propuesta de valor debería segmentarse

| Público | Necesidad expresada |
| --- | --- |
| 1. Principiante | «Quiero entrar al mundo tecnológico». |
| 2. Profesional | «Quiero mejorar mi perfil y aumentar mis oportunidades». |
| 3. Desarrollador | «Quiero aprender IA y herramientas modernas». |
| 4. Analista | «Quiero aprender a trabajar con datos». |
| 5. Docente | «Quiero incorporar IA en mi trabajo». |
| 6. Empresa | «Quiero capacitar a mi equipo». |

El sitio actual intenta hablarle a varios públicos simultáneamente.

Se propone crear una bifurcación muy visible bajo la pregunta **«¿Qué estás buscando?»**, con las siguientes opciones:

- **Quiero iniciar mi carrera.**
- **Quiero mejorar mis habilidades.**
- **Quiero aprender IA.**
- **Quiero capacitar a mi equipo.**

Esto ayudaría a reducir la carga cognitiva.

#### Explicar mejor el modelo de aprendizaje

Hay información sobre duración y modalidad, pero se recomienda convertirla en una sección visual: **«¿Cómo funciona un bootcamp KODIGO?»**.

1. **Elige tu ruta.**
2. **Completa tu inscripción.**
3. **Aprende con clases en vivo.**
4. **Desarrolla proyectos.**
5. **Construye tu portafolio.**
6. **Prepárate para el mercado laboral.**

Debajo se mostraría la siguiente información:

| Dato | Contenido propuesto |
| --- | --- |
| Modalidad | Virtual |
| Duración | X semanas |
| Clases | X horas/semana |
| Horario | X |
| Certificación | X |
| Requisitos | X |

La información debe poder comprenderse en 10 segundos.

#### Incorporar un FAQ comercial

El documento considera obligatorio incluir un FAQ comercial para este tipo de negocio.

Preguntas frecuentes propuestas:

1. ¿Necesito conocimientos previos?
2. ¿Cuánto dura el bootcamp?
3. ¿Las clases son en vivo?
4. ¿Es completamente virtual?
5. ¿Qué horarios existen?
6. ¿Necesito computadora?
7. ¿Cuánto cuesta?
8. ¿Hay becas?
9. ¿Puedo pagar en cuotas?
10. ¿Qué certificación obtengo?
11. ¿Qué pasa si falto a una clase?
12. ¿Qué oportunidades laborales tengo?
13. ¿KODIGO ayuda a conseguir empleo?
14. ¿Qué diferencia hay entre este bootcamp y otro?
15. ¿Puedo estudiar si trabajo?
16. ¿Qué edad necesito tener?

Esto reduce la fricción antes del formulario.

## 3. Propuesta gráfica seleccionada: Eduall

| Elemento | Detalle del documento original |
| --- | --- |
| Plantilla | Eduall |
| Identificación original | Propuesta 6 (Eduall) |
| Tienda | [Eduall en Envato Elements](https://elements.envato.com/eduall-education-tutors-lms-online-course-vue-LBH4A9H) |
| Demostración en vivo | [Ver demo de Eduall](https://eduall-vue.netlify.app/?storefront=envato-elements) |
| Tecnologías | HTML, CSS, JS, SASS |
| Puntuación | Cinco símbolos de valoración en el original; la extracción de texto los representa como «êêêêê». |

Esta versión conserva la estructura del sitio, el diagnóstico y todas las recomendaciones de mejora del documento fuente, y mantiene únicamente Eduall entre las propuestas gráficas.
