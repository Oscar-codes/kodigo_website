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
};
