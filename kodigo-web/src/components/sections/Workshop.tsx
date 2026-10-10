import styled from "styled-components";
import bulb from "@/assets/icons/bulb.png";
import path from "@/assets/icons/path.png";
import target from "@/assets/icons/target.png";
import { workshop } from "@/data/alliances";
import { flipInY } from "@/styles/effects";
import { media } from "@/styles/theme";
import { Container } from "../ui/Container";
import { BookOpen } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { WorkshopForm } from "./WorkshopForm";

// Iconos oficiales de Kodigo (la asignación icono -> paso es una propuesta, igual que en Beneficios).
const icons = { target, bulb, path } as const;

// Bloque "Subscribe Our Newsletter" de Eduhall con los degradados de Kodigo: banda azul-violeta con puntos, título centrado,
// barra de correo blanca y, debajo, tres datos separados por líneas verticales (aquí, los tres pasos del workshop).
// El degradado no pasa a tonos claros bajo el texto (contraste AA con texto blanco); el lila solo es un resplandor suave.
const Band = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: ${({ theme }) => theme.section.y};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  background:
    radial-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1.6px) 0 0 / 22px 22px,
    radial-gradient(55% 90% at 92% 8%, rgba(175, 148, 248, 0.28), transparent 70%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.mainHover} 0%, ${({ theme }) => theme.colors.main} 50%, #6a4fe3 100%);
`;

const Head = styled.div`
  max-width: 760px;
  margin: 0 auto ${({ theme }) => theme.space(10)};

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.white};
  }

  p.lead {
    margin-top: ${({ theme }) => theme.space(4)};
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Steps = styled.ol`
  display: grid;
  max-width: 1040px;
  margin: ${({ theme }) => theme.space(14)} auto 0;

  ${media.up("md")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  > li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space(4)};
    padding: ${({ theme }) => theme.space(6)};
    border-top: 1px solid rgba(255, 255, 255, 0.28);

    ${media.up("md")} {
      border-top: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.28);
    }
  }

  > li:first-child {
    border-top: 0;
    border-left: 0;
  }

  /* Efecto animation-item de Eduhall: el icono gira al pasar el cursor por el paso. */
  > li:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.brandDark};
    box-shadow: 0 8px 24px rgba(7, 20, 49, 0.25);
  }

  h3 {
    max-width: 22ch;
    font-size: 1.1875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Workshop = () => (
  <Band aria-labelledby="workshop-title">
    <Container>
      <Head>
        <span className="label">
          <BookOpen />
          {workshop.label}
        </span>
        <h2 id="workshop-title">{workshop.title}</h2>
        <p className="lead">{workshop.lead}</p>
      </Head>
      <WorkshopForm />
      <Steps>
        {workshop.steps.map((s, i) => (
          <Reveal key={s.title} tag="li" index={i} direction="up">
            <div className="icon">
              <img src={icons[s.icon]} alt="" width={28} height={28} />
            </div>
            <h3>{s.title}</h3>
          </Reveal>
        ))}
      </Steps>
    </Container>
  </Band>
);
