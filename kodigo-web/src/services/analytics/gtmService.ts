// Tipado básico para event payloads
export type EventPayload = Record<string, unknown>;

// Enviar objeto estructurado a window.dataLayer
export const pushDataLayer = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

// Evento genérico para Clics en botones o CTAs
export const trackClick = (buttonName: string, section: string, extraData?: EventPayload) => {
  pushDataLayer({
    event: "custom_click",
    button_name: buttonName,
    section: section,
    ...extraData,
  });
};

// Evento para Envíos de Formularios
export const trackFormSubmit = (formName: string, isSuccess: boolean, extraData?: EventPayload) => {
  pushDataLayer({
    event: "form_submission",
    form_name: formName,
    status: isSuccess ? "success" : "error",
    ...extraData,
  });
};

// ---- B2B GTM Tracking Specification ----

// Vistas de sección (IntersectionObserver >= 50% por >= 1000ms sostenidos)
export const trackB2BSectionView = (eventName: string, sectionName: string) => {
  pushDataLayer({
    event: eventName,
    section_name: sectionName,
  });
};

// Clics en CTAs del Hero
export const trackB2BHeroAdvisoryClick = (ctaText: string, destination: string) => {
  pushDataLayer({
    event: "b2b_hero_advisory_cta_click",
    cta_text: ctaText,
    cta_location: "hero",
    destination,
  });
};

export const trackB2BHeroWorkshopsClick = (ctaText: string) => {
  pushDataLayer({
    event: "b2b_hero_workshops_cta_click",
    cta_text: ctaText,
    cta_location: "hero",
    destination: "#workshops",
  });
};

// Clics en CTAs de Workshops
export const trackB2BNov26WorkshopClick = () => {
  pushDataLayer({
    event: "b2b_nov26_workshop_cta_click",
    workshop_id: "nov26_2026",
    cta_location: "workshops_section",
  });
};

export const trackB2B2027PreregistrationClick = () => {
  pushDataLayer({
    event: "b2b_2027_preregistration_cta_click",
    program_id: "workshops_2027",
    cta_location: "workshops_section",
  });
};

// Clic en CTA de Formación a tu medida
export const trackB2BFormationAdvisoryClick = (ctaText: string, destination: string) => {
  pushDataLayer({
    event: "b2b_formation_to_measure_advisory_cta_click",
    cta_text: ctaText,
    cta_location: "formation_to_measure",
    destination,
  });
};

// Clics de navegación del menú B2B
export const trackB2BNavigationClick = (menuItem: string, destination: string) => {
  const eventMap: Record<string, string> = {
    comienza_aqui: "b2b_navigation_start_click",
    workshops: "b2b_navigation_workshops_click",
    success_cases: "b2b_navigation_success_cases_click",
    formation_to_measure: "b2b_navigation_formation_to_measure_click",
  };

  const eventName = eventMap[menuItem];
  if (eventName) {
    pushDataLayer({
      event: eventName,
      menu_item: menuItem,
      destination,
    });
  }
};

// Acciones del carrusel de Aliados (solo interacción manual)
export const trackB2BAlliesCarouselAction = (
  action: "next" | "previous" | "swipe",
  slideIndex: number,
) => {
  pushDataLayer({
    event: `b2b_allies_carousel_${action}`,
    carousel_name: "allies",
    slide_index: slideIndex,
  });
};

// Clic en casos de éxito (solo si abre contenido real)
export const trackB2BSuccessCaseClick = (companyOrCaseId: string, destination: string) => {
  pushDataLayer({
    event: "b2b_success_case_click",
    company_or_case_id: companyOrCaseId,
    destination,
  });
};
