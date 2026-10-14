import type { ReactNode } from "react";
import styled from "styled-components";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { Award, BookOpen, Laptop, Sparkles } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Sección "Respaldo" (id `goals-title`, destino del menú "Respaldo"): bloque "Work process" de Eduhall (WorkProcessOne), con
// tarjeta blanca y bloque tintado, círculo con borde punteado, insignia numerada y relleno de degradado al pasar el cursor.
// Cada tarjeta es un dato de respaldo de Kodigo (informativa, sin enlace). Textos basados en la información entregada por Kodigo.
const proofs: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <BookOpen size={32} />,
    title: "Alianzas con instituciones académicas",
    text: "Trabajamos junto a Key Institute y MINEDUCYT.",
  },
  {
    icon: <Award size={32} />,
    title: "Alianza con empresas certificadoras internacionales",
    text: "Contamos con la alianza de CertiProf.",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Primera academia de IA en El Salvador",
    text: "Somos la primera academia de inteligencia artificial del país.",
  },
  {
    icon: <Laptop size={32} />,
    title: "Formaciones virtuales de alto impacto",
    text: "Programas virtuales diseñados para lograr un alto impacto.",
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
    /* Mismo degradado violeta del botón "Aplicar" (#A678FF -> #7557FA). */
    background: ${({ theme }) => theme.colors.gradientCta};
    box-shadow: 0 6px 14px rgba(117, 87, 250, 0.35);
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
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.9375rem;
    transition: color ${({ theme }) => theme.motion.duration.hover} linear;
  }

  /* Hover/foco: la tarjeta sube y se enciende con el mismo lenguaje que el botón "Aplicar" (degradado, sombra violeta y
     lift de 2-4 px). */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(117, 87, 250, 0.45);
  }

  &:hover .inner::before {
    opacity: 1;
  }

  &:hover h3,
  &:hover p {
    color: ${({ theme }) => theme.colors.white};
  }

  /* Sobre el fondo violeta de la tarjeta, el número se invierte: círculo blanco con el número en violeta profundo. */
  &:hover .circle::after {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.purpleDeep};
  }

  &:hover .ring {
    transform: rotate(8deg) scale(1.06);
    border-color: ${({ theme }) => theme.colors.purpleDeep};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

/** Respaldo de Kodigo en Inicio: cuatro datos que avalan la formación (alianzas académicas, certificadoras, IA y virtual). */
export const GoalPaths = () => (
  <Section $surface aria-labelledby="goals-title" style={{ position: "relative" }}>
    <Shape style={{ width: 120, height: 120, left: "5%", top: "8%" }} $range={12} />
    <Shape style={{ width: 180, height: 180, right: "3%", bottom: "6%" }} $range={16} $delay={-4} />
    <Container style={{ position: "relative" }}>
      <SectionTitle
        id="goals-title"
        label="Respaldo"
        title="Una formación con respaldo"
        lead="Alianzas y liderazgo que respaldan nuestra formación."
      />
      <List>
        {proofs.map((g, i) => (
          <Card key={g.title} tag="li" index={i} direction="up">
            <div className="inner">
              <div className="circle" aria-hidden="true">
                <span className="ring">{g.icon}</span>
              </div>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
          </Card>
        ))}
      </List>
    </Container>
  </Section>
);
