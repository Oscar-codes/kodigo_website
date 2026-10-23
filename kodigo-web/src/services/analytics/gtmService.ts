// Tipado básico para event payloads
export type EventPayload = Record<string, unknown>;

// Evento genérico para Clics en botones o CTAs
export const trackClick = (buttonName: string, section: string, extraData?: EventPayload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'custom_click',
    button_name: buttonName,
    section: section,
    ...extraData,
  });
};

// Evento para Envíos de Formularios
export const trackFormSubmit = (formName: string, isSuccess: boolean, extraData?: EventPayload) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_submission',
    form_name: formName,
    status: isSuccess ? 'success' : 'error',
    ...extraData,
  });
};
