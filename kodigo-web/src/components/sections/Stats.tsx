import styled from "styled-components";
import type { Stat } from "@/data/content";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { SectionTitle } from "../ui/SectionTitle";
import { VisuallyHidden } from "../ui/VisuallyHidden";

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

// Contadores de Eduhall: tarjetas blancas sobre fondo tintado, número grande en el color principal.
const Item = styled.li`
  padding: ${({ theme }) => theme.space(8)} ${({ theme }) => theme.space(5)};
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
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.main};
  }

  .label {
    display: block;
    margin-top: ${({ theme }) => theme.space(2)};
    color: ${({ theme }) => theme.colors.heading};
    font-weight: ${({ theme }) => theme.weights.medium};
  }

  .source {
    display: block;
    margin-top: ${({ theme }) => theme.space(2)};
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const StatItem = ({ stat, active }: { stat: Stat; active: boolean }) => {
  const value = useCountUp(stat.value, active);
  const format = (n: number) => n.toLocaleString("es");
  return (
    <Item>
      {/* El número animado se oculta a lectores de pantalla; ellos reciben el valor final. */}
      <span className="number" aria-hidden="true">
        {format(value)}
        {stat.suffix}
      </span>
      <VisuallyHidden>
        {format(stat.value)}
        {stat.suffix}
      </VisuallyHidden>
      <span className="label">{stat.label}</span>
      {stat.source && <small className="source">{stat.source}</small>}
    </Item>
  );
};

export const Stats = ({ items }: { items: Stat[] }) => {
  const [ref, visible] = useInView<HTMLUListElement>();
  return (
    <Section $surface aria-labelledby="stats-title">
      <Container>
        <SectionTitle id="stats-title" label="Cifras" title="Kodigo en cifras" />
        <Grid ref={ref}>
          {items.map((s) => (
            <StatItem key={s.label} stat={s} active={visible} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
