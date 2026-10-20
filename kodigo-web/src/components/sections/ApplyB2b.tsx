import styled from "styled-components";
import { applySection } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { bracketLabel, headlineText } from "../ui/B2bKit";
import { Container, Section } from "../ui/Container";
import { HubspotForm } from "../ui/HubspotForm";
import { Reveal } from "../ui/Reveal";

// Sección "Aplicar" de la landing B2B: formulario de HubSpot con el diseño morado de la página. Es el destino del botón
// "Aplicar" del menú y del footer en esta página (ancla #aplicar).
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
`;

// Tarjeta de vidrio morado que contiene el formulario.
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

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.space(10)};
  }
`;

export const ApplyB2b = () => (
  <Block id="aplicar" aria-labelledby="apply-title">
    <Container>
      <Head>
        <span className="label">{applySection.label}</span>
        <h2 id="apply-title">{applySection.title}</h2>
      </Head>
      <Reveal direction="up">
        <Panel>
          <HubspotForm formId={siteConfig.hubspot.forms.alianzas} lazy loadingText={applySection.loading} errorText={applySection.error} />
        </Panel>
      </Reveal>
    </Container>
  </Block>
);
