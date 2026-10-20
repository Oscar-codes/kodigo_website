import { useEffect, useId, useRef, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";

// Ventana modal con el estilo del sitio (panel navy → violeta, como el resto de bloques oscuros), sobre el elemento nativo <dialog>: el navegador aporta el foco atrapado, el cierre
// con Escape y la inertización del fondo. Se cierra también con la X y al pulsar fuera de la tarjeta. El contenido solo se
// monta mientras está abierta (así el formulario de HubSpot no se carga hasta que se necesita) y el scroll de la página
// queda bloqueado.
const pop = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: none; }
`;

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Dialog = styled.dialog<{ $b2b: boolean }>`
  width: min(640px, calc(100vw - 2rem));
  max-height: min(90dvh, 920px);
  margin: auto;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 100%);
  color: ${({ theme }) => theme.colors.onNavy};
  box-shadow: 0 30px 80px rgba(7, 20, 49, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08);

  &[open] {
    display: flex;
    flex-direction: column;
  }

  &::backdrop {
    background: rgba(7, 20, 49, 0.62);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }

  @media (prefers-reduced-motion: no-preference) {
    &[open] {
      animation: ${pop} 0.28s ${({ theme }) => theme.motion.easing} both;
    }

    &[open]::backdrop {
      animation: ${fade} 0.28s ease both;
    }
  }

  /* Filo con el degradado institucional arriba de la tarjeta. */
  &::before {
    content: "";
    display: block;
    flex: none;
    height: 5px;
    background: ${({ theme }) => theme.colors.gradientCta};
  }

  .head {
    flex: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space(4)};
    padding: ${({ theme }) => `${theme.space(6)} ${theme.space(6)} ${theme.space(2)}`};
  }

  .eyebrow {
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  h2 {
    font-size: clamp(1.375rem, 1.1rem + 1vw, 1.75rem);
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.white};
  }

  .close {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: ${({ theme }) => theme.colors.white};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .close:hover {
    background: rgba(255, 255, 255, 0.24);
  }

  .close:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.white};
    outline-offset: 2px;
  }

  .body {
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(6)} ${theme.space(7)}`};
  }

  @media (max-width: 575px) {
    .head {
      padding-inline: ${({ theme }) => theme.space(4)};
    }

    .body {
      padding-inline: ${({ theme }) => theme.space(1)};
    }
  }

  /* Tono de la landing B2B (Alianzas): fondo morado profundo, borde lavanda y filo/acento con el degradado lavanda → teal. */
  ${({ $b2b, theme }) =>
    $b2b &&
    css`
      border: 1px solid ${theme.b2b.cardBorder};
      border-radius: 28px;
      background: ${theme.b2b.bgGradient};
      color: ${theme.b2b.text};
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6), 0 0 60px -20px rgba(110, 60, 200, 0.5);

      &::backdrop {
        background: rgba(26, 15, 69, 0.72);
      }

      &::before {
        background: ${theme.b2b.gradientKey};
      }

      .eyebrow {
        color: ${theme.b2b.teal};
      }

      h2 {
        color: ${theme.b2b.text};
      }
    `}
`;

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  /** Línea pequeña sobre el título (p. ej. "Aplicar"). */
  eyebrow?: string;
  title: string;
  /** "b2b" = paleta morada de la landing Alianzas; por defecto, el panel navy del resto del sitio. */
  tone?: "default" | "b2b";
  children: ReactNode;
}

export const FormModal = ({ open, onClose, eyebrow, title, tone = "default", children }: FormModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  return (
    <Dialog
      ref={ref}
      $b2b={tone === "b2b"}
      aria-labelledby={titleId}
      onClose={onClose}
      // Pulsar fuera de la tarjeta (el <dialog> ocupa solo la tarjeta; el resto es el fondo) cierra la ventana.
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) onClose();
      }}
    >
      {open && (
        <>
          <div className="head">
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h2 id={titleId}>{title}</h2>
            </div>
            <button type="button" className="close" aria-label="Cerrar" onClick={onClose}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="body">{children}</div>
        </>
      )}
    </Dialog>
  );
};
