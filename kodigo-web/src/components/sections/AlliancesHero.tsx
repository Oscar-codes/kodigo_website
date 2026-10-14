import styled from "styled-components";
import heroImage from "@/assets/photos/hero.webp";
import heroImageSmall from "@/assets/photos/hero-768.webp";
import { alliancesHero } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Float } from "../ui/Float";
import { BookOpen } from "../ui/Icons";

/** Cuánto se superponen las cifras de impacto (ImpactStats) sobre el banner; debe coincidir con ImpactStats.tsx. */
export const HERO_OVERLAP = "4.5rem";

// Mismo lenguaje visual del banner de Inicio: foto con degradado azul marino de izquierda a derecha, etiqueta en cian,
// título en negrita con la parte final en degradado lila -> cian, anillo y esfera flotantes.
// El texto no se anima (protege el LCP); solo las formas decorativas flotan y se apagan con movimiento reducido.
const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  padding-block: clamp(4.5rem, 2.5rem + 7vw, 8rem) calc(${HERO_OVERLAP} + clamp(2.5rem, 1.5rem + 3vw, 4.5rem));
  background-color: ${({ theme }) => theme.colors.navy};
  background-image:
    linear-gradient(
      90deg,
      rgba(7, 20, 49, 0.94) 0%,
      rgba(7, 20, 49, 0.82) 45%,
      rgba(7, 20, 49, 0.5) 70%,
      rgba(7, 20, 49, 0.3) 100%
    ),
    url(${heroImage});
  background-size: cover;
  background-position: center;

  ${media.down("md")} {
    background-image: linear-gradient(rgba(7, 20, 49, 0.86), rgba(7, 20, 49, 0.86)), url(${heroImageSmall});
  }
`;

const Ring = styled(Float)`
  z-index: -1;
  border: 2px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
`;

const Orb = styled(Float)`
  z-index: -1;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lilac};
  opacity: 0.35;

  ${media.down("md")} {
    display: none;
  }
`;

const Content = styled.div`
  max-width: 820px;
`;

const Eyebrow = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(4)};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.weights.medium};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.accentOnDark};
`;

const Question = styled.p`
  margin-bottom: ${({ theme }) => theme.space(6)};
  font-size: ${({ theme }) => theme.type.display};
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.white};

  em {
    font-style: normal;
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

const Subtitle = styled.p`
  max-width: 52ch;
  margin-bottom: ${({ theme }) => theme.space(10)};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.white};
`;

// Resalta (sin cambiar el texto) desde " para " hasta el final de la pregunta.
const emphasize = (text: string) => {
  const i = text.indexOf(" para ");
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i + 1)}
      <em>{text.slice(i + 1)}</em>
    </>
  );
};

export const AlliancesHero = () => (
  <Wrap>
    <Ring style={{ width: 220, height: 220, right: "7%", top: "12%" }} $range={14} />
    <Orb style={{ width: 84, height: 84, right: "24%", bottom: "26%" }} $range={18} $delay={-2} />
    <Container>
      <Content>
        <Eyebrow>
          <BookOpen size={24} />
          {alliancesHero.title}
        </Eyebrow>
        <Question>{emphasize(alliancesHero.question)}</Question>
        <Subtitle>{alliancesHero.subtitle}</Subtitle>
        <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} variant="light" arrow="right">
          {alliancesHero.cta}
        </ButtonLink>
      </Content>
    </Container>
  </Wrap>
);
