import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import styled from "styled-components";
import { workshop } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { FormModal } from "../ui/FormModal";
import { HubspotFrameForm } from "../ui/HubspotForm";

// Registro al Workshop (landing B2B): un único modal con el formulario de HubSpot que se abre desde cualquier botón de
// registro de la página (pase del Workshop y agenda de próximos workshops). El formulario solo se carga al abrirlo.
// El formulario nuevo de HubSpot vive en un iframe: sus colores (etiquetas oscuras) solo se cambian desde HubSpot. Para que las
// etiquetas se lean aquí, va sobre un panel claro lavanda dentro del modal morado; el texto introductorio va fuera, en blanco.
const Intro = styled.p`
  margin: 0 0 ${({ theme }) => theme.space(4)};
  padding-inline: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.b2b.text2};
`;

const Panel = styled.div`
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(4)}`};
  border-radius: 20px;
  background: #f4f1ff;
  box-shadow: 0 10px 40px -16px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  /* El texto introductorio de HubSpot es blanco (invisible sobre este panel) pero ocupa espacio: se sube el iframe para
     recortarlo por arriba. Ajuste visual; lo limpio es quitar ese texto en HubSpot (Contenido del formulario). */
  .hs-form-frame {
    margin-top: -90px;
  }

  .status {
    color: ${({ theme }) => theme.b2b.bg2};
  }

  .status.error {
    color: #b42318;
  }
`;

const WorkshopRegistrationContext = createContext<() => void>(() => undefined);

/** Devuelve la función que abre el modal de registro al Workshop. */
export const useWorkshopRegistration = () => useContext(WorkshopRegistrationContext);

export const WorkshopRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const value = useMemo(() => openModal, [openModal]);

  return (
    <WorkshopRegistrationContext.Provider value={value}>
      {children}
      <FormModal open={open} onClose={closeModal} tone="b2b" eyebrow={workshop.ticketTag} title={workshop.modalTitle}>
        <Intro>{workshop.modalIntro}</Intro>
        <Panel>
          <HubspotFrameForm formId={siteConfig.hubspot.forms.workshop} />
        </Panel>
      </FormModal>
    </WorkshopRegistrationContext.Provider>
  );
};
