import styled, { css } from "styled-components";
import classPhoto from "@/assets/photos/experience-class.webp";
import autoPhoto from "@/assets/photos/experience-automation.webp";
import avatarPhoto from "@/assets/photos/hero.webp";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowUpRight, BarChart, Users } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";

// Adaptación del bloque "About EduAll" de Eduhall aplicado a la metodología de Kodigo:
// collage de dos fotos a la izquierda con dos tarjetas de cifras y una insignia flotante,
// y a la derecha el texto que explica cómo trabaja Kodigo (misión + visión + firma).

const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

// === LAYOUT: DOS COLUMNAS ===
const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: ${({ theme }) => theme.space(12)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

// === COLUMNA IZQUIERDA: COLLAGE DE FOTOS + STATS + BADGE ===
const Collage = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.7fr);
  grid-template-rows: auto auto;
  gap: ${({ theme }) => theme.space(5)};
  align-items: end;
`;

const Photo = styled(Reveal)`
  display: block;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lift};
  background: ${({ theme }) => theme.colors.navy};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms ${({ theme }) => theme.motion.easing};
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const PhotoMain = styled(Photo)`
  grid-column: 1;
  grid-row: 1 / span 2;
  aspect-ratio: 4 / 5;

  ${media.up("lg")} {
    aspect-ratio: 5 / 6;
  }
`;

const PhotoSub = styled(Photo)`
  grid-column: 2;
  grid-row: 2;
  aspect-ratio: 4 / 3;
`;

const Stats = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: grid;
  gap: ${({ theme }) => theme.space(3)};
`;

// Tarjeta de cifra (estilo Eduhall: una clara con color principal, una oscura).
const StatCard = styled.div<{ $tone: "main" | "dark" }>`
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(5)}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ $tone, theme }) => ($tone === "main" ? theme.colors.main : theme.colors.white)};
  background: ${({ $tone, theme }) => ($tone === "main" ? theme.colors.main50 : theme.colors.navy)};

  .num {
    display: block;
    font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .label {
    display: block;
    margin-top: ${({ theme }) => theme.space(1)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ $tone, theme }) => ($tone === "main" ? theme.colors.heading : theme.colors.onNavy)};
  }

  ${({ $tone, theme }) =>
    $tone === "dark" &&
    css`
      background: linear-gradient(135deg, ${theme.colors.navy} 0%, ${theme.colors.violetDeep} 100%);
    `}
`;

const Badge = styled.div`
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(5)}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(-50%);

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.orangeSoft};
    color: ${({ theme }) => theme.colors.orange};
  }

  .text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .text strong {
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  .text small {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.text};
  }

  ${media.up("md")} {
    left: 36%;
    transform: none;
  }
`;

// === COLUMNA DERECHA: COPY + FEATURES + CTA ===
const Copy = styled.div`
  max-width: 56ch;

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(4)};
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnLight};

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.main};
    }
  }

  h2 {
    margin-bottom: ${({ theme }) => theme.space(4)};
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.15;
  }

  h2 em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  > p.lead {
    margin-bottom: ${({ theme }) => theme.space(8)};
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Feature = styled(Reveal)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(5)};

  .icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main50};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const FootRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space(6)};
  margin-top: ${({ theme }) => theme.space(8)};
  padding-top: ${({ theme }) => theme.space(6)};
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 48px;
  padding: ${({ theme }) => `0 ${theme.space(6)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weights.semibold};
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.mainHover};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

const Signature = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};

  .avatar {
    width: 48px;
    height: 48px;
    overflow: hidden;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main100};
    flex: none;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .name {
    font-family: "Brush Script MT", "Comic Sans MS", cursive;
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  .role {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const stats = [
  { num: "16+", label: "Bootcamps activos", tone: "main" as const },
  { num: "3.2k", label: "Estudiantes formados", tone: "dark" as const },
];

export const Methodology = () => {
  return (
    <Wrap aria-labelledby="methodology-title">
      <Container>
        <Grid>
          <Collage>
            <PhotoMain direction="right">
              <img src={classPhoto} alt="Estudiantes de Kodigo trabajando en clase" width={900} height={1200} loading="lazy" decoding="async" />
            </PhotoMain>
            <PhotoSub direction="left">
              <img src={autoPhoto} alt="Mentoría y prácticas en equipo" width={600} height={450} loading="lazy" decoding="async" />
            </PhotoSub>
            <Stats aria-label="Cifras de Kodigo">
              {stats.map((s) => (
                <StatCard key={s.num} $tone={s.tone}>
                  <span className="num">{s.num}</span>
                  <span className="label">{s.label}</span>
                </StatCard>
              ))}
            </Stats>
            <Badge>
              <span className="icon" aria-hidden="true">
                <BarChart size={22} />
              </span>
              <span className="text">
                <strong>100% Práctico</strong>
                <small>Metodología hands-on</small>
              </span>
            </Badge>
          </Collage>

          <Copy>
            <span className="label">Metodología Kodigo</span>
            <h2 id="methodology-title">
              El método detrás de tu próxima <em>carrera tech.</em>
            </h2>
            <p className="lead">
              En Kodigo no memorizas: construyes. Nuestro método une aprendizaje aplicado, mentores activos y proyectos reales para que cada estudiante avance con propósito y evidencia.
            </p>

            <Feature direction="up" index={0}>
              <span className="icon" aria-hidden="true">
                <BarChart size={26} />
              </span>
              <div>
                <h3>Aprendizaje aplicado</h3>
                <p>Resuelve retos y desarrolla proyectos relacionados con situaciones reales.</p>
              </div>
            </Feature>

            <Feature direction="up" index={1}>
              <span className="icon" aria-hidden="true">
                <Users size={26} />
              </span>
              <div>
                <h3>Acompañamiento real</h3>
                <p>Recibe orientación y retroalimentación de coaches durante tu proceso para fortalecer tus competencias y avanzar con confianza.</p>
              </div>
            </Feature>

            <FootRow>
              <Cta href="#metodologia" aria-label="Conoce más sobre la metodología de Kodigo">
                Conoce más
                <ArrowUpRight size={18} />
              </Cta>
              <Signature>
                <span className="avatar">
                  <img src={avatarPhoto} alt="" width={96} height={96} loading="lazy" decoding="async" />
                </span>
                <span className="info">
                  <span className="name">Equipo Kodigo</span>
                  <span className="role">Educación que transforma</span>
                </span>
              </Signature>
            </FootRow>
          </Copy>
        </Grid>
      </Container>
    </Wrap>
  );
};
