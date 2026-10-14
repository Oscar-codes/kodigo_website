import styled from "styled-components";
import { impactStats } from "@/data/alliances";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { HERO_OVERLAP } from "./AlliancesHero";
import { silverText } from "../ui/AiventKit";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { VisuallyHidden } from "../ui/VisuallyHidden";

// Las cifras se montan sobre el borde inferior del banner (como el panel de rutas en Inicio).
const Overlap = styled(Section)`
  position: relative;
  z-index: 2;
  padding-top: 0;
  margin-top: calc(${HERO_OVERLAP} * -1);
  background: linear-gradient(180deg, transparent ${HERO_OVERLAP}, ${({ theme }) => theme.colors.aiventDark} ${HERO_OVERLAP});
`;

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
  background: ${({ theme }) => theme.colors.aiventDark2};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 14px 36px rgba(7, 20, 49, 0.45);
  transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    border-color: ${({ theme }) => theme.colors.aiventViolet};
    box-shadow: 0 14px 36px rgba(118, 77, 240, 0.35);
  }

  .number {
    display: block;
    font-size: clamp(2.75rem, 2rem + 3vw, 4rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.1;
    ${silverText}
  }

  .label {
    display: block;
    margin-top: ${({ theme }) => theme.space(3)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentOnDark};
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
    <Overlap $compact aria-labelledby="impact-title">
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
    </Overlap>
  );
};
