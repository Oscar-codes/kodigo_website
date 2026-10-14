import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Bootcamp } from "@/data/bootcamps";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { ArrowRight, BarChart, CodeBrackets, Sparkles } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { BootcampGrid } from "./BootcampGrid";

// Bloque "cursos populares" de Eduhall (ExploreCourseOne): título a la izquierda, texto y enlace "ver todos" a la derecha,
// barra blanca de filtros en píldora y cuadrícula de tarjetas. Copy de Kodigo: "Aprende con propósito".
type Area = Bootcamp["area"];
const FILTERS: { label: string; area: Area | null }[] = [
  { label: "Rutas formativas", area: null },
  { label: "Programación", area: "Programación" },
  { label: "Data análisis", area: "Datos" },
  { label: "IA", area: "IA" },
  { label: "Todos", area: null },
];

// Orden de "Todos": primero Programación, luego IA, Educación y Datos.
const AREA_ORDER: Area[] = ["Programación", "IA", "Educación", "Datos"];
const byArea = (a: Bootcamp, b: Bootcamp) => AREA_ORDER.indexOf(a.area) - AREA_ORDER.indexOf(b.area);

// === RUTAS FORMATIVAS: 3 tarjetas que resumen cada ruta (Programación, Datos, IA). ===
// Se muestran cuando el filtro activo es "Rutas formativas" (index 0). Cada tarjeta alude
// a su ruta con icono, título, copy y CTA que lleva al listado filtrado por área.
const routeCards: { icon: React.ReactNode; area: Area; title: string; text: string }[] = [
  {
    area: "Programación",
    icon: <CodeBrackets />,
    title: "Ruta de Programación",
    text: "Construye aplicaciones web desde el frontend hasta el full stack con proyectos reales.",
  },
  {
    area: "Datos",
    icon: <BarChart />,
    title: "Ruta de Data análisis",
    text: "Analiza, visualiza e interpreta datos para tomar mejores decisiones de negocio.",
  },
  {
    area: "IA",
    icon: <Sparkles />,
    title: "Ruta de IA",
    text: "De la IA generativa a los agentes inteligentes: aprende a usarla y a crear soluciones con ella.",
  },
];

const RouteGrid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const RouteCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(7)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-4px);
      border-color: ${({ theme }) => theme.colors.accentOnLight};
      box-shadow: ${({ theme }) => theme.shadows.lift};
    }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.main50};
    color: ${({ theme }) => theme.colors.main};
  }

  h3 {
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  a {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  a:hover {
    text-decoration: underline;
  }
`;

/** Círculo decorativo flotante de Eduhall (shape six) tras el contenido. */
const Shape = styled(Float)`
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.main100};
  opacity: 0.55;
`;

const Header = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};
  margin-bottom: ${({ theme }) => theme.space(10)};

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
    align-items: start;
    gap: ${({ theme }) => theme.space(16)};
  }

  /* El título ya trae su propio margen inferior; el encabezado lo controla. */
  > div:first-child > div {
    margin-bottom: 0;
  }

  .side p {
    max-width: 52ch;
  }

  .side a {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-top: ${({ theme }) => theme.space(5)};
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  .side a:hover {
    text-decoration: underline;
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(10)};
  padding: ${({ theme }) => theme.space(4)};
  border-radius: 40px;
  background: ${({ theme }) => theme.colors.white};
`;

const FilterButton = styled.button`
  padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(6)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.weights.medium};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: ${({ theme }) => theme.colors.main100};
    color: ${({ theme }) => theme.colors.heading};
  }

  &[aria-pressed="true"] {
    background: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.main};
    outline-offset: 2px;
  }
`;

/** Sección de bootcamps en Inicio: encabezado, filtros por área y tarjetas. El listado completo está en /bootcamps. */
export const BootcampShowcase = ({ items, flushTop = true }: { items: Bootcamp[]; flushTop?: boolean }) => {
  // El estado guarda el índice del filtro activo; el índice 0 ("Rutas formativas") es un modo
  // especial que muestra 3 tarjetas-resumen de las rutas en vez de la cuadrícula de bootcamps.
  const [filterIdx, setFilterIdx] = useState(0);
  const activeFilter = FILTERS[filterIdx];
  const area = activeFilter.area;
  const isRutas = activeFilter.label === "Rutas formativas";
  const shown = [...items].sort(byArea).filter((b) => area === null || b.area === area);

  return (
    <Section
      $surface
      aria-labelledby="bootcamps-title"
      style={{
        position: "relative",
        /* flushTop quita el padding superior para que el bloque se "pegue" al anterior
           (caso típico: el panel navy de Organizations que ya tiene su propio padding).
           Aun así dejamos un padding-top generoso para que el titulo no quede pegado
           a la seccion de encima (p. ej. la cinta de logos de aliados). */
        ...(flushTop ? { paddingTop: "3rem" } : null),
      }}
    >
      <Shape style={{ width: 160, height: 160, right: "4%", top: "6%" }} $range={14} />
      <Shape style={{ width: 90, height: 90, left: "3%", bottom: "10%" }} $range={12} $delay={-3} />
      <Container style={{ position: "relative" }}>
        <Header>
          <div>
            <SectionTitle
              id="bootcamps-title"
              align="left"
              label="Aprende con propósito"
              title={
                <>
                  Encuentra el bootcamp que te llevará <em>más lejos.</em>
                </>
              }
            />
          </div>
          <Reveal className="side" direction="left">
            <p>
              Rutas de formación en programación, datos y IA. Descubre qué aprenderás y elige el programa que mejor se
              conecta con tus metas.
            </p>
            <Link to="/bootcamps">
              Ver todos los bootcamps <ArrowRight />
            </Link>
          </Reveal>
        </Header>
        <FilterBar role="group" aria-label="Filtrar bootcamps por área">
          {FILTERS.map((f, i) => (
            <FilterButton
              key={f.label}
              type="button"
              aria-pressed={i === filterIdx}
              onClick={() => setFilterIdx(i)}
            >
              {f.label}
            </FilterButton>
          ))}
        </FilterBar>
        <VisuallyHidden role="status" aria-live="polite">
          {isRutas
            ? "Mostrando 3 rutas formativas"
            : `Mostrando ${shown.length} ${shown.length === 1 ? "bootcamp" : "bootcamps"}`}
        </VisuallyHidden>
        {isRutas ? (
          <RouteGrid>
            {routeCards.map((r, i) => (
              <Reveal key={r.title} tag="li" index={i} direction={i === 0 ? "right" : i === 2 ? "left" : "up"}>
                <RouteCard>
                  <span className="icon" aria-hidden="true">
                    {r.icon}
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <Link to={`/bootcamps?area=${r.area}`}>
                    Explorar ruta <ArrowRight />
                  </Link>
                </RouteCard>
              </Reveal>
            ))}
          </RouteGrid>
        ) : (
          <BootcampGrid items={shown} headingLevel="h3" />
        )}
      </Container>
    </Section>
  );
};
