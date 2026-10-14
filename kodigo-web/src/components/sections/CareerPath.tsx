import styled from "styled-components";
import classPhoto from "@/assets/photos/experience-class.webp";
import trainingPhoto from "@/assets/photos/training.webp";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowUpRight, BookOpen, Check, Play, Sparkles } from "../ui/Icons";

// "Career path" Kodigo, segunda versión: adapta el bloque `ChooseUsOne.jsx` de Eduhall.
// Izquierda (copy): label con bullet, h2, lead, 3 checks y CTA "Read More".
// Derecha (visual): foto principal rectangular con dos badges flotantes, foto circular superpuesta con play, y
// mini-card con iniciales de estudiantes. Decora con grillas de puntos naranja en esquinas opuestas.

// === SECCIÓN ===
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
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

// === COLUMNA IZQUIERDA: COPY + CHECKS + CTA ===
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
    margin-bottom: ${({ theme }) => theme.space(5)};
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.15;
  }

  h2 em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  > p.lead {
    margin-bottom: ${({ theme }) => theme.space(7)};
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Checks = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(7)};

  li {
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space(3)};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9375rem;
  }

  li .icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }
`;

const FootRow = styled.div`
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
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
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

// === COLUMNA DERECHA: COLLAGE DE FOTOS + BADGES FLOTANTES ===
const Collage = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: center;
  min-height: 460px;

  ${media.up("md")} {
    min-height: 540px;
  }
`;

const MainPhoto = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 4 / 5;
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

  ${media.up("md")} {
    max-width: 100%;
    aspect-ratio: 5 / 6;
  }
`;

const CirclePhoto = styled.a`
  position: absolute;
  left: 0;
  bottom: 1.5rem;
  display: block;
  width: 56%;
  max-width: 240px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lift};
  background: ${({ theme }) => theme.colors.navy};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms ${({ theme }) => theme.motion.easing};
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const PlayBadge = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(7, 20, 49, 0.55));
  }

  span {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 24px rgba(75, 74, 241, 0.45);
  }
`;

// Badge circular naranja con icono (esquina superior izquierda)
const IconBadge = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.orange};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};

  ${media.up("md")} {
    top: -2rem;
    left: 2rem;
    width: 80px;
    height: 80px;
  }
`;

// Card flotante de reviews (esquina superior derecha)
const ReviewCard = styled.div`
  position: absolute;
  top: 1rem;
  right: -0.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .score {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .score strong {
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  .score small {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  ${media.up("md")} {
    top: 1.5rem;
    right: -1.5rem;
  }
`;

// Card inferior con stat + avatares
const StudentsCard = styled.div`
  position: absolute;
  bottom: -1.5rem;
  right: -0.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};
  border: 1px solid ${({ theme }) => theme.colors.border};

  .text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .text strong {
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  .text small {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  ${media.up("md")} {
    bottom: -2rem;
    right: -1.5rem;
  }
`;

const AvatarStack = styled.div`
  display: flex;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
    margin-left: -8px;
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .avatar.t1 { background: ${({ theme }) => theme.colors.main}; }
  .avatar.t2 { background: ${({ theme }) => theme.colors.purple}; }
  .avatar.t3 { background: ${({ theme }) => theme.colors.orange}; }
  .avatar.t4 { background: ${({ theme }) => theme.colors.green}; }
`;

const benefits = [
  "Acompañamiento humano: coaches activos en cada cohorte.",
  "Aprendizaje aplicado: proyectos reales desde el primer mes.",
  "Conexión real con la industria y rutas hacia el empleo.",
];

const avatarInitials = ["MC", "AR", "LF", "JS"];

export const CareerPath = () => (
  <Wrap aria-labelledby="career-path-title">
    <Container>
      <Grid>
        <Copy>
          <span className="label">Por qué Kodigo</span>
          <h2 id="career-path-title">
            Una formación con propósito, <em>una comunidad que acompaña.</em>
          </h2>
          <p className="lead">
            En Kodigo creemos en el aprendizaje que se vive: personas que se forman con intención, proyectos que demuestran su progreso y mentores que los guían hasta su siguiente paso profesional.
          </p>

          <Checks>
            {benefits.map((b) => (
              <li key={b}>
                <span className="icon" aria-hidden="true">
                  <Check />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </Checks>

          <FootRow>
            <Cta href="#metodologia" aria-label="Conoce más sobre Kodigo">
              Conoce más
              <ArrowUpRight size={18} />
            </Cta>
          </FootRow>
        </Copy>

        <Collage aria-hidden="false">
          <MainPhoto>
            <img src={classPhoto} alt="Estudiantes de Kodigo en sesión sincrónica" width={900} height={1200} loading="lazy" decoding="async" />
          </MainPhoto>

          <IconBadge aria-hidden="true">
            <BookOpen size={32} />
          </IconBadge>

          <ReviewCard role="group" aria-label="Valoración de la comunidad Kodigo">
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#FFCA0E",
                color: "#fff",
              }}
            >
              <Sparkles size={20} />
            </span>
            <span className="score">
              <strong>4.9<small style={{ fontWeight: 400 }}> /5</small></strong>
              <small>Valoración</small>
            </span>
          </ReviewCard>

          <CirclePhoto href="#testimonios" aria-label="Ver testimonios de estudiantes Kodigo">
            <img src={trainingPhoto} alt="Equipo trabajando en proyectos Kodigo" width={400} height={400} loading="lazy" decoding="async" />
            <PlayBadge aria-hidden="true">
              <span>
                <Play size={22} />
              </span>
            </PlayBadge>
          </CirclePhoto>

          <StudentsCard role="group" aria-label="Comunidad Kodigo">
            <AvatarStack aria-hidden="true">
              <span className="avatar t1">{avatarInitials[0]}</span>
              <span className="avatar t2">{avatarInitials[1]}</span>
              <span className="avatar t3">{avatarInitials[2]}</span>
              <span className="avatar t4">{avatarInitials[3]}</span>
            </AvatarStack>
            <span className="text">
              <strong>Comunidad Kodigo</strong>
              <small>Estudiantes activos</small>
            </span>
          </StudentsCard>
        </Collage>
      </Grid>
    </Container>
  </Wrap>
);
