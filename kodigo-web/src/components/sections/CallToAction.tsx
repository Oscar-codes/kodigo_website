import styled from "styled-components";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { Reveal } from "../ui/Reveal";

// Banda final de la home: gradiente navy → violeta con gradiente radial que cierra el Inicio.
// Texto centrado, palabra clave en verde Kodigo (#2FA75F), CTA primario blanco y CTA secundario
// "outline-light" para combinar con el fondo oscuro. Mismo patrón de círculos `Float` + zoom `Reveal`.

const Panel = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  text-align: center;
  padding: ${({ theme }) => `${theme.space(16)} ${theme.space(6)}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(70% 100% at 50% 100%, ${({ theme }) => theme.colors.main}cc, transparent 70%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 100%);
  color: ${({ theme }) => theme.colors.white};

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(20)} ${theme.space(10)}`};
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
  margin: 0 auto ${({ theme }) => theme.space(6)};
  max-width: 22ch;
  font-size: clamp(1.875rem, 1.2rem + 3vw, 3.5rem);
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
  margin: 0 auto ${({ theme }) => theme.space(9)};
  max-width: 56ch;
  font-size: clamp(0.9375rem, 0.85rem + 0.4vw, 1.0625rem);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.onNavy};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(4)};
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
  <Section
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

          <Label id="cta-title">Tu próximo capítulo</Label>
          <Heading>
            El futuro que imaginas empieza con lo que <em>aprendes hoy.</em>
          </Heading>
          <Lead>
            Descubre las opciones de formación que pueden ayudarte a crecer profesionalmente. Estamos para orientarte.
          </Lead>

          <ButtonRow>
            <ButtonLink to="/bootcamps" variant="light" arrow="right">
              Quiero recibir orientación
            </ButtonLink>
            <ButtonLink to="/bootcamps" variant="outlineLight">
              Ver todos los bootcamps
            </ButtonLink>
          </ButtonRow>
        </Panel>
      </Reveal>
    </Container>
  </Section>
);
