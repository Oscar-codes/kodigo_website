import { useEffect } from "react";
import { trackB2BSectionView } from "./gtmService";

interface SectionConfig {
  id: string;
  eventName: string;
  sectionName: string;
}

const B2B_SECTIONS: SectionConfig[] = [
  { id: "hero", eventName: "b2b_hero_view", sectionName: "hero" },
  { id: "workshops", eventName: "b2b_workshops_section_view", sectionName: "workshops" },
  { id: "casos", eventName: "b2b_success_cases_section_view", sectionName: "success_cases" },
  { id: "adaptacion", eventName: "b2b_formation_section_view", sectionName: "formation_b2b" },
  { id: "equipo", eventName: "b2b_team_section_view", sectionName: "team" },
  { id: "aliados", eventName: "b2b_allies_section_view", sectionName: "allies" },
];

/**
 * Rastrea la vista de cada sección de la landing B2B según la especificación:
 * - IntersectionObserver con umbral >= 0.5 (50% visible).
 * - Sostenido durante >= 1000ms continuos.
 * - Disparado una sola vez por carga de página.
 */
export const B2BSectionTracker = () => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const tracked = new Set<string>();
    const timers = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const conf = B2B_SECTIONS.find((s) => s.id === id);
          if (!conf || tracked.has(id)) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!timers.has(id)) {
              const timer = window.setTimeout(() => {
                if (!tracked.has(id)) {
                  tracked.add(id);
                  trackB2BSectionView(conf.eventName, conf.sectionName);
                  observer.unobserve(entry.target);
                  timers.delete(id);
                }
              }, 1000);
              timers.set(id, timer);
            }
          } else {
            const existingTimer = timers.get(id);
            if (existingTimer) {
              window.clearTimeout(existingTimer);
              timers.delete(id);
            }
          }
        }
      },
      { threshold: [0.5] },
    );

    for (const conf of B2B_SECTIONS) {
      const el = document.getElementById(conf.id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  return null;
};
