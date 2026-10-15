import styled from "styled-components";
import benefitsBg from "@/assets/photos/benefits-bg.webp";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { Reveal } from "../ui/Reveal";
import { ApplyForm } from "./ApplyForm";

// Banda final de la home ("Aplicar", destino del menú): panel navy → violeta con el mensaje y los pasos del proceso a la
// izquierda y el formulario de 4 fases a la derecha (ApplyForm). Mismo patrón de círculos `Float` + zoom `Reveal`.

// Mismo fondo que la sección "Beneficios" (foto de reunión bajo un velo azul de marca). Como esta es la última sección
// de la página, el velo no se funde con el tono claro de abajo: se mantiene azul para que el texto blanco se lea.
const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(19, 30, 75, 0.92) 0%, rgba(30, 40, 130, 0.7) 45%, rgba(60, 70, 205, 0.6) 100%),
    url(${benefitsBg}) center / cover no-repeat,
    ${({ theme }) => theme.colors.navy};
`;

const Panel = styled.div`
  position: relative;
  isolation: isolate;
  padding: ${({ theme }) => `${theme.space(4)} 0`};
  color: ${({ theme }) => theme.colors.white};

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(8)} 0`};
  }
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: ${({ theme }) => theme.space(14)};
  }
`;

const Label = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space(4)};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.lilac};
`;

const Heading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.space(6)};
  max-width: 18ch;
  font-size: clamp(1.875rem, 1.2rem + 3vw, 3.25rem);
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.white};

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.green};
  }
`;

const Lead = styled.p`
  margin: 0 0 ${({ theme }) => theme.space(8)};
  max-width: 52ch;
  font-size: clamp(0.9375rem, 0.85rem + 0.4vw, 1.0625rem);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.onNavy};
`;

/* Pasos del proceso: línea vertical con un punto por paso, como en la referencia. */
const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
  margin: 0;
  padding: 0 0 0 ${({ theme }) => theme.space(6)};
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: rgba(255, 255, 255, 0.25);
  }

  li {
    position: relative;
  }

  li::before {
    content: "";
    position: absolute;
    left: -${({ theme }) => theme.space(6)};
    top: 7px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.lilac};
  }

  strong {
    display: block;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.onNavy};
  }
`;

const Circle = styled(Float)`
  z-index: -1;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);

  &.blob {
    background: radial-gradient(50% 50% at 50% 50%, ${({ theme }) => theme.colors.lilac}4d, transparent 70%);
  }
`;

export const CallToAction = ({ flushTop = false }: { flushTop?: boolean }) => (
  <Wrap
    id="cta"
    aria-labelledby="cta-title"
    style={flushTop ? { paddingTop: 0 } : undefined}
  >
    <Container>
      <Reveal direction="zoom">
        <Panel>
          <Circle className="blob" style={{ width: 420, height: 420, left: "-15%", top: "-25%" }} $range={18} />
          <Circle style={{ width: 260, height: 260, right: "-8%", bottom: "-15%" }} $range={14} $delay={-3} />
          <Circle style={{ width: 160, height: 160, left: "10%", bottom: "10%" }} $range={10} $delay={-1.5} />
          <Circle style={{ width: 200, height: 200, right: "12%", top: "8%" }} $range={12} $delay={-2} />

          <Layout>
            <div>
              <Label id="cta-title">Tu próximo capítulo</Label>
              <Heading>
                El futuro que imaginas empieza con las habilidades que <em>desarrollas hoy.</em>
              </Heading>
              <Lead>
                Cuéntanos qué quieres lograr y te orientamos sobre el siguiente paso, ya sea para tu desarrollo profesional o para impulsar las capacidades de tu equipo.
              </Lead>
              <Timeline>
                <li>
                  <strong>Tu interés</strong>
                  <span>Completas tu perfil en 4 pasos.</span>
                </li>
                <li>
                  <strong>Orientación</strong>
                  <span>Revisamos tu perfil y tus objetivos para recomendarte la mejor ruta.</span>
                </li>
                <li>
                  <strong>Siguiente paso</strong>
                  <span>Te contactamos para acompañarte en tu proceso de inscripción.</span>
                </li>
              </Timeline>
            </div>
            <ApplyForm />
          </Layout>
        </Panel>
      </Reveal>
    </Container>
  </Wrap>
);
