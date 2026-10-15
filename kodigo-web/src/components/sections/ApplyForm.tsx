import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import styled from "styled-components";
import { submitLead } from "@/lib/leads";
import { media } from "@/styles/theme";
import { ArrowLeft, ArrowRight, Check } from "../ui/Icons";

// Formulario "Aplicar" en 4 fases para captar leads con interés formativo en Kodigo:
//   1 Perfil (datos de contacto) · 2 Experiencia (quién es y su nivel) · 3 Interés (qué quiere aprender y lograr) ·
//   4 Aplicación (cuándo, cuánto tiempo, cómo nos conoció y consentimiento).
// Se valida cada fase antes de avanzar. El envío pasa por `submitLead` (src/lib/leads.ts): hoy es estático y se
// conectará a HubSpot después. Tarjeta blanca sobre el panel oscuro, con los chips y botones de la línea gráfica de Kodigo.

const STEPS = ["Perfil", "Experiencia", "Interés", "Aplicación"] as const;

const PROFILES = ["Estudiante", "Profesional en activo", "En búsqueda de empleo", "Emprendedor(a)", "Represento a una empresa"];
const COMPANY_PROFILE = "Represento a una empresa";
const LEVELS = ["Sin experiencia", "Básico", "Intermedio", "Avanzado"];
const AREAS = ["Programación", "Data Analyst", "Inteligencia artificial", "Capacitación para mi equipo", "Aún no lo sé"];
const START = ["Lo antes posible", "En 1 a 3 meses", "En más de 3 meses", "Solo estoy explorando"];
const HOURS = ["Menos de 3 horas", "De 3 a 5 horas", "De 5 a 8 horas", "Más de 8 horas"];
const SOURCES = ["Redes sociales", "Recomendación de alguien", "Evento o taller", "Búsqueda en Google", "Mi empresa o institución", "Otro"];

// Enlace al aviso de privacidad: pendiente, Kodigo aún no tiene la política publicada.
const PRIVACY_URL = "#";

interface FormState {
  fullName: string;
  email: string;
  whatsapp: string;
  cityCountry: string;
  profile: string;
  techLevel: string;
  company: string;
  jobTitle: string;
  areas: string[];
  goal: string;
  startWhen: string;
  weeklyHours: string;
  source: string;
  consent: boolean;
}

const EMPTY: FormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  cityCountry: "",
  profile: "",
  techLevel: "",
  company: "",
  jobTitle: "",
  areas: [],
  goal: "",
  startWhen: "",
  weeklyHours: "",
  source: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

const REQUIRED = "Completa este campo";
const PICK = "Elige una opción";

const validate = (step: number, f: FormState): Errors => {
  const e: Errors = {};
  if (step === 0) {
    if (f.fullName.trim().length < 3) e.fullName = REQUIRED;
    if (!f.email.trim()) e.email = REQUIRED;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Escribe un correo válido";
    if (!f.whatsapp.trim()) e.whatsapp = REQUIRED;
    else if (f.whatsapp.replace(/\D/g, "").length < 8) e.whatsapp = "Escribe un número válido";
    if (!f.cityCountry.trim()) e.cityCountry = REQUIRED;
  } else if (step === 1) {
    if (!f.profile) e.profile = PICK;
    if (!f.techLevel) e.techLevel = PICK;
    if (f.profile === COMPANY_PROFILE && !f.company.trim()) e.company = REQUIRED;
  } else if (step === 2) {
    if (f.areas.length === 0) e.areas = "Elige al menos una opción";
    if (f.goal.trim().length < 10) e.goal = "Cuéntanos un poco más (mínimo 10 caracteres)";
  } else {
    if (!f.startWhen) e.startWhen = PICK;
    if (!f.weeklyHours) e.weeklyHours = PICK;
    if (!f.source) e.source = PICK;
    if (!f.consent) e.consent = "Necesitamos tu aceptación para contactarte";
  }
  return e;
};

// === ESTILOS ===
const Card = styled.div`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.space(6)};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(8)} ${theme.space(8)} ${theme.space(8)}`};
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.greenSoft};
  color: ${({ theme }) => theme.colors.greenText};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.weights.semibold};

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.green};
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(5)};

  .count {
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Progress = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space(2)};
  margin: 0 0 ${({ theme }) => theme.space(6)};
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: ${({ theme }) => theme.space(2)};
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  li::before {
    content: "";
    height: 4px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.main100};
    transition: background-color ${({ theme }) => theme.motion.duration.base} ease;
  }

  li[data-done="true"]::before,
  li[aria-current="step"]::before {
    background: ${({ theme }) => theme.colors.main};
  }

  li[aria-current="step"] {
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  /* En pantallas angostas solo se rotula la fase activa. */
  ${media.down("md")} {
    li:not([aria-current="step"]) span {
      display: none;
    }
  }
`;

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};

  .row {
    display: grid;
    gap: ${({ theme }) => theme.space(5)};

    ${media.up("md")} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .field {
    display: grid;
    gap: ${({ theme }) => theme.space(2)};
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .label,
  legend {
    padding: 0;
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.heading};
  }

  .req {
    color: ${({ theme }) => theme.colors.orangeText};
  }

  .opt {
    font-weight: ${({ theme }) => theme.weights.regular};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select,
  textarea {
    width: 100%;
    min-height: 48px;
    padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.heading};
    font: inherit;
    font-size: 1rem;
    transition:
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      box-shadow ${({ theme }) => theme.motion.duration.hover} linear;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.main100};
  }

  [aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.orangeText};
  }

  .error {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.orangeText};
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space(2)};
  }

  .chip {
    position: relative;
  }

  .chip input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .chip span {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0 ${({ theme }) => theme.space(4)};
    border: 1px solid ${({ theme }) => theme.colors.main200};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.main50};
    color: ${({ theme }) => theme.colors.heading};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      color ${({ theme }) => theme.motion.duration.hover} linear,
      border-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .chip:hover span {
    border-color: ${({ theme }) => theme.colors.main};
  }

  .chip input:checked + span {
    background: ${({ theme }) => theme.colors.main};
    border-color: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
  }

  .chip input:focus-visible + span {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 2px;
  }

  .consent {
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space(3)};
    font-size: 0.875rem;
    line-height: 1.5;
    cursor: pointer;
  }

  .consent input {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.main};
  }

  .consent a {
    color: ${({ theme }) => theme.colors.accentOnLight};
    text-decoration: underline;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${({ theme }) => theme.space(3)};
  }

  .submit-error {
    padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.orangeSoft};
    color: ${({ theme }) => theme.colors.orangeText};
    font-size: 0.875rem;
  }
`;

const Btn = styled.button<{ $ghost?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 52px;
  padding: 0 ${({ theme }) => theme.space(8)};
  border-radius: ${({ theme }) => theme.radii.pill};
  font: inherit;
  font-weight: ${({ theme }) => theme.weights.medium};
  cursor: pointer;
  transition:
    filter ${({ theme }) => theme.motion.duration.base} ease,
    box-shadow ${({ theme }) => theme.motion.duration.base} ease,
    background-color ${({ theme }) => theme.motion.duration.base} ease;

  ${({ $ghost, theme }) =>
    $ghost
      ? `
    background: transparent;
    border: 1px solid ${theme.colors.main200};
    color: ${theme.colors.heading};
  `
      : `
    background: ${theme.colors.gradientCta};
    border: 1px solid transparent;
    color: ${theme.colors.white};
    box-shadow: 0 8px 22px rgba(117, 87, 250, 0.32);
  `}

  &:hover:not([disabled]) {
    ${({ $ghost, theme }) => ($ghost ? `background: ${theme.colors.main50};` : "filter: brightness(1.06);")}
  }

  &[disabled] {
    opacity: 0.6;
    cursor: progress;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

const Done = styled.div`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => `${theme.space(6)} 0`};

  .tick {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.greenSoft};
    color: ${({ theme }) => theme.colors.greenText};
  }

  h3 {
    font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2rem);
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    max-width: 44ch;
    line-height: 1.6;
  }
`;

// === PIEZAS ===
const Field = ({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) => (
  <div className="field">
    <label className="label" htmlFor={id}>
      {label} {optional ? <span className="opt">(opcional)</span> : <span className="req" aria-hidden="true">*</span>}
    </label>
    {children}
    {error ? (
      <span className="error" id={`${id}-err`} role="alert">
        {error}
      </span>
    ) : null}
  </div>
);

interface ChipsProps {
  name: string;
  legend: string;
  options: string[];
  value: string | string[];
  multiple?: boolean;
  error?: string;
  onChange: (next: string) => void;
}

const Chips = ({ name, legend, options, value, multiple, error, onChange }: ChipsProps) => (
  <fieldset className="field" data-invalid={error ? "true" : undefined} tabIndex={-1}>
    <legend>
      {legend} <span className="req" aria-hidden="true">*</span>
    </legend>
    <div className="chips">
      {options.map((o) => {
        const checked = Array.isArray(value) ? value.includes(o) : value === o;
        return (
          <label key={o} className="chip">
            <input type={multiple ? "checkbox" : "radio"} name={name} value={o} checked={checked} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
    {error ? (
      <span className="error" role="alert">
        {error}
      </span>
    ) : null}
  </fieldset>
);

export const ApplyForm = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  // Tras un intento fallido, el foco va al primer campo con error (lectores de pantalla y teclado).
  useEffect(() => {
    if (Object.values(errors).every((v) => !v)) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')?.focus();
  }, [errors]);

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate(step, data);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSending(true);
    setFailed(false);
    try {
      await submitLead({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        whatsapp: data.whatsapp.trim(),
        cityCountry: data.cityCountry.trim(),
        profile: data.profile,
        techLevel: data.techLevel,
        company: data.profile === COMPANY_PROFILE ? data.company.trim() : undefined,
        jobTitle: data.profile === COMPANY_PROFILE ? data.jobTitle.trim() || undefined : undefined,
        areas: data.areas,
        goal: data.goal.trim(),
        startWhen: data.startWhen,
        weeklyHours: data.weeklyHours,
        source: data.source,
        consent: data.consent,
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString(),
      });
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleArea = (o: string) => set("areas", data.areas.includes(o) ? data.areas.filter((a) => a !== o) : [...data.areas, o]);
  const err = (k: keyof FormState) => errors[k];
  const bad = (k: keyof FormState) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `apply-${k}-err` } : {});

  if (sent) {
    return (
      <Card>
        <Done role="status">
          <span className="tick" aria-hidden="true">
            <Check size={30} />
          </span>
          <h3>¡Gracias, {data.fullName.trim().split(/\s+/)[0]}!</h3>
          <p>Recibimos tu información. Revisaremos tu perfil y te contactaremos por WhatsApp o correo para orientarte sobre el siguiente paso.</p>
          <Btn
            type="button"
            $ghost
            onClick={() => {
              setData(EMPTY);
              setStep(0);
              setSent(false);
            }}
          >
            Enviar otra solicitud
          </Btn>
        </Done>
      </Card>
    );
  }

  return (
    <Card>
      <Top>
        <Badge>Inscripciones abiertas</Badge>
        <span className="count" aria-live="polite">
          Paso {step + 1} de {STEPS.length}
        </span>
      </Top>

      <Progress aria-label="Progreso del formulario">
        {STEPS.map((s, i) => (
          <li key={s} data-done={i < step} aria-current={i === step ? "step" : undefined}>
            <span>{s}</span>
          </li>
        ))}
      </Progress>

      <Form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Formulario de aplicación a Kodigo">
        {step === 0 && (
          <>
            <Field id="apply-fullName" label="Nombre completo" error={err("fullName")}>
              <input id="apply-fullName" type="text" autoComplete="name" placeholder="Tu nombre y apellido" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} {...bad("fullName")} />
            </Field>
            <div className="row">
              <Field id="apply-email" label="Correo electrónico" error={err("email")}>
                <input id="apply-email" type="email" autoComplete="email" placeholder="tucorreo@ejemplo.com" value={data.email} onChange={(e) => set("email", e.target.value)} {...bad("email")} />
              </Field>
              <Field id="apply-whatsapp" label="WhatsApp" error={err("whatsapp")}>
                <input id="apply-whatsapp" type="tel" autoComplete="tel" placeholder="+503 7000 0000" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} {...bad("whatsapp")} />
              </Field>
            </div>
            <Field id="apply-cityCountry" label="Ciudad y país" error={err("cityCountry")}>
              <input id="apply-cityCountry" type="text" autoComplete="address-level2" placeholder="San Salvador, El Salvador" value={data.cityCountry} onChange={(e) => set("cityCountry", e.target.value)} {...bad("cityCountry")} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Chips name="profile" legend="¿Qué te describe mejor?" options={PROFILES} value={data.profile} error={err("profile")} onChange={(v) => set("profile", v)} />
            {data.profile === COMPANY_PROFILE && (
              <div className="row">
                <Field id="apply-company" label="Empresa" error={err("company")}>
                  <input id="apply-company" type="text" autoComplete="organization" placeholder="Nombre de tu empresa" value={data.company} onChange={(e) => set("company", e.target.value)} {...bad("company")} />
                </Field>
                <Field id="apply-jobTitle" label="Tu cargo" optional>
                  <input id="apply-jobTitle" type="text" autoComplete="organization-title" placeholder="Gerente, jefe de área…" value={data.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
                </Field>
              </div>
            )}
            <Chips name="techLevel" legend="¿Cuál es tu experiencia actual en tecnología?" options={LEVELS} value={data.techLevel} error={err("techLevel")} onChange={(v) => set("techLevel", v)} />
          </>
        )}

        {step === 2 && (
          <>
            <Chips name="areas" legend="¿Qué te gustaría aprender?" options={AREAS} value={data.areas} multiple error={err("areas")} onChange={toggleArea} />
            <Field id="apply-goal" label="¿Qué quieres lograr con esta formación?" error={err("goal")}>
              <textarea id="apply-goal" placeholder="Cuéntanos tu objetivo profesional o el reto de tu equipo" value={data.goal} onChange={(e) => set("goal", e.target.value)} {...bad("goal")} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Chips name="startWhen" legend="¿Cuándo te gustaría empezar?" options={START} value={data.startWhen} error={err("startWhen")} onChange={(v) => set("startWhen", v)} />
            <Chips name="weeklyHours" legend="¿Cuánto tiempo puedes dedicar cada semana?" options={HOURS} value={data.weeklyHours} error={err("weeklyHours")} onChange={(v) => set("weeklyHours", v)} />
            <Field id="apply-source" label="¿Cómo conociste Kodigo?" error={err("source")}>
              <select id="apply-source" value={data.source} onChange={(e) => set("source", e.target.value)} {...bad("source")}>
                <option value="">Selecciona una opción</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <div className="field">
              <label className="consent">
                <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} {...bad("consent")} />
                <span>
                  Acepto el <a href={PRIVACY_URL}>aviso de privacidad</a> de Kodigo y que me contacten sobre mi solicitud.
                </span>
              </label>
              {err("consent") ? (
                <span className="error" id="apply-consent-err" role="alert">
                  {err("consent")}
                </span>
              ) : null}
            </div>
            {failed ? (
              <p className="submit-error" role="alert">
                No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.
              </p>
            ) : null}
          </>
        )}

        <div className="actions">
          {step > 0 ? (
            <Btn type="button" $ghost onClick={back} disabled={sending}>
              <ArrowLeft size={16} />
              Atrás
            </Btn>
          ) : null}
          <Btn type="submit" disabled={sending}>
            {step < STEPS.length - 1 ? "Continuar" : sending ? "Enviando…" : "Enviar solicitud"}
            {step < STEPS.length - 1 ? <ArrowRight size={16} /> : null}
          </Btn>
        </div>
      </Form>
    </Card>
  );
};
