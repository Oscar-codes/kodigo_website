import type { Bootcamp } from "../bootcamps";

// CONTENIDO DE EJEMPLO para el modo demostración: no describe ningún programa real de Kodigo.
export const demoDetails: Pick<Bootcamp, "duration" | "modality" | "level" | "requirements" | "syllabus" | "enrollmentUrl"> = {
  duration: "Duración de ejemplo",
  modality: "Modalidad de ejemplo",
  level: "Nivel de ejemplo",
  requirements: ["Requisito de ejemplo 1", "Requisito de ejemplo 2"],
  syllabus: [
    { title: "Módulo de ejemplo 1", topics: ["Tema de ejemplo A", "Tema de ejemplo B", "Tema de ejemplo C"] },
    { title: "Módulo de ejemplo 2", topics: ["Tema de ejemplo D", "Tema de ejemplo E"] },
    { title: "Módulo de ejemplo 3 (sin temas)" },
  ],
  enrollmentUrl: "https://example.com/inscripcion-de-ejemplo",
};
