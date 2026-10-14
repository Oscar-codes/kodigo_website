import styled from "styled-components";
import bulb from "@/assets/icons/bulb.png";
import path from "@/assets/icons/path.png";
import target from "@/assets/icons/target.png";
import barcode from "@/assets/aivent/barcode.webp";
import network from "@/assets/aivent/bg-network.webp";
import ticketBg from "@/assets/aivent/ticket-bg.webp";
import brand from "@/assets/brand/brand.json";
import isotype from "@/assets/brand/isotype-white.webp";
import logoWhite from "@/assets/brand/kodigo-logo-white.webp";
import { workshop } from "@/data/alliances";
import { flipInY } from "@/styles/effects";
import { media } from "@/styles/theme";
import { bracketLabel, silverText } from "../ui/AiventKit";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { WorkshopForm } from "./WorkshopForm";

// Iconos oficiales de Kodigo (la asignación icono -> paso es una propuesta, igual que en Beneficios).
const icons = { target, bulb, path } as const;

// Bloque "Choose Your Pass" de AIvent adaptado: a la izquierda el encabezado y los tres pasos del workshop (filas con
// líneas finas, como la agenda) y a la derecha un "pase" de acceso con código de barras (d-ticket de la plantilla) cuya
// parte inferior es el formulario de registro. En el DOM el formulario va antes de los pasos; la rejilla los reubica.
const Band = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: ${({ theme }) => theme.section.dense};
  color: ${({ theme }) => theme.colors.white};
  /* Fondo de red (AIvent) con bordes que se funden con las secciones oscuras contiguas. */
  background:
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.aiventDark} 0%,
      rgba(16, 20, 53, 0.55) 22%,
      rgba(16, 20, 53, 0.6) 78%,
      ${({ theme }) => theme.colors.aiventDark} 100%
    ),
    radial-gradient(55% 70% at 85% 20%, rgba(118, 77, 240, 0.4), transparent 70%),
    url(${network}) center / cover no-repeat,
    ${({ theme }) => theme.colors.aiventDark};
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    grid-template-areas:
      "head ticket"
      "steps ticket";
    column-gap: ${({ theme }) => theme.space(16)};
    row-gap: ${({ theme }) => theme.space(8)};
  }
`;

const Head = styled.div`
  grid-area: head;
  align-self: end;

  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(3)};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.2;
    ${silverText}
  }

  p.lead {
    max-width: 52ch;
    margin-top: ${({ theme }) => theme.space(4)};
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.colors.onNavy};
  }
`;

// Pase de acceso: cabecera con la textura violeta de AIvent, logo de Kodigo, marca de agua del isotipo y código de barras;
// muescas laterales (perforación) y, debajo, el cuerpo oscuro con el formulario.
const TicketSlot = styled(Reveal)`
  grid-area: ticket;
`;

const Ticket = styled.div`
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.45));

  .stub {
    position: relative;
    overflow: hidden;
    min-height: 190px;
    padding: ${({ theme }) => theme.space(8)};
    border-radius: ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0 0;
    background: url(${ticketBg}) center / cover;
  }

  .logo {
    display: block;
    width: 140px;
    height: auto;
  }

  .mark {
    position: absolute;
    top: 50%;
    left: 42%;
    width: 46%;
    height: auto;
    opacity: 0.18;
    transform: translate(-50%, -50%);
  }

  .barcode {
    position: absolute;
    top: 50%;
    right: ${({ theme }) => theme.space(3)};
    width: 22%;
    height: auto;
    padding: ${({ theme }) => theme.space(2)};
    transform: translateY(-50%);
  }

  .body {
    position: relative;
    padding: ${({ theme }) => theme.space(8)};
    border-radius: 0 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventDark2};
    /* Perforación: dos muescas semicirculares donde se une la cabecera con el cuerpo. */
    -webkit-mask:
      radial-gradient(circle 12px at 0 0, transparent 98%, #000) top left / 51% 100% no-repeat,
      radial-gradient(circle 12px at 100% 0, transparent 98%, #000) top right / 51% 100% no-repeat;
    mask:
      radial-gradient(circle 12px at 0 0, transparent 98%, #000) top left / 51% 100% no-repeat,
      radial-gradient(circle 12px at 100% 0, transparent 98%, #000) top right / 51% 100% no-repeat;
    border-top: 2px dashed rgba(255, 255, 255, 0.18);
  }

  /* El formulario se apila dentro del pase: campo y botón a todo el ancho. */
  form {
    max-width: none;
  }

  form .bar {
    padding: 0;
    gap: ${({ theme }) => theme.space(3)};
    background: transparent;
    box-shadow: none;

    ${media.up("md")} {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  form input {
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  form .submit {
    width: 100%;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.aiventViolet};

    &:hover:not(:disabled) {
      box-shadow: 0 8px 20px rgba(118, 77, 240, 0.45);
    }
  }

  form .msg:not(:empty) {
    margin-top: ${({ theme }) => theme.space(4)};
  }
`;

const Steps = styled.ol`
  grid-area: steps;
  align-self: start;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  > li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(5)};
    padding: ${({ theme }) => `${theme.space(5)} 0`};
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  /* Efecto animation-item de Eduhall: el icono gira al pasar el cursor por el paso. */
  > li:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  .icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventViolet};
    box-shadow: 0 8px 24px rgba(118, 77, 240, 0.35);
  }

  h3 {
    font-size: 1.1875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Workshop = () => (
  <Band aria-labelledby="workshop-title">
    <Container>
      <Layout>
        <Head>
          <span className="label">{workshop.label}</span>
          <h2 id="workshop-title">{workshop.title}</h2>
          <p className="lead">{workshop.lead}</p>
        </Head>
        <TicketSlot direction="up">
          <Ticket>
            <div className="stub" aria-hidden="true">
              <img className="logo" src={logoWhite} alt="" width={brand.logoWhite.width} height={brand.logoWhite.height} />
              <img className="mark" src={isotype} alt="" width={240} height={240} />
              <img className="barcode" src={barcode} alt="" width={105} height={265} />
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
                <img src={icons[s.icon]} alt="" width={28} height={28} loading="lazy" />
              </div>
              <h3>{s.title}</h3>
            </Reveal>
          ))}
        </Steps>
      </Layout>
    </Container>
  </Band>
);
