import type { Partner } from "./content";
import raw from "./partners.json";

// partners.json lo genera `npm run assets:build` desde content/partners.csv (nombres, URLs) y los logos de
// "Recursos kodigo". Los logos se importan con Vite para obtener URLs con hash (caché inmutable).
const logoUrls = import.meta.glob<string>("../assets/partners/*.webp", { eager: true, query: "?url", import: "default" });

export const partners: Partner[] = raw.map((p) => {
  const logo = logoUrls[`../assets/partners/${p.file}`];
  if (!logo) throw new Error(`Falta el logo ${p.file} de "${p.name}": ejecuta npm run assets:build`);
  return { name: p.name, logo, width: p.width, height: p.height, ...("url" in p ? { url: p.url as string } : {}) };
});
