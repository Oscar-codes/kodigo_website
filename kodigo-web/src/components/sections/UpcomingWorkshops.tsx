import styled from "styled-components";
import { upcomingWorkshops } from "@/data/alliances";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Container, Section } from "../ui/Container";
import { Clock, MapPin } from "../ui/Icons";
import { Plexus, type GlobeOptions } from "../ui/Plexus";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Agenda de la landing B2B: filas separadas por líneas finas (fecha a la izquierda, modalidad y título al centro, acción
// debajo) y, a la derecha, un globo plexus (canvas) girando despacio.
const GLOBE: GlobeOptions = { seed: 3, count: 240, speed: 0.1 };

const Block = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

const List = styled.ul`
  border-top: 1px solid ${({ theme }) => theme.b2b.line};
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => `${theme.space(7)} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.b2b.line};

  ${media.up("md")} {
    flex-direction: row;
    align-items: center;
  }

  .date {
    flex: none;
    min-width: 72px;
    text-align: center;
    color: ${({ theme }) => theme.b2b.purpleLight};
  }

  .day {
    display: block;
    font-size: 2.75rem;
    font-weight: 800;
    line-height: 1;
    color: ${({ theme }) => theme.b2b.text};
  }

  .month {
    display: block;
    margin-top: ${({ theme }) => theme.space(1)};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.b2b.purpleLight};
  }

  .info {
    flex: 1;
    min-width: 0;

    ${media.up("md")} {
      padding-left: ${({ theme }) => theme.space(6)};
      border-left: 1px solid ${({ theme }) => theme.b2b.cardBorder};
    }
  }

  .mode {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.b2b.text3};
  }

  h3 {
    font-size: 1.375rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
    color: ${({ theme }) => theme.b2b.text};
  }
`;

// Globo decorativo: cuadrado, centrado y con tope de tamaño. El Plexus ya respeta el movimiento reducido (cuadro fijo).
const Visual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .globe {
    width: min(100%, 280px);
    aspect-ratio: 1;

    ${media.up("md")} {
      width: min(100%, 460px);
    }
  }
`;

const Soon = styled.span`
  flex: none;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(6)}`};
  border: 1px dashed rgba(196, 181, 245, 0.5);
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.b2b.text2};
`;

export const UpcomingWorkshops = () => (
  <Block id="proximos" aria-labelledby="events-title">
    <Container>
      <Layout>
        <div>
          <SectionTitle id="events-title" tone="dark" label={upcomingWorkshops.label} title={upcomingWorkshops.title} lead={upcomingWorkshops.lead} align="left" />
          <List>
            {upcomingWorkshops.events.map((e, i) => (
              <Reveal key={e.title} tag="li" index={i} direction="up">
                <Event>
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
                    <ButtonLink to="#workshop-title" variant="gradient" arrow>
                      {upcomingWorkshops.cta}
                    </ButtonLink>
                  )}
                </Event>
              </Reveal>
            ))}
          </List>
        </div>
        <Visual aria-hidden="true">
          <div className="globe">
            <Plexus kind="globe" options={GLOBE} />
          </div>
        </Visual>
      </Layout>
    </Container>
  </Block>
);
