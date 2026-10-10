/**
 * Modo demostración (`vite --mode demo` / `npm run dev:demo`): carga contenido de EJEMPLO para ver el sitio
 * completo. Nunca se incluye en el build de producción (Vite reemplaza MODE por un literal y el código muerto
 * se elimina; lo comprueba tests/e2e/no-demo.test.mjs).
 */
export const isDemo = import.meta.env.MODE === "demo";
