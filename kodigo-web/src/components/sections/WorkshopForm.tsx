import { useId, useState } from "react";
import styled from "styled-components";
import { workshop } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { ArrowRight } from "../ui/Icons";
import { VisuallyHidden } from "../ui/VisuallyHidden";

type Status = "idle" | "sending" | "sent" | "unavailable" | "failed";

// Dominios de correo personal: el campo pide correo corporativo.
const personalDomains = ["gmail", "hotmail", "outlook", "live", "yahoo", "icloud", "proton", "protonmail", "msn", "aol"];

const validate = (raw: string): string => {
  const email = raw.trim();
  if (!email) return "Ingresa tu correo corporativo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Escribe un correo válido, por ejemplo nombre@empresa.com.";
  const domain = email.split("@")[1].toLowerCase().split(".")[0];
  if (personalDomains.includes(domain)) return "Usa tu correo corporativo, no uno personal.";
  return "";
};

// Barra de correo del bloque "newsletter" de Eduhall: caja blanca con el campo y el botón con degradado de Kodigo dentro.
// Va sobre la banda violeta, así que el mensaje se muestra en una pastilla blanca (el rojo no tiene contraste sobre violeta).
const Form = styled.form`
  width: 100%;
  max-width: 640px;
  margin-inline: auto;

  .bar {
    display: grid;
    gap: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => theme.space(2.5)};
    background: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.float};

    ${media.up("md")} {
      grid-template-columns: minmax(0, 1fr) auto;
    }
  }

  input {
    width: 100%;
    padding: 15px 18px;
    font: inherit;
    color: ${({ theme }) => theme.colors.heading};
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid transparent;
    border-radius: ${({ theme }) => theme.radii.md};
    transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
      box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.main200};
    }

    &:focus-visible {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accentOnLight};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.main100};
    }

    &[aria-invalid="true"] {
      border-color: ${({ theme }) => theme.colors.danger};
      background: ${({ theme }) => theme.colors.dangerSoft};
    }

    &[aria-invalid="true"]:focus-visible {
      box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.2);
    }
  }

  .submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.space(2)};
    padding: 15px 28px;
    border: 0;
    border-radius: ${({ theme }) => theme.radii.md};
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.mainHover}, ${({ theme }) => theme.colors.main} 60%, #6a4fe3);
    color: ${({ theme }) => theme.colors.white};
    font-size: 1rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    cursor: pointer;
    transition: box-shadow ${({ theme }) => theme.motion.duration.base} ease, transform ${({ theme }) => theme.motion.duration.hover} linear;

    &:hover:not(:disabled) {
      box-shadow: 0 8px 20px rgba(46, 45, 239, 0.4);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.heading};
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.7;
      cursor: progress;
    }
  }

  .msg {
    margin-top: ${({ theme }) => theme.space(3)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    text-align: center;
  }

  .msg:not(:empty) {
    display: inline-block;
    padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(4)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.white};
  }

  .msgwrap {
    text-align: center;
  }

  .msg.error {
    color: ${({ theme }) => theme.colors.danger};
  }

  .msg.ok {
    color: ${({ theme }) => theme.colors.greenText};
  }

  .msg.info {
    color: ${({ theme }) => theme.colors.heading};
  }
`;

export const WorkshopForm = () => {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const { form } = workshop;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(email);
    setError(problem);
    if (problem) {
      setStatus("idle");
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    // Sin endpoint configurado no se simula un envío: se avisa con claridad.
    if (!siteConfig.workshopEndpoint) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(siteConfig.workshopEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "workshop-ia-empresas" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("failed");
    }
  };

  const message =
    error ||
    (status === "sent" && "Registro recibido. Gracias por tu interés en el Workshop.") ||
    (status === "unavailable" && "El registro aún no está habilitado. Escríbenos desde la sección Contacto.") ||
    (status === "failed" && "No pudimos enviar tu registro. Inténtalo de nuevo en unos minutos.") ||
    "";
  const tone = error || status === "failed" ? "error" : status === "sent" ? "ok" : "info";

  return (
    <Form onSubmit={onSubmit} noValidate>
      <VisuallyHidden as="label" htmlFor={`${id}-email`}>
        {form.emailLabel}
      </VisuallyHidden>
      <div className="bar">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={form.emailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-msg`}
          required
        />
        <button className="submit" type="submit" disabled={status === "sending"}>
          {form.submit}
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="msgwrap">
        <p id={`${id}-msg`} className={`msg ${tone}`} role={error || status === "failed" ? "alert" : "status"}>
          {message}
        </p>
      </div>
    </Form>
  );
};
