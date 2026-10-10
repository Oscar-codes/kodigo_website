import styled from "styled-components";
import type { Step } from "@/data/content";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

const List = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};
  counter-reset: step;

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

// "Work process" de Eduhall: tarjeta blanca con un bloque tintado que se RELLENA de color principal al pasar el cursor
// (`item-hover`): el texto pasa a blanco y la insignia numerada se invierte.
const StepCard = styled(Reveal)`
  counter-increment: step;
  height: 100%;
  padding: ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;

  .inner {
    height: 100%;
    padding: ${({ theme }) => theme.space(6)};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  .circle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104px;
    height: 104px;
    margin: 0 auto ${({ theme }) => theme.space(6)};
    padding: ${({ theme }) => theme.space(3)};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  .circle::before {
    content: counter(step, decimal-leading-zero);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px dashed ${({ theme }) => theme.colors.main};
    border-radius: 50%;
    font-size: 1.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnLight};
    transition: transform ${({ theme }) => theme.motion.duration.base} ease;
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: ${({ theme }) => theme.type.h3};
    font-weight: ${({ theme }) => theme.weights.semibold};
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  p {
    font-size: 0.9375rem;
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover .inner {
    background: ${({ theme }) => theme.colors.main};
  }

  &:hover h3,
  &:hover p {
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover .circle::before {
    transform: rotate(8deg) scale(1.06);
  }
`;

export const Steps = ({ items }: { items: Step[] }) => (
  <Section $surface aria-labelledby="steps-title">
    <Container>
      <SectionTitle id="steps-title" label="Proceso" title="Cómo funciona" />
      <List>
        {items.map((s, i) => (
          <StepCard key={s.title} tag="li" index={i} direction="up">
            <div className="inner">
              <div className="circle" aria-hidden="true" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </StepCard>
        ))}
      </List>
    </Container>
  </Section>
);
