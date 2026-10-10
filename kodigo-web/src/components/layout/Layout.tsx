import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { isDemo } from "@/config/mode";
import { DemoBanner } from "./DemoBanner";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

export const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Salto instantáneo: con scroll-behavior: smooth la página nueva se vería "subir" desde donde estaba la anterior.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

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
