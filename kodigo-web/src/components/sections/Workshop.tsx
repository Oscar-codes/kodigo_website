import styled, { css } from "styled-components";
import workshopBg from "@/assets/b2b/workshop-bg.webp";
import ticketHead from "@/assets/b2b/ticket-cabecera.webp";
import iconTarget from "@/assets/b2b/icons/workshop-01-oportunidades-objetivo.svg";
import iconBulb from "@/assets/b2b/icons/workshop-02-casos-de-uso-idea.svg";
import iconPath from "@/assets/b2b/icons/workshop-03-llevar-a-la-practica-ruta.svg";
import brand from "@/assets/brand/brand.json";
import logoWhite from "@/assets/brand/kodigo-logo-white.webp";
import { workshop } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { flipInY } from "@/styles/effects";
import { media } from "@/styles/theme";
import { bracketLabel, glassCard, headlineText, iconTile, imageBackdrop, keywordText } from "../ui/B2bKit";
import { ButtonAction, ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { useWorkshopRegistration } from "./WorkshopRegistration";

const icons = { target: iconTarget, bulb: iconBulb, path: iconPath } as const;

// Fondo de sección ya tratado en morado; los bordes se funden con el fondo de la página.
const Band = styled.section`
  ${imageBackdrop(workshopBg, 0.1)}
  scroll-margin-top: calc(${({ theme }) => theme.layout.headerHeight} + 8px);
  overflow: hidden;
  padding-block: ${({ theme }) => theme.section.dense};
  color: ${({ theme }) => theme.b2b.text};
`;

// A la izquierda el encabezado y los tres pasos (filas con líneas finas); a la derecha el pase con el workshop de 2026 y
// la preinscripción 2027. En el DOM el pase va antes de los pasos; desde `lg` la rejilla los reubica (en móvil se apilan
// en ese orden: primero la conversión, después el respaldo).
const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: start;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
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

// Apila la tarjeta del 26 de noviembre y el bloque de preinscripción 2027.
const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
  width: 100%;
  max-width: 600px;
  margin-inline: auto;
`;

// Etiqueta del workshop: la de 2026 resalta con el degradado de marca; la de 2027 es más sobria (contorno).
const Badge = styled.span<{ $soft?: boolean }>`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &::before {
    content: "";
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  ${({ $soft }) =>
    $soft
      ? css`
          border: 1px solid ${({ theme }) => theme.b2b.cardBorderActive};
          background: rgba(110, 60, 200, 0.18);
          color: ${({ theme }) => theme.b2b.lavender};
        `
      : css`
          background: ${({ theme }) => theme.b2b.gradientKey};
          color: ${({ theme }) => theme.b2b.onGradient};
        `}
`;

// Pase de acceso: tarjeta morada con la foto del workshop arriba (logo y etiqueta encima), línea punteada y el contenido.
const Ticket = styled.article`
  width: 100%;
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
    padding: ${({ theme }) => `${theme.space(5)} ${theme.space(6)} ${theme.space(6)}`};
    border-top: 2px dashed rgba(196, 181, 245, 0.3);
  }

  @media (max-width: 420px) {
    .body {
      padding-inline: ${({ theme }) => theme.space(4)};
    }
  }
`;

// FE-03: todos los datos del 26 de noviembre como texto HTML, con la insignia de último workshop del año.
const Event = styled.div`
  .badge {
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h3 {
    font-size: clamp(1.375rem, 1.2rem + 0.5vw, 1.625rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.b2b.text};
  }

  .description {
    margin-top: ${({ theme }) => theme.space(3)};
    font-size: 0.9375rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.b2b.text2};
  }
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => `${theme.space(3)} ${theme.space(5)}`};
  margin-top: ${({ theme }) => theme.space(5)};
  padding-top: ${({ theme }) => theme.space(4)};
  border-top: 1px solid ${({ theme }) => theme.b2b.line};

  ${media.up("sm")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  dt {
    font-size: 0.625rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.b2b.text3};
  }

  dd {
    margin: 2px 0 0;
    font-size: 0.9375rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.b2b.text};
  }

  .wide {
    ${media.up("sm")} {
      grid-column: 1 / -1;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  margin-top: ${({ theme }) => theme.space(5)};

  .support {
    flex: 1 1 190px;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.b2b.text2};
  }
`;

// FE-03: bloque de preinscripción 2027, visualmente secundario frente a la reserva del 26 de noviembre.
const Prereg = styled.aside`
  ${glassCard}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(6)}`};
  border-style: dashed;

  .badge {
    margin-bottom: ${({ theme }) => theme.space(1)};
  }

  h3 {
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.3;
    color: ${({ theme }) => theme.b2b.text};
  }

  > p {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.b2b.text2};
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space(3)};
    margin-top: ${({ theme }) => theme.space(2)};
  }

  .support {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.b2b.text2};
  }

  @media (max-width: 420px) {
    padding-inline: ${({ theme }) => theme.space(4)};
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

export const Workshop = () => {
  const openRegistration = useWorkshopRegistration();
  return (
  <Band id="workshops" aria-labelledby="workshop-title">
    <Container>
      <Layout>
        <Head>
          <span className="label">{workshop.label}</span>
          <h2 id="workshop-title">{emphasize(workshop.title)}</h2>
          <p className="lead">{workshop.lead}</p>
        </Head>
        <TicketSlot direction="up">
          <Stack>
            <Ticket>
              <div className="stub" aria-hidden="true">
                <img className="logo" src={logoWhite} alt="" width={brand.logoWhite.width} height={brand.logoWhite.height} />
                <span className="tag">{workshop.ticketTag}</span>
              </div>
              <div className="body">
                <Event>
                  <Badge className="badge">{workshop.upcoming.badge}</Badge>
                  <h3>{workshop.upcoming.title}</h3>
                  <p className="description">{workshop.upcoming.description}</p>
                  <Facts>
                    <div>
                      <dt>Fecha</dt>
                      <dd>{workshop.upcoming.date}</dd>
                    </div>
                    <div>
                      <dt>Horario</dt>
                      <dd>{workshop.upcoming.schedule}</dd>
                    </div>
                    <div>
                      <dt>Lugar</dt>
                      <dd>{workshop.upcoming.location}</dd>
                    </div>
                    <div>
                      <dt>Ponente</dt>
                      <dd>{workshop.upcoming.speaker}</dd>
                    </div>
                    <div className="wide">
                      <dt>Inversión</dt>
                      <dd>{workshop.upcoming.investment}</dd>
                    </div>
                  </Facts>
                  <Actions>
                    <ButtonAction
                      variant="gradient"
                      arrow="right"
                      haspopup="dialog"
                      onClick={() => openRegistration("nov26_2026")}
                    >
                      {workshop.upcoming.cta}
                    </ButtonAction>
                    <p className="support">{workshop.upcoming.supporting}</p>
                  </Actions>
                </Event>
              </div>
            </Ticket>
            <Prereg aria-labelledby="workshop-2027-title">
              <Badge $soft className="badge">{workshop.preregistration2027.badge}</Badge>
              <h3 id="workshop-2027-title">{workshop.preregistration2027.title}</h3>
              <p>{workshop.preregistration2027.description}</p>
              <div className="actions">
                {siteConfig.workshop2027Url ? (
                  <ButtonLink to={siteConfig.workshop2027Url} variant="ghost" arrow="right">
                    {workshop.preregistration2027.cta}
                  </ButtonLink>
                ) : (
                  <ButtonAction
                    variant="ghost"
                    arrow="right"
                    haspopup="dialog"
                    onClick={() => openRegistration("workshops_2027")}
                  >
                    {workshop.preregistration2027.cta}
                  </ButtonAction>
                )}
                <p className="support">{workshop.preregistration2027.supporting}</p>
              </div>
            </Prereg>
          </Stack>
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
};
