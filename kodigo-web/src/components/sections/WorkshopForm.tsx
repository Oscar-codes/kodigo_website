import { useId, useState } from "react";
import styled from "styled-components";
import { workshop } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { ArrowRight } from "../ui/Icons";

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

// Formulario del pase de registro (landing B2B): etiqueta visible, campo oscuro con borde lavanda y botón primario con
// degradado lavanda → teal. El mensaje de estado se muestra bajo el botón, en un tono legible sobre el fondo morado.
const Form = styled.form`
  width: 100%;

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.b2b.text};
  }

  .bar {
    display: grid;
    gap: ${({ theme }) => theme.space(3)};
  }

  input {
    width: 100%;
    padding: 16px 18px;
    font: inherit;
    color: ${({ theme }) => theme.b2b.text};
    background: rgba(26, 15, 69, 0.7);
    border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
    border-radius: 14px;
    transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
      box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

    &::placeholder {
      color: ${({ theme }) => theme.b2b.text3};
    }

    &:hover {
      border-color: ${({ theme }) => theme.b2b.cardBorderActive};
    }

    &:focus-visible {
      outline: none;
      border-color: ${({ theme }) => theme.b2b.lavender};
      box-shadow: 0 0 0 3px rgba(196, 181, 245, 0.25);
    }

    &[aria-invalid="true"] {
      border-color: #ff8a7a;
      background: rgba(240, 78, 41, 0.12);
    }

    &[aria-invalid="true"]:focus-visible {
      box-shadow: 0 0 0 3px rgba(255, 138, 122, 0.3);
    }
  }

  .submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.space(2.5)};
    width: 100%;
    padding: 16px 28px;
    border: 0;
    border-radius: 14px;
    background: ${({ theme }) => theme.b2b.gradientKey};
    color: ${({ theme }) => theme.b2b.onGradient};
    font-size: 1rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    cursor: pointer;
    box-shadow: 0 10px 40px -10px rgba(127, 224, 204, 0.55);
    transition: box-shadow ${({ theme }) => theme.motion.duration.base} ease, transform ${({ theme }) => theme.motion.duration.hover} ease;

    &:hover:not(:disabled) {
      box-shadow: 0 14px 48px -10px rgba(127, 224, 204, 0.8);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.b2b.text};
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.7;
      cursor: progress;
    }
  }

  .msgwrap {
    text-align: center;
  }

  .msg {
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    text-align: center;
  }

  .msg:not(:empty) {
    margin-top: ${({ theme }) => theme.space(4)};
  }

  .msg.error {
    color: #ffb4a8;
  }

  .msg.ok {
    color: ${({ theme }) => theme.b2b.teal};
  }

  .msg.info {
    color: ${({ theme }) => theme.b2b.text2};
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
      <label htmlFor={`${id}-email`}>{form.emailLabel}</label>
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
