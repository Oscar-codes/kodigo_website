import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { ArrowRight, Rocket, Sparkles, TrendUp, Users } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Bloque "Work process" de Eduhall (WorkProcessOne): tarjeta blanca con un bloque tintado, círculo con borde punteado,
// insignia numerada y relleno de color al pasar el cursor. Aquí cada tarjeta es un objetivo del visitante con su enlace.
// PROVISIONAL: confirmar con Kodigo el destino de cada "Explorar mi ruta" (hoy: /bootcamps y /profesional/alianzas).
const goals: { icon: ReactNode; title: string; text: string; to: string }[] = [
  {
    icon: <Rocket />,
    title: "Quiero iniciar mi carrera tech",
    text: "Explora programas para construir una base y dar tus primeros pasos.",
    to: "/bootcamps",
  },
  {
    icon: <TrendUp />,
    title: "Quiero mejorar mis habilidades",
    text: "Actualiza tu perfil y aprende nuevas herramientas para destacar.",
    to: "/bootcamps",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Quiero aprender y aplicar IA",
    text: "Pasa de usar herramientas a crear soluciones con inteligencia artificial.",
    to: "/bootcamps",
  },
  {
    icon: <Users />,
    title: "Quiero capacitar a mi equipo",
    text: "Desarrolla competencias estratégicas y tecnológicas en tu organización.",
    to: "/profesional/alianzas",
  },
];

/** Círculo decorativo flotante de Eduhall tras el contenido. */
const Shape = styled(Float)`
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.main100};
  opacity: 0.5;
`;

const List = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};
  counter-reset: goal;

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Card = styled(Reveal)`
  counter-increment: goal;
  position: relative;
  height: 100%;
  padding: ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
  transition:
    transform ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing},
    box-shadow ${({ theme }) => theme.motion.duration.base} ease;

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: ${({ theme }) => theme.space(6)};
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ theme }) => theme.colors.surface};
    transition: background-color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  /* Capa con el degradado del botón "Aplicar" (purpleLight -> purpleDeep): se aparece con un fundido, porque un degradado
     no se puede animar con transition. Va debajo del contenido. */
  .inner {
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  .inner::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0;
    /* Los dos colores del CTA "Aplicar". El tono claro queda arriba a la izquierda (zona del círculo) y el profundo
       cubre el texto, para conservar el contraste del blanco (>= 4.5:1 sobre #7557FA). */
    background: linear-gradient(160deg, ${({ theme }) => theme.colors.purpleLight} -10%, ${({ theme }) => theme.colors.purpleDeep} 55%);
    transition: opacity ${({ theme }) => theme.motion.duration.base} ease;
  }

  .circle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    margin-bottom: ${({ theme }) => theme.space(6)};
    padding: ${({ theme }) => theme.space(3)};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  .ring {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px dashed ${({ theme }) => theme.colors.main};
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.accentOnLight};
    transition: transform ${({ theme }) => theme.motion.duration.base} ease;
  }

  /* Insignia numerada 01-04 en la esquina superior derecha del círculo. */
  .circle::after {
    content: counter(goal, decimal-leading-zero);
    position: absolute;
    top: -6px;
    right: -14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main};
    box-shadow: ${({ theme }) => theme.shadows.card};
    font-size: 1rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: ${({ theme }) => theme.type.h3};
    font-weight: ${({ theme }) => theme.weights.semibold};
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  p {
    flex: 1;
    margin-bottom: ${({ theme }) => theme.space(5)};
    font-size: 0.9375rem;
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  /* El enlace cubre toda la tarjeta (área de clic grande) sin anidar elementos interactivos. */
  a {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.accentOnLight};
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  a::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  a:focus-visible {
    outline: none;
  }

  a:focus-visible::after {
    outline: 3px solid ${({ theme }) => theme.colors.main};
    outline-offset: 2px;
  }

  /* Hover/foco: la tarjeta sube y se enciende con el mismo lenguaje que el botón "Aplicar" (degradado, sombra violeta y
     lift de 2-4 px). */
  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(117, 87, 250, 0.45);
  }

  &:hover .inner::before,
  &:focus-within .inner::before {
    opacity: 1;
  }

  &:hover h3,
  &:hover p,
  &:hover a,
  &:focus-within h3,
  &:focus-within p,
  &:focus-within a {
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover .circle::after,
  &:focus-within .circle::after {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.purpleDeep};
  }

  &:hover .ring,
  &:focus-within .ring {
    transform: rotate(8deg) scale(1.06);
    border-color: ${({ theme }) => theme.colors.purpleDeep};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:focus-within {
      transform: none;
    }
  }
`;

/** Selector de objetivo en Inicio: guía al visitante a una ruta según lo que busca conseguir. */
export const GoalPaths = () => (
  <Section $surface aria-labelledby="goals-title" style={{ position: "relative" }}>
    <Shape style={{ width: 120, height: 120, left: "5%", top: "8%" }} $range={12} />
    <Shape style={{ width: 180, height: 180, right: "3%", bottom: "6%" }} $range={16} $delay={-4} />
    <Container style={{ position: "relative" }}>
      <SectionTitle
        id="goals-title"
        label="Tu objetivo, tu ruta"
        title="No todos comienzan igual. ¿Qué estás buscando?"
        lead="En lugar de navegar entre decenas de opciones, empieza por lo que quieres conseguir. Te ayudamos a identificar un camino para ti."
      />
      <List>
        {goals.map((g, i) => (
          <Card key={g.title} tag="li" index={i} direction="up">
            <div className="inner">
              <div className="circle" aria-hidden="true">
                <span className="ring">{g.icon}</span>
              </div>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
              <Link to={g.to}>
                Explorar mi ruta <ArrowRight />
              </Link>
            </div>
          </Card>
        ))}
      </List>
    </Container>
  </Section>
);
