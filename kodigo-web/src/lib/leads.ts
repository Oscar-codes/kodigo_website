// Envío del formulario "Aplicar" (sección final del Inicio, "Tu próximo capítulo").
//
// El sitio es estático (no tiene servidor), así que el correo lo envía un servicio externo: FormSubmit (formsubmit.co).
// Al completar los 4 pasos, el lead se manda a ese servicio y este lo reenvía por correo a LEADS_EMAIL como una tabla
// legible. SOLUCIÓN TEMPORAL: los datos personales de los leads pasan por un tercero; cuando se defina el destino
// definitivo (HubSpot, un servidor propio, etc.) basta con cambiar este módulo; el formulario no se toca.
//
// Configuración (variables del entorno de compilación, opcionales):
//   VITE_LEADS_EMAIL     correo que recibe los leads (por defecto, el de abajo).
//   VITE_LEADS_ENDPOINT  si se define, se envía el lead como JSON crudo por POST a esa URL en lugar de a FormSubmit.
//
// OJO (primer envío): FormSubmit exige confirmar el correo destino una sola vez. Al llegar el primer envío manda un
// mensaje de activación a LEADS_EMAIL; hasta pulsar el enlace, los envíos no se entregan.

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

const LEADS_EMAIL: string = import.meta.env.VITE_LEADS_EMAIL ?? "oscar.lemus@kodigo.org";
const ENDPOINT: string | undefined = import.meta.env.VITE_LEADS_ENDPOINT;
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${LEADS_EMAIL}`;

/** Campos con nombre legible, en el orden en que se ven en el correo (FormSubmit los muestra como tabla). */
const toEmailFields = (lead: LeadPayload): Record<string, string> => {
  const fields: Record<string, string | undefined> = {
    "Nombre completo": lead.fullName,
    "Correo": lead.email,
    "WhatsApp": lead.whatsapp,
    "Ciudad y país": lead.cityCountry,
    "Perfil": lead.profile,
    "Nivel técnico": lead.techLevel,
    "Empresa": lead.company,
    "Cargo": lead.jobTitle,
    "Áreas de interés": lead.areas.join(", "),
    "Objetivo": lead.goal,
    "Cuándo quiere empezar": lead.startWhen,
    "Horas semanales": lead.weeklyHours,
    "Cómo nos conoció": lead.source,
    "Aceptó el tratamiento de sus datos": lead.consent ? "Sí" : "No",
    "Página": lead.pageUrl,
    "Fecha de envío": lead.submittedAt,
  };
  return Object.fromEntries(Object.entries(fields).filter(([, v]) => v) as [string, string][]);
};

export const submitLead = async (lead: LeadPayload): Promise<void> => {
  const custom = !!ENDPOINT;
  const res = await fetch(ENDPOINT ?? FORMSUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(
      custom
        ? lead
        : {
            _subject: `Nuevo lead de Aplicar: ${lead.fullName}`,
            _template: "table",
            _captcha: "false",
            _replyto: lead.email,
            ...toEmailFields(lead),
          },
    ),
  });
  if (!res.ok) throw new Error(`No se pudo enviar el formulario (${res.status})`);
  if (custom) return;
  // FormSubmit responde 200 también cuando no entrega (p. ej. correo sin activar): hay que mirar `success`.
  const result = (await res.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
  if (!result || (result.success !== true && result.success !== "true")) {
    throw new Error(result?.message ?? "FormSubmit no confirmó el envío");
  }
};
