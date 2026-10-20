import { useEffect, useId, useRef, useState } from "react";
import styled, { css, type DefaultTheme } from "styled-components";
import { siteConfig } from "@/data/site";

// Formularios de HubSpot. Hay dos tipos de formulario y cada uno se incrusta distinto:
//  - Clásico (embed v2, `hbspt.forms.create`): se pinta en la propia página, con los estilos de HubSpot anulados (`css: ""`);
//    el aspecto lo define este archivo con la paleta morada de la landing B2B (<HubspotForm>, sección Aplicar de Alianzas).
//  - Nuevo (embed `hs-form-frame`, el código "Código para incrustar" de HubSpot): se pinta dentro de un iframe, así que sus
//    campos solo se estilizan desde HubSpot (pestaña Estilo del formulario); aquí solo se carga (<HubspotFrameForm>,
//    modales de los bootcamps).
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

const palette = (theme: DefaultTheme) => ({
  label: theme.b2b.text,
  hint: theme.b2b.text3,
  link: theme.b2b.lavender,
  accent: theme.b2b.teal,
  inputText: theme.b2b.text,
  inputBg: "rgba(26, 15, 69, 0.7)",
  inputBorder: theme.b2b.cardBorder,
  inputHover: theme.b2b.cardBorderActive,
  focusBorder: theme.b2b.lavender,
  focusRing: "rgba(196, 181, 245, 0.25)",
  placeholder: theme.b2b.text3,
  error: "#ffb4a8",
  errorBorder: "#ff8a7a",
  errorBg: "rgba(240, 78, 41, 0.12)",
  optionText: "#1a0f45",
  buttonBg: theme.b2b.gradientKey,
  buttonText: theme.b2b.onGradient,
  buttonShadow: "0 10px 40px -10px rgba(127, 224, 204, 0.55)",
  buttonShadowHover: "0 14px 48px -10px rgba(127, 224, 204, 0.8)",
  buttonRadius: "14px",
  inputRadius: "14px",
  success: theme.b2b.teal,
  status: theme.b2b.text2,
  buttonFocus: theme.b2b.text,
});

// Los selectores cubren el formulario clásico de HubSpot (.hs-form) y el nuevo (clases hsfc-*).
const Wrap = styled.div`
  ${({ theme }) => {
    const c = palette(theme);
    return css`
      color: ${c.status};

      .status {
        text-align: center;
        color: ${c.status};
      }

      .status.error {
        color: ${c.error};
      }

      form {
        display: grid;
        gap: ${theme.space(5)};
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
        gap: ${theme.space(5)};
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
        margin-bottom: ${theme.space(2)};
        font-size: 0.875rem;
        font-weight: ${theme.weights.medium};
        color: ${c.label};
      }

      /* Si el formulario usa placeholders y deja las etiquetas vacías, no se reserva su espacio. */
      label:has(> span:empty) {
        display: none;
      }

      .hs-form-required,
      [class*="hsfc-FieldLabel"] [class*="required"] {
        margin-left: 2px;
        color: ${c.accent};
      }

      .hs-field-desc,
      [class*="hsfc-FieldDescription"],
      .hs-richtext,
      .legal-consent-container,
      .legal-consent-container p {
        font-size: 0.8125rem;
        line-height: 1.5;
        color: ${c.hint};
      }

      .hs-richtext a,
      .legal-consent-container a {
        color: ${c.link};
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
        color: ${c.inputText};
        background: ${c.inputBg};
        border: 1px solid ${c.inputBorder};
        border-radius: ${c.inputRadius};
        transition:
          border-color ${theme.motion.duration.hover} linear,
          box-shadow ${theme.motion.duration.hover} linear;

        &::placeholder {
          color: ${c.placeholder};
        }

        &:hover {
          border-color: ${c.inputHover};
        }

        &:focus,
        &:focus-visible {
          outline: none;
          border-color: ${c.focusBorder};
          box-shadow: 0 0 0 3px ${c.focusRing};
        }
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      select option {
        color: ${c.optionText};
      }

      input[type="checkbox"],
      input[type="radio"] {
        width: auto !important;
        margin-right: ${theme.space(2)};
        accent-color: ${c.accent};
      }

      ul.inputs-list {
        display: grid;
        gap: ${theme.space(2)};
        margin: 0;
        padding: 0;
        list-style: none;
      }

      ul.inputs-list label {
        display: flex;
        align-items: flex-start;
        font-weight: ${theme.weights.regular};
      }

      /* Errores de validación. */
      .hs-error-msgs,
      [class*="hsfc-ErrorAlert"] {
        margin: ${theme.space(1.5)} 0 0;
        padding: 0;
        list-style: none;
      }

      .hs-error-msg,
      .hs-error-msgs label,
      [class*="hsfc-ErrorAlert"] {
        font-size: 0.8125rem;
        color: ${c.error};
      }

      input.invalid,
      input.error,
      select.invalid,
      textarea.invalid {
        border-color: ${c.errorBorder};
        background: ${c.errorBg};
      }

      /* Botón de envío: el primario de cada tono. */
      input[type="submit"],
      .hs-button,
      button[type="submit"],
      [class*="hsfc-Button"] {
        width: 100%;
        padding: 16px 28px;
        border: 0;
        border-radius: ${c.buttonRadius};
        background: ${c.buttonBg};
        color: ${c.buttonText};
        font: inherit;
        font-size: 1rem;
        font-weight: ${theme.weights.semibold};
        cursor: pointer;
        box-shadow: ${c.buttonShadow};
        transition:
          box-shadow ${theme.motion.duration.base} ease,
          transform ${theme.motion.duration.hover} ease;

        &:hover {
          box-shadow: ${c.buttonShadowHover};
          transform: translateY(-1px);
        }

        &:focus-visible {
          outline: 2px solid ${c.buttonFocus};
          outline-offset: 2px;
        }
      }

      .submitted-message,
      [class*="hsfc-PostSubmit"] {
        padding: ${theme.space(6)} 0;
        text-align: center;
        font-size: 1.125rem;
        color: ${c.success};
      }
    `;
  }}
`;

type State = "idle" | "loading" | "ready" | "error";

interface HubspotFormProps {
  formId: string;
  /** Espera a que el formulario esté cerca de la pantalla para cargar el script (secciones de página). */
  lazy?: boolean;
  loadingText?: string;
  errorText?: string;
}

export const HubspotForm = ({
  formId,
  lazy = false,
  loadingText = "Cargando formulario…",
  errorText = "No pudimos cargar el formulario. Recarga la página o inténtalo de nuevo en unos minutos.",
}: HubspotFormProps) => {
  const targetId = `hs-form-${useId().replace(/:/g, "")}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    let cancelled = false;
    const start = () => {
      setState("loading");
      loadHubspot()
        .then(() => {
          if (cancelled || !window.hbspt) return;
          const { portalId, region } = siteConfig.hubspot;
          window.hbspt.forms.create({ portalId, formId, region, target: `#${targetId}`, css: "", onFormReady: () => !cancelled && setState("ready") });
        })
        .catch(() => !cancelled && setState("error"));
    };
    let io: IntersectionObserver | undefined;
    if (lazy && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { rootMargin: "400px 0px" },
      );
      io.observe(node);
    } else {
      start();
    }
    return () => {
      cancelled = true;
      io?.disconnect();
      document.getElementById(targetId)?.replaceChildren();
    };
  }, [formId, lazy, targetId]);

  return (
    <Wrap ref={rootRef}>
      {(state === "idle" || state === "loading") && (
        <p className="status" role="status">
          {loadingText}
        </p>
      )}
      {state === "error" && (
        <p className="status error" role="alert">
          {errorText}
        </p>
      )}
      <div id={targetId} />
    </Wrap>
  );
};


// === Embed nuevo (hs-form-frame) ===
const FRAME_SCRIPT_ID = "hs-forms-frame-embed";
const FRAME_TIMEOUT_MS = 15000;

const loadFrameScript = () =>
  new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(FRAME_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("hsforms")), { once: true });
      }
      return;
    }
    const s = document.createElement("script");
    s.id = FRAME_SCRIPT_ID;
    s.src = `https://js.hsforms.net/forms/embed/${siteConfig.hubspot.portalId}.js`;
    s.defer = true;
    s.onload = () => {
      s.dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => {
      s.remove();
      reject(new Error("hsforms"));
    };
    document.head.appendChild(s);
  });

const FrameBox = styled.div`
  /* Se usa sobre el modal oscuro (el formulario de HubSpot trae etiquetas blancas y fondo transparente). */
  .status {
    text-align: center;
    color: ${({ theme }) => theme.colors.onNavy};
  }

  .status.error {
    color: #ffb4a8;
  }

  /* HubSpot dimensiona el iframe; mientras carga se reserva espacio para que la ventana no "salte". */
  .hs-form-frame {
    min-height: 280px;
  }

  .hs-form-frame iframe {
    display: block;
    border: 0;
  }
`;

/** Formulario nuevo de HubSpot (código "hs-form-frame"): el script lo detecta y lo pinta en un iframe. */
export const HubspotFrameForm = ({
  formId,
  loadingText = "Cargando formulario…",
  errorText = "No pudimos cargar el formulario. Recarga la página o inténtalo de nuevo en unos minutos.",
}: Omit<HubspotFormProps, "lazy">) => {
  const holder = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    let cancelled = false;
    setState("loading");
    // Listo cuando HubSpot inserta el iframe; error si el script falla o no aparece a tiempo.
    const watcher = new MutationObserver(() => {
      if (node.querySelector("iframe")) {
        watcher.disconnect();
        window.clearTimeout(timer);
        if (!cancelled) setState("ready");
      }
    });
    watcher.observe(node, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      watcher.disconnect();
      if (!cancelled && !node.querySelector("iframe")) setState("error");
    }, FRAME_TIMEOUT_MS);
    loadFrameScript().catch(() => {
      watcher.disconnect();
      window.clearTimeout(timer);
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
      watcher.disconnect();
      window.clearTimeout(timer);
    };
  }, [formId]);

  return (
    <FrameBox>
      {state === "loading" && (
        <p className="status" role="status">
          {loadingText}
        </p>
      )}
      {state === "error" && (
        <p className="status error" role="alert">
          {errorText}
        </p>
      )}
      <div ref={holder} className="hs-form-frame" data-region={siteConfig.hubspot.region} data-form-id={formId} data-portal-id={siteConfig.hubspot.portalId} />
    </FrameBox>
  );
};
