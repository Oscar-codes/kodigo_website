import styled from "styled-components";
import { impactStats } from "@/data/alliances";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { VisuallyHidden } from "../ui/VisuallyHidden";

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};

  ${media.up("md")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

// Contador de Eduhall: número grande en el violeta de Kodigo y etiqueta en mayúsculas debajo.
const Item = styled(Reveal)`
  height: 100%;
  padding: ${({ theme }) => `${theme.space(9)} ${theme.space(5)}`};
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    border-color: ${({ theme }) => theme.colors.main200};
    box-shadow: ${({ theme }) => theme.shadows.lift};
  }

  .number {
    display: block;
    font-size: clamp(2.75rem, 2rem + 3vw, 4rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.1;
    color: ${({ theme }) => theme.colors.main};
  }

  .label {
    display: block;
    margin-top: ${({ theme }) => theme.space(3)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.heading};
  }
`;

// Formato con coma de millares ("2,800"), como lo pidió Kodigo; el locale "es" no agrupa los números de 4 cifras.
const format = (n: number) => n.toLocaleString("en-US");

const Stat = ({ value, label, active, index }: { value: number; label: string; active: boolean; index: number }) => {
  const shown = useCountUp(value, active);
  return (
    <Item tag="li" index={index} direction="up">
      {/* El número animado se oculta a lectores de pantalla; ellos reciben el valor final. */}
      <span className="number" aria-hidden="true">
        +{format(shown)}
      </span>
      <VisuallyHidden>+{format(value)}</VisuallyHidden>
      <span className="label">{label}</span>
    </Item>
  );
};

export const ImpactStats = () => {
  const [ref, visible] = useInView<HTMLUListElement>();
  return (
    <Section $compact aria-labelledby="impact-title">
      <Container>
        <VisuallyHidden as="h2" id="impact-title">
          Impacto de Kodigo en empresas
        </VisuallyHidden>
        <Grid ref={ref}>
          {impactStats.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} active={visible} index={i} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
