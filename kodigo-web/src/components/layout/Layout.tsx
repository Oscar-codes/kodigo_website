import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { isDemo } from "@/config/mode";
import { DemoBanner } from "./DemoBanner";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

export const Layout = () => {
  const { pathname, hash, key } = useLocation();

  // Depende de `key` y no solo de pathname/hash: al pulsar un enlace del menú que apunta a la URL en la que ya estamos
  // (por ejemplo "Formaciones" -> /#bootcamps-title tras haber subido al inicio), la URL no cambia pero React Router genera
  // una ubicación nueva con otra `key`; así el scroll al ancla se repite todas las veces.
  useEffect(() => {
    // Cambio de ruta pura: salto instantáneo al top (con 'instant' evitamos
    // que scroll-behavior: smooth haga "subir" la pagina desde donde estaba).
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    // Anchor / hash: scroll suave al id correspondiente. Si el id no existe
    // todavia (carga inicial o route nuevo), fallback al top para no
    // bloquear al usuario.
    const id = hash.replace(/^#/, "");
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    });
  }, [pathname, hash, key]);

  return (
    <>
      <SkipLink />
      {isDemo && <DemoBanner />}
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
