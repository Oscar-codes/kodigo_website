export const siteConfig = {
  name: "Kodigo",
  domain: "kodigo.org",
  tagline: "Formamos talento tech en El Salvador y Latinoamérica",
  description: "Kodigo: formación en tecnología e inteligencia artificial para El Salvador y Latinoamérica.",
  // PENDIENTE (X-06): URL del formulario o plataforma de inscripción. Sin valor, no se muestra el botón.
  enrollmentUrl: undefined as string | undefined,
  // PENDIENTE (página Alianzas): enlace para agendar la asesoría (calendario o formulario). Sin advisoryUrl el botón baja a "Contacto".
  advisoryUrl: undefined as string | undefined,
  // HubSpot (embed v2): identificadores públicos del portal y de cada formulario. "alianzas" es el de la sección Aplicar de
  // la página Alianzas y "workshop" el del registro al Workshop (modal, embed nuevo hs-form-frame); los formularios de los
  // bootcamps están en data/bootcampForms.ts.
  hubspot: {
    portalId: "14535110",
    region: "na1",
    forms: { alianzas: "20d00be5-bb70-4875-b13a-eb4cc6528c82", workshop: "8dcc21d1-4fd0-4881-aede-e9834c7679e3" },
  },
};
