// Envío del formulario "Aplicar" (sección final del Inicio).
//
// El sitio es estático: por ahora el envío NO se guarda en ningún sistema (solo confirma al visitante). Cuando se
// conecte HubSpot (u otro destino), basta con definir VITE_LEADS_ENDPOINT en el entorno de compilación y este módulo
// enviará el lead como JSON por POST. Si el destino exige otro formato (p. ej. la API de formularios de HubSpot),
// el cambio se hace aquí y el formulario no se toca.

export interface LeadPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  cityCountry: string;
  profile: string;
  techLevel: string;
  company?: string;
  jobTitle?: string;
  areas: string[];
  goal: string;
  startWhen: string;
  weeklyHours: string;
  source: string;
  consent: boolean;
  /** Página y momento del envío, útiles para atribución en el CRM. */
  pageUrl: string;
  submittedAt: string;
}

const ENDPOINT: string | undefined = import.meta.env.VITE_LEADS_ENDPOINT;

export const submitLead = async (lead: LeadPayload): Promise<void> => {
  if (!ENDPOINT) return;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`No se pudo enviar el formulario (${res.status})`);
};
