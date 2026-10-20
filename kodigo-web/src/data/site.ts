export const siteConfig = {
  name: "Kodigo",
  domain: "kodigo.org",
  tagline: "Formamos talento tech en El Salvador y Latinoamérica",
  description: "Kodigo: formación en tecnología e inteligencia artificial para El Salvador y Latinoamérica.",
  // PENDIENTE (X-06): URL del formulario o plataforma de inscripción. Sin valor, no se muestra el botón.
  enrollmentUrl: undefined as string | undefined,
  // PENDIENTES (página Alianzas): enlace para agendar la asesoría (calendario o formulario) y endpoint que recibe el
  // registro al Workshop. Sin advisoryUrl el botón baja a "Contacto"; sin workshopEndpoint el formulario valida pero
  // avisa que el registro aún no está habilitado (no simula un envío).
  advisoryUrl: undefined as string | undefined,
  workshopEndpoint: undefined as string | undefined,
  // Formulario de HubSpot (embed v2) de la sección "Aplicar" de la página Alianzas. Son identificadores públicos del portal.
  hubspotForm: { portalId: "14535110", formId: "20d00be5-bb70-4875-b13a-eb4cc6528c82", region: "na1" },
};
