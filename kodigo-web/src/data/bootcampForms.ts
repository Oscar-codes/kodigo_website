// Formulario de HubSpot de cada bootcamp (nomenclatura INCAF, formularios "Bootcamp - XXXXX | Julio2026_v1" y
// "Web Developer"). La clave es el slug del bootcamp (data/bootcamps.json). Un bootcamp sin entrada no muestra el botón
// "Aplicar" en su tarjeta (solo la ficha del programa) hasta que se le asigne formulario. Gen AI Skills tiene además el
// formulario "WEB_INCAF - AIGSK" (272f5693-281e-4ecd-b38f-346e57221301), reservado para el canal INCAF (no se usa en el sitio).
export interface BootcampForm {
  /** Código INCAF del programa. */
  code: string;
  /** ID del formulario en HubSpot (portal 14535110). */
  formId: string;
}

export const bootcampForms: Record<string, BootcampForm> = {
  "bi-analyst-ai": { code: "BIANL", formId: "0d6d99af-f503-4080-9441-ded071061c05" },
  "ai-agents-essentials": { code: "AIESS", formId: "3cb714d9-a511-48c9-8b16-48e0065e3519" },
  "gen-ai-to-agents": { code: "AIGTA", formId: "467a1cef-cf09-4bcc-8470-7182cd862eb3" },
  "ai-machine-learning": { code: "AIML", formId: "e432e77a-c900-4b4d-94bd-1e851b251080" },
  "ai-data-trainee": { code: "DTTR", formId: "21575e62-f119-4c39-a3de-3a9b89d1327b" },
  "ai-for-teachers": { code: "AITCH", formId: "1c4f1bb3-c41b-407c-b5da-e6ca9979370c" },
  "web-developer-frontend": { code: "WDFRT", formId: "eceef4ad-d255-40e0-bdfd-576cebc02d9d" },
  // Formularios web "WEB_SR - XXXXX | 09/2026_v1" (Student Revenue).
  "ai-for-developers-jr": { code: "AIDJR", formId: "f65ebb3e-2edb-4f2d-bfc6-64918980b258" },
  "gen-ai-skills": { code: "AIGSK", formId: "c6c6848d-7bad-4cf6-b250-4e884188e59c" },
  claude: { code: "CLAUDE", formId: "3668d89b-0dd5-4495-aa41-d6d46fa6c85a" },
};
