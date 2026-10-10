import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter"; // Inter (variable, autoalojada): la tipografía de Eduhall
import "@fontsource-variable/manrope"; // Manrope (variable, autoalojada): tipografía del menú del Header
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
