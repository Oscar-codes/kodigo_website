import styled from "styled-components";
import isotype from "@/assets/brand/isotype-white.webp";
import { upcomingWorkshops } from "@/data/alliances";
import { scalation } from "@/styles/effects";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container, Section } from "../ui/Container";
import { Clock, MapPin } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Bloque "Upcoming Events" de Eduhall: lista de eventos a la izquierda y un visual alto a la derecha.
const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: start;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
`;

const Event = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.colors.white};

  ${media.up("md")} {
    flex-direction: row;
    align-items: center;
    padding: ${({ theme }) => `${theme.space(5)} ${theme.space(8)}`};
  }

  .date {
    flex: none;
    color: ${({ theme }) => theme.colors.accentOnLight};
    min-width: 72px;
    text-align: center;
  }

  .day {
    display: block;
    font-size: 2.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  .month {
    display: block;
    margin-top: ${({ theme }) => theme.space(1)};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.heading};
  }

  .info {
    flex: 1;
    min-width: 0;

    ${media.up("md")} {
      padding-left: ${({ theme }) => theme.space(6)};
      border-left: 1px solid ${({ theme }) => theme.colors.borderStrong};
    }
  }

  .mode {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.text};
  }

  h3 {
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.3;
  }
`;

// Visual tipo video del "Upcoming Events" de Eduhall: panel alto con degradado violeta, puntos, isotipo y botón de play naranja.
// PENDIENTE: no hay video del workshop. El botón de play es solo decorativo hasta contar con el material.
const Visual = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 280px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background:
    radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1.6px) 0 0 / 22px 22px,
    url(${isotype}) no-repeat center 62% / 62% auto,
    radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.3), transparent 55%),
    linear-gradient(160deg, ${({ theme }) => theme.colors.mainHover}, ${({ theme }) => theme.colors.main} 55%, #6a4fe3);
  box-shadow: ${({ theme }) => theme.shadows.lift};

  ${media.up("lg")} {
    align-self: stretch;
    min-height: 400px;
  }

  .play {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 24px rgba(7, 20, 49, 0.3);
  }

  .play::before {
    content: "";
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    border: 2px solid rgba(243, 119, 57, 0.55);
  }

  @media (prefers-reduced-motion: no-preference) {
    .play::before {
      animation: ${scalation} 3s ease-in-out infinite;
    }
  }
`;

const Soon = styled.span`
  flex: none;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(6)}`};
  border: 1px dashed ${({ theme }) => theme.colors.main};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.accentOnLight};
`;

export const UpcomingWorkshops = () => (
  <Section $surface aria-labelledby="events-title">
    <Container>
      <Layout>
        <div>
          <SectionTitle id="events-title" label={upcomingWorkshops.label} title={upcomingWorkshops.title} lead={upcomingWorkshops.lead} align="left" />
          <List>
            {upcomingWorkshops.events.map((e, i) => (
              <Reveal key={e.title} tag="li" index={i} direction="up">
                <Event as="div">
                  <div className="date">
                    {e.soon ? (
                      <Clock size={40} />
                    ) : (
                      <>
                        <span className="day">{e.day}</span>
                        <span className="month">{e.month}</span>
                      </>
                    )}
                  </div>
                  <div className="info">
                    <p className="mode">
                      <MapPin />
                      {e.mode}
                    </p>
                    <h3>{e.title}</h3>
                  </div>
                  {e.soon ? (
                    <Soon>{upcomingWorkshops.soon}</Soon>
                  ) : (
                    <ButtonLink to="#workshop-title" variant="outline" arrow>
                      {upcomingWorkshops.cta}
                    </ButtonLink>
                  )}
                </Event>
              </Reveal>
            ))}
          </List>
        </div>
        <Visual aria-hidden="true">
          <span className="play">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" focusable="false">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </Visual>
      </Layout>
    </Container>
  </Section>
);
