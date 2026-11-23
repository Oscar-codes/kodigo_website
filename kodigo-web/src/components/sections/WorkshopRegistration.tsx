import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import styled from "styled-components";
import { workshop, type WorkshopIntent } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { FormModal } from "../ui/FormModal";
import { HubspotFrameForm } from "../ui/HubspotForm";

// Registro al Workshop (landing B2B): un único modal con el formulario de HubSpot que se abre desde los CTAs de la sección
// Workshops (reserva del 26 de noviembre y preinscripción 2027). El formulario solo se carga al abrirlo y el título/intro
// cambian según la intención, con el mismo formulario base.
// El formulario nuevo de HubSpot vive en un iframe: sus colores solo se cambian desde HubSpot. Este formulario usa etiquetas
// blancas, así que va sobre un panel oscuro (no claro) para que se lean; el iframe se muestra completo, sin recortes.
const Intro = styled.p`
  margin: 0 0 ${({ theme }) => theme.space(4)};
  padding-inline: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.b2b.text2};
`;

const Panel = styled.div`
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(4)}`};
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 20px;
  background: rgba(26, 15, 69, 0.55);
  box-shadow: 0 10px 40px -16px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  .status {
    color: ${({ theme }) => theme.b2b.text2};
  }

  .status.error {
    color: #ffb4a8;
  }
`;

const WorkshopRegistrationContext = createContext<(intent?: WorkshopIntent) => void>(() => undefined);

/** Devuelve la función que abre el modal de registro al Workshop (por defecto, el del 26 de noviembre de 2026). */
export const useWorkshopRegistration = () => useContext(WorkshopRegistrationContext);

export const WorkshopRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [intent, setIntent] = useState<WorkshopIntent | null>(null);
  const openModal = useCallback((next: WorkshopIntent = "nov26_2026") => setIntent(next), []);
  const closeModal = useCallback(() => setIntent(null), []);
  const value = useMemo(() => openModal, [openModal]);
  const copy = workshop.registration[intent ?? "nov26_2026"];

  return (
    <WorkshopRegistrationContext.Provider value={value}>
      {children}
      <FormModal open={intent !== null} onClose={closeModal} tone="b2b" eyebrow={copy.eyebrow} title={copy.title}>
        <Intro>{copy.intro}</Intro>
        <Panel>
          <HubspotFrameForm formId={siteConfig.hubspot.forms.workshop} />
        </Panel>
      </FormModal>
    </WorkshopRegistrationContext.Provider>
  );
};
