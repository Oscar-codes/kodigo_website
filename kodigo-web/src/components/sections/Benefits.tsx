import type { ReactNode } from "react";
import styled from "styled-components";
import { flipInY } from "@/styles/effects";
import { media } from "@/styles/theme";
import { Container } from "../ui/Container";
import { BarChart, CodeBrackets, Sparkles } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { VisuallyHidden } from "../ui/VisuallyHidden";

// Rutas formativas de Kodigo (mismas de la navegación). Cada una con su tono: IA morado, Data verde, Programación naranja.
// PROVISIONAL: los textos descriptivos están por confirmar con Kodigo.
type Tone = "purple" | "green" | "orange";
const routes: { tone: Tone; icon: ReactNode; title: string; text: string }[] = [
  {
    tone: "purple",
    icon: <Sparkles />,
    title: "Ruta de Inteligencia Artificial",
    text: "De la IA generativa a los agentes inteligentes: aprende a usarla y a crear soluciones con ella.",
  },
  {
    tone: "green",
    icon: <BarChart />,
    title: "Ruta de Data Analyst",
    text: "Analiza, visualiza e interpreta datos para tomar mejores decisiones de negocio.",
  },
  {
    tone: "orange",
    icon: <CodeBrackets />,
    title: "Ruta de Programación",
    text: "Construye aplicaciones web desde el frontend hasta el full stack con proyectos reales.",
  },
];

// Colores por ruta: fondo suave, borde y color del icono (los tonos oscuros mantienen contraste AA del icono sobre blanco).
const tones = {
  purple: { bg: "main50", border: "main100", icon: "main" },
  green: { bg: "greenSoft", border: "greenSoft", icon: "greenText" },
  orange: { bg: "orangeSoft", border: "orangeSoft", icon: "orangeText" },
} as const;

// Panel blanco superpuesto al banner (InfoTwo de Eduhall): esquinas superiores redondeadas y tres tarjetas de ruta.
const Section = styled.section`
  position: relative;
  overflow-x: clip;
  z-index: 2;
  margin-top: -1.5rem; /* = PANEL_OVERLAP de Hero.tsx */
  padding-bottom: ${({ theme }) => theme.section.y};
  /* El H2 con id='benefits-title' vive dentro del bloque; el scroll-margin
     deja el contenido visible bajo el Header sticky cuando el menu
     'Beneficios' lleva al usuario aqui. */
  scroll-margin-top: calc(${({ theme }) => theme.layout.headerHeight} + 8px);
`;

const Panel = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => `${theme.radii.xl} ${theme.radii.xl} 0 0`};

  ${media.up("lg")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Benefit = styled(Reveal)<{ $tone: Tone }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space(4)};
  min-width: 0;
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(5)}`};
  border: 1px solid ${({ theme, $tone }) => theme.colors[tones[$tone].border]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme, $tone }) => theme.colors[tones[$tone].bg]};

  /* Efecto animation-item de Eduhall: el icono gira (flipInY) al pasar el cursor por la tarjeta. */
  &:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  .icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme, $tone }) => theme.colors[tones[$tone].icon]};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(1)};
    font-size: ${({ theme }) => theme.type.h3};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`;

export const Benefits = () => (
  <Section aria-labelledby="benefits-title">
    <Container>
      <VisuallyHidden as="h2" id="benefits-title">
        Nuestras rutas formativas
      </VisuallyHidden>
      <Panel>
        {routes.map((r, i) => (
          <Benefit
            key={r.title}
            tag="li"
            index={i}
            direction={i === 0 ? "right" : i === 2 ? "left" : "up"}
            $tone={r.tone}
          >
            <div className="icon">{r.icon}</div>
            <div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          </Benefit>
        ))}
      </Panel>
    </Container>
  </Section>
);
