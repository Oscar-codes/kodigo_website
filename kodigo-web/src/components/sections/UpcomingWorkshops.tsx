import styled, { keyframes } from "styled-components";
import sphere from "@/assets/aivent/sphere.webp";
import { upcomingWorkshops } from "@/data/alliances";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Container, Section } from "../ui/Container";
import { Clock, MapPin } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Agenda estilo AIvent ("Schedule"): filas separadas por líneas finas sobre fondo índigo oscuro (fecha a la izquierda,
// título y modalidad al centro, acción a la derecha) y, a la derecha, la esfera 3D violeta de la plantilla girando despacio.
const Block = styled(Section)`
  background: ${({ theme }) => theme.colors.aiventDark};
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
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => `${theme.space(7)} 0`};
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  ${media.up("md")} {
    flex-direction: row;
    align-items: center;
  }

  .date {
    flex: none;
    min-width: 72px;
    text-align: center;
    color: ${({ theme }) => theme.colors.lilac};
  }

  .day {
    display: block;
    font-size: 2.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    color: ${({ theme }) => theme.colors.white};
  }

  .month {
    display: block;
    margin-top: ${({ theme }) => theme.space(1)};
    font-size: 0.875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.lilac};
  }

  .info {
    flex: 1;
    min-width: 0;

    ${media.up("md")} {
      padding-left: ${({ theme }) => theme.space(6)};
      border-left: 1px solid rgba(255, 255, 255, 0.16);
    }
  }

  .mode {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.onNavy};
  }

  h3 {
    font-size: 1.375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Esfera decorativa de AIvent (rotate-animation de la plantilla). Con movimiento reducido queda quieta.
const Visual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: min(100%, 460px);
    height: auto;
    filter: drop-shadow(0 20px 50px rgba(118, 77, 240, 0.45));
  }

  @media (prefers-reduced-motion: no-preference) {
    img {
      animation: ${spin} 60s linear infinite;
    }
  }
`;

const Soon = styled.span`
  flex: none;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(6)}`};
  border: 1px dashed ${({ theme }) => theme.colors.lilac};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.white};
`;

export const UpcomingWorkshops = () => (
  <Block aria-labelledby="events-title">
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
                    <ButtonLink to="#workshop-title" variant="outlineLight" arrow>
                      {upcomingWorkshops.cta}
                    </ButtonLink>
                  )}
                </Event>
              </Reveal>
            ))}
          </List>
        </div>
        <Visual aria-hidden="true">
          <img src={sphere} alt="" width={900} height={900} loading="lazy" />
        </Visual>
      </Layout>
    </Container>
  </Block>
);
