import styled from "styled-components";
import { alliancesHero } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { upDown } from "@/styles/effects";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { BookOpen } from "../ui/Icons";

// Banner oscuro (Eduhall Home 3) sin foto: degradado azul marino con resplandores violeta de Kodigo.
// El texto no se anima (protege el LCP); solo las formas decorativas flotan y se apagan con movimiento reducido.
const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: clamp(4.5rem, 2.5rem + 7vw, 9rem);
  background-color: ${({ theme }) => theme.colors.navy};
  background-image:
    radial-gradient(60% 90% at 85% 20%, rgba(75, 74, 241, 0.55), transparent 70%),
    radial-gradient(40% 70% at 10% 100%, rgba(175, 148, 248, 0.25), transparent 70%),
    linear-gradient(135deg, ${({ theme }) => theme.colors.navy}, ${({ theme }) => theme.colors.navyMid});

  .shape {
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    border: 2px solid rgba(175, 148, 248, 0.35);
    pointer-events: none;
  }

  .shape.a {
    top: 12%;
    right: 8%;
    width: clamp(120px, 18vw, 260px);
    aspect-ratio: 1;
  }

  .shape.b {
    bottom: 10%;
    right: 26%;
    width: clamp(48px, 7vw, 96px);
    aspect-ratio: 1;
    background: rgba(255, 202, 14, 0.9);
    border: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    .shape.a {
      animation: ${upDown} 7s ease-in-out infinite;
    }
    .shape.b {
      animation: ${upDown} 5s ease-in-out infinite reverse;
    }
  }

  ${media.down("md")} {
    .shape.b {
      display: none;
    }
  }
`;

const Content = styled.div`
  max-width: 820px;
`;

const Eyebrow = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(5)};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accentOnDark};
`;

const Question = styled.p`
  margin-bottom: ${({ theme }) => theme.space(6)};
  font-size: clamp(2.25rem, 1rem + 4.4vw, 4.25rem);
  font-weight: ${({ theme }) => theme.weights.medium};
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.white};
`;

const Subtitle = styled.p`
  max-width: 52ch;
  margin-bottom: ${({ theme }) => theme.space(10)};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.onNavy};
`;

export const AlliancesHero = () => (
  <Wrap>
    <span className="shape a" aria-hidden="true" />
    <span className="shape b" aria-hidden="true" />
    <Container>
      <Content>
        <Eyebrow>
          <BookOpen size={24} />
          {alliancesHero.title}
        </Eyebrow>
        <Question>{alliancesHero.question}</Question>
        <Subtitle>{alliancesHero.subtitle}</Subtitle>
        <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} variant="light" arrow="right">
          {alliancesHero.cta}
        </ButtonLink>
      </Content>
    </Container>
  </Wrap>
);
