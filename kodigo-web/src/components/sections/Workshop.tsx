import styled from "styled-components";
import workshopBg from "@/assets/b2b/workshop-bg.webp";
import ticketHead from "@/assets/b2b/ticket-cabecera.webp";
import iconTarget from "@/assets/b2b/icons/workshop-01-oportunidades-objetivo.svg";
import iconBulb from "@/assets/b2b/icons/workshop-02-casos-de-uso-idea.svg";
import iconPath from "@/assets/b2b/icons/workshop-03-llevar-a-la-practica-ruta.svg";
import brand from "@/assets/brand/brand.json";
import logoWhite from "@/assets/brand/kodigo-logo-white.webp";
import { workshop } from "@/data/alliances";
import { flipInY } from "@/styles/effects";
import { media } from "@/styles/theme";
import { bracketLabel, headlineText, iconTile, imageBackdrop, keywordText } from "../ui/B2bKit";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { WorkshopForm } from "./WorkshopForm";

const icons = { target: iconTarget, bulb: iconBulb, path: iconPath } as const;

// Fondo de sección ya tratado en morado; los bordes se funden con el fondo de la página.
const Band = styled.section`
  ${imageBackdrop(workshopBg, 0.1)}
  overflow: hidden;
  padding-block: ${({ theme }) => theme.section.dense};
  color: ${({ theme }) => theme.b2b.text};
`;

// A la izquierda el encabezado y los tres pasos (filas con líneas finas); a la derecha el "pase" con el formulario.
// En el DOM el pase va antes de los pasos; desde `lg` la rejilla los reubica (en móvil se apilan en ese orden).
const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    grid-template-areas:
      "head ticket"
      "steps ticket";
    column-gap: ${({ theme }) => theme.space(16)};
    row-gap: ${({ theme }) => theme.space(8)};
  }
`;

const Head = styled.div`
  ${media.up("lg")} {
    grid-area: head;
    align-self: end;
  }

  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h2 {
    font-size: clamp(2.25rem, 1.4rem + 2.6vw, 3.5rem);
    line-height: 1.08;
    ${headlineText}
  }

  h2 em {
    font-style: normal;
    ${keywordText}
  }

  p.lead {
    max-width: 48ch;
    margin-top: ${({ theme }) => theme.space(5)};
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.b2b.text2};
  }
`;

const TicketSlot = styled(Reveal)`
  /* En móvil el registro va después de los pasos. */
  order: 1;

  ${media.up("lg")} {
    order: 0;
    grid-area: ticket;
  }
`;

// Pase de acceso: tarjeta morada con la foto del workshop arriba (logo y etiqueta encima), línea punteada y el formulario.
const Ticket = styled.div`
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 28px;
  background: ${({ theme }) => theme.b2b.bg2};
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.55), 0 0 60px -20px rgba(110, 60, 200, 0.5);

  .stub {
    position: relative;
    aspect-ratio: 1840 / 800;
    background: url(${ticketHead}) center / cover no-repeat;
  }

  .logo {
    position: absolute;
    top: ${({ theme }) => theme.space(6)};
    left: ${({ theme }) => theme.space(6)};
    width: 128px;
    height: auto;
  }

  .tag {
    position: absolute;
    left: ${({ theme }) => theme.space(6)};
    bottom: ${({ theme }) => theme.space(4)};
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.b2b.lavender};
  }

  .body {
    padding: ${({ theme }) => `${theme.space(6)} ${theme.space(6)} ${theme.space(7)}`};
    border-top: 2px dashed rgba(196, 181, 245, 0.3);
  }
`;

const Steps = styled.ol`
  ${media.up("lg")} {
    grid-area: steps;
    align-self: start;
  }
  border-top: 1px solid ${({ theme }) => theme.b2b.line};

  > li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(5)};
    padding: ${({ theme }) => `${theme.space(4)} 0`};
    border-bottom: 1px solid ${({ theme }) => theme.b2b.line};
  }

  > li:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  .icon {
    ${iconTile}
    width: 50px;
    height: 50px;
  }

  .icon img {
    width: 22px;
    height: 22px;
  }

  h3 {
    font-size: 1.1875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.4;
    color: ${({ theme }) => theme.b2b.text};
  }
`;

// Resalta la última palabra del título ("empresa") con el degradado de palabra clave.
const emphasize = (title: string) => {
  const i = title.lastIndexOf(" ");
  return i < 0 ? title : (
    <>
      {title.slice(0, i + 1)}
      <em>{title.slice(i + 1)}</em>
    </>
  );
};

export const Workshop = () => (
  <Band aria-labelledby="workshop-title">
    <Container>
      <Layout>
        <Head>
          <span className="label">{workshop.label}</span>
          <h2 id="workshop-title">{emphasize(workshop.title)}</h2>
          <p className="lead">{workshop.lead}</p>
        </Head>
        <TicketSlot direction="up">
          <Ticket>
            <div className="stub" aria-hidden="true">
              <img className="logo" src={logoWhite} alt="" width={brand.logoWhite.width} height={brand.logoWhite.height} />
              <span className="tag">{workshop.ticketTag}</span>
            </div>
            <div className="body">
              <WorkshopForm />
            </div>
          </Ticket>
        </TicketSlot>
        <Steps>
          {workshop.steps.map((s, i) => (
            <Reveal key={s.title} tag="li" index={i} direction="up">
              <div className="icon">
                <img src={icons[s.icon]} alt="" width={22} height={22} loading="lazy" />
              </div>
              <h3>{s.title}</h3>
            </Reveal>
          ))}
        </Steps>
      </Layout>
    </Container>
  </Band>
);
