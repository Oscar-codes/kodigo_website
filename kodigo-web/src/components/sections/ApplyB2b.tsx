import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { applySection } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { bracketLabel, headlineText, keywordText } from "../ui/B2bKit";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

// Formulario de HubSpot (embed v2) con el diseño de la landing B2B. El script de HubSpot se carga una sola vez, solo al
// acercarse a esta sección, y pinta el formulario dentro de un contenedor propio; los estilos de HubSpot se anulan
// (`css: ""`) y el aspecto lo define este componente. Es el destino del botón "Aplicar" del menú (ancla #aplicar).
interface HubspotApi {
  forms: { create: (options: Record<string, unknown>) => void };
}
declare global {
  interface Window {
    hbspt?: HubspotApi;
  }
}

const SCRIPT_SRC = "https://js.hsforms.net/forms/embed/v2.js";
let scriptPromise: Promise<void> | undefined;

const loadHubspot = () => {
  if (window.hbspt) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.charset = "utf-8";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = undefined;
      s.remove();
      reject(new Error("hsforms"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
};

const Block = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
  scroll-margin-top: calc(${({ theme }) => theme.layout.headerHeightScrolled} + 1rem);
`;

const Head = styled.div`
  max-width: 760px;
  margin: 0 auto ${({ theme }) => theme.space(10)};
  text-align: center;

  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h2 {
    font-size: clamp(2rem, 1.3rem + 2.4vw, 3.25rem);
    line-height: 1.1;
    ${headlineText}
  }

  h2 em {
    font-style: normal;
    ${keywordText}
  }
`;

// Tarjeta de vidrio morado con el formulario. Los selectores cubren el formulario clásico de HubSpot (.hs-form) y el
// nuevo (clases hsfc-*): campos oscuros con borde lavanda, etiquetas claras y botón con degradado lavanda → teal.
const Panel = styled.div`
  max-width: 760px;
  margin-inline: auto;
  padding: ${({ theme }) => theme.space(6)};
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 28px;
  background: ${({ theme }) => theme.b2b.cardBg};
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.55), 0 0 60px -20px rgba(110, 60, 200, 0.5);
  color: ${({ theme }) => theme.b2b.text2};

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.space(10)};
  }

  .status {
    text-align: center;
    color: ${({ theme }) => theme.b2b.text2};
  }

  .status.error {
    color: #ffb4a8;
  }

  form {
    display: grid;
    gap: ${({ theme }) => theme.space(5)};
  }

  fieldset {
    max-width: none !important;
    margin: 0;
    padding: 0;
    border: 0;
  }

  fieldset.form-columns-2,
  fieldset.form-columns-3 {
    display: grid;
    gap: ${({ theme }) => theme.space(5)};
  }

  @media (min-width: 768px) {
    fieldset.form-columns-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    fieldset.form-columns-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .hs-form-field,
  .hs-form-field .input,
  [class*="hsfc-FieldLayout"] {
    float: none !important;
    width: 100% !important;
    margin: 0 !important;
  }

  label,
  legend,
  [class*="hsfc-FieldLabel"] {
    display: block;
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.b2b.text};
  }

  /* Este formulario usa placeholders y deja las etiquetas vacías: no reservar su espacio. */
  label:has(> span:empty) {
    display: none;
  }

  .hs-form-required,
  [class*="hsfc-FieldLabel"] [class*="required"] {
    margin-left: 2px;
    color: ${({ theme }) => theme.b2b.teal};
  }

  .hs-field-desc,
  [class*="hsfc-FieldDescription"],
  .hs-richtext,
  .legal-consent-container,
  .legal-consent-container p {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.b2b.text3};
  }

  .hs-richtext a,
  .legal-consent-container a {
    color: ${({ theme }) => theme.b2b.lavender};
    text-decoration: underline;
  }

  input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),
  select,
  textarea {
    width: 100% !important;
    height: auto !important;
    padding: 15px 18px !important;
    line-height: 1.4;
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

    &:focus,
    &:focus-visible {
      outline: none;
      border-color: ${({ theme }) => theme.b2b.lavender};
      box-shadow: 0 0 0 3px rgba(196, 181, 245, 0.25);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  select option {
    color: #1a0f45;
  }

  input[type="checkbox"],
  input[type="radio"] {
    width: auto !important;
    margin-right: ${({ theme }) => theme.space(2)};
    accent-color: ${({ theme }) => theme.b2b.teal};
  }

  ul.inputs-list {
    display: grid;
    gap: ${({ theme }) => theme.space(2)};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  ul.inputs-list label {
    display: flex;
    align-items: flex-start;
    font-weight: ${({ theme }) => theme.weights.regular};
  }

  /* Errores de validación (visibles sobre el fondo morado). */
  .hs-error-msgs,
  [class*="hsfc-ErrorAlert"] {
    margin: ${({ theme }) => theme.space(1.5)} 0 0;
    padding: 0;
    list-style: none;
  }

  .hs-error-msg,
  .hs-error-msgs label,
  [class*="hsfc-ErrorAlert"] {
    font-size: 0.8125rem;
    color: #ffb4a8;
  }

  input.invalid,
  input.error,
  select.invalid,
  textarea.invalid {
    border-color: #ff8a7a;
    background: rgba(240, 78, 41, 0.12);
  }

  /* Botón de envío: primario de la landing (degradado lavanda → teal, texto morado oscuro). */
  input[type="submit"],
  .hs-button,
  button[type="submit"],
  [class*="hsfc-Button"] {
    width: 100%;
    padding: 16px 28px;
    border: 0;
    border-radius: 14px;
    background: ${({ theme }) => theme.b2b.gradientKey};
    color: ${({ theme }) => theme.b2b.onGradient};
    font: inherit;
    font-size: 1rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    cursor: pointer;
    box-shadow: 0 10px 40px -10px rgba(127, 224, 204, 0.55);
    transition: box-shadow ${({ theme }) => theme.motion.duration.base} ease, transform ${({ theme }) => theme.motion.duration.hover} ease;

    &:hover {
      box-shadow: 0 14px 48px -10px rgba(127, 224, 204, 0.8);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.b2b.text};
      outline-offset: 2px;
    }
  }

  .submitted-message,
  [class*="hsfc-PostSubmit"] {
    padding: ${({ theme }) => theme.space(6)} 0;
    text-align: center;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.b2b.teal};
  }
`;

type State = "idle" | "loading" | "ready" | "error";

export const ApplyB2b = () => {
  const reactId = useId().replace(/:/g, "");
  const targetId = `hs-form-${reactId}`;
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("idle");

  // El formulario se carga cuando la sección está cerca de la pantalla (o al llegar por el botón "Aplicar").
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    let cancelled = false;
    const start = () => {
      setState("loading");
      loadHubspot()
        .then(() => {
          if (cancelled || !window.hbspt) return;
          const { portalId, formId, region } = siteConfig.hubspotForm;
          window.hbspt.forms.create({ portalId, formId, region, target: `#${targetId}`, css: "", onFormReady: () => !cancelled && setState("ready") });
        })
        .catch(() => !cancelled && setState("error"));
    };
    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
      document.getElementById(targetId)?.replaceChildren();
    };
  }, [targetId]);

  return (
    <Block id="aplicar" ref={sectionRef} aria-labelledby="apply-title">
      <Container>
        <Head>
          <span className="label">{applySection.label}</span>
          <h2 id="apply-title">{applySection.title}</h2>
        </Head>
        <Reveal direction="up">
          <Panel>
            {(state === "idle" || state === "loading") && (
              <p className="status" role="status">
                {applySection.loading}
              </p>
            )}
            {state === "error" && (
              <p className="status error" role="alert">
                {applySection.error}
              </p>
            )}
            <div id={targetId} />
          </Panel>
        </Reveal>
      </Container>
    </Block>
  );
};
