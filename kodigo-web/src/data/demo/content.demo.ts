import type { SiteContent } from "../content";

// CONTENIDO DE EJEMPLO: solo para el modo demostración. No son datos ni textos oficiales de Kodigo.
// Cada texto dice "de ejemplo" a propósito para que ninguna captura se confunda con contenido real.

export const demoContent: SiteContent = {
  about: {
    heading: "Sobre Kodigo (texto de ejemplo)",
    paragraphs: [
      "Párrafo institucional de ejemplo. Aquí irá la presentación oficial de Kodigo: quiénes son y qué los mueve.",
      "Segundo párrafo de ejemplo. Aquí irá el enfoque pedagógico oficial y cómo acompañan a quienes estudian.",
    ],
  },
  stats: [
    { value: 1234, suffix: "+", label: "Cifra de ejemplo A", source: "Dato de ejemplo, sin fuente" },
    { value: 56, suffix: "", label: "Cifra de ejemplo B" },
    { value: 98, suffix: "%", label: "Cifra de ejemplo C" },
    { value: 10, suffix: "", label: "Cifra de ejemplo D" },
  ],
  // Los aliados ya son reales (src/data/partners.ts): no se simulan en el modo demostración.
  faq: [
    { question: "Pregunta de ejemplo 1", answer: "Respuesta de ejemplo 1. Aquí irá la respuesta oficial redactada por Kodigo." },
    { question: "Pregunta de ejemplo 2", answer: "Respuesta de ejemplo 2. Texto de relleno para ver cómo se despliega el acordeón." },
    { question: "Pregunta de ejemplo 3", answer: "Respuesta de ejemplo 3. Texto de relleno un poco más largo para comprobar el salto de línea en pantallas pequeñas y ver que nada se desborda." },
    { question: "Pregunta de ejemplo 4", answer: "Respuesta de ejemplo 4." },
  ],
  testimonials: [
    { quote: "Testimonio de ejemplo. Aquí irá la opinión real de una persona graduada, con su autorización.", name: "Nombre Apellido (ejemplo)", role: "Cargo de ejemplo" },
    { quote: "Segundo testimonio de ejemplo, más corto.", name: "Nombre Apellido (ejemplo)", role: "Cargo de ejemplo" },
    { quote: "Tercer testimonio de ejemplo. Texto de relleno algo más largo para comprobar cómo se comporta la tarjeta con varias líneas de texto en distintos anchos de pantalla.", name: "Nombre Apellido (ejemplo)" },
  ],
  steps: [
    { title: "Paso de ejemplo 1", text: "Descripción de ejemplo del primer paso." },
    { title: "Paso de ejemplo 2", text: "Descripción de ejemplo del segundo paso." },
    { title: "Paso de ejemplo 3", text: "Descripción de ejemplo del tercer paso." },
    { title: "Paso de ejemplo 4", text: "Descripción de ejemplo del cuarto paso." },
  ],
};
