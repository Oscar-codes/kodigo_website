import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import isotype from "@/assets/brand/isotype-white.webp";
import type { Bootcamp } from "@/data/bootcamps";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Float } from "../ui/Float";
import { ArrowRight } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";
import { VisuallyHidden } from "../ui/VisuallyHidden";
import { areaCardStyle, BootcampGrid, Chips, Item, Name, Seal, Visual, VisualWrap } from "./BootcampGrid";

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

// === RUTAS FORMATIVAS: 3 tarjetas con el mismo lenguaje visual que las cards de bootcamps. ===
// Se muestran cuando el filtro activo es "Rutas formativas" (index 0). Cada tarjeta alude
// a su ruta con el visual (gradiente + glyph + pill) y el body (chips + título + copy + CTA)
// idénticos a los de BootcampGrid, para que se lean como parte de la misma familia.
const routeCards: { area: Area; title: string; text: string }[] = [
  {
    area: "IA",
    title: "Ruta de Inteligencia Artificial",
    text: "De la IA generativa a los agentes inteligentes: aprende a usarla y a crear soluciones con ella.",
  },
  {
    area: "Datos",
    title: "Ruta de Data Analyst",
    text: "Analiza, visualiza e interpreta datos para tomar mejores decisiones de negocio.",
  },
  {
    area: "Programación",
    title: "Ruta de Programación",
    text: "Construye aplicaciones web desde el frontend hasta el full stack con proyectos reales.",
  },
];

const RouteGrid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.up("lg")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    /* Mismo gradiente institucional que el CTA "Explorar bootcamps" (Button primary):
       purpleLight -> purpleDeep, texto blanco y sombra violeta. */
    background: ${({ theme }) => theme.colors.gradientCta};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 22px rgba(117, 87, 250, 0.32);
    border-color: transparent;
  }

  &[aria-pressed="true"]:hover {
    filter: brightness(1.06);
    box-shadow: 0 14px 32px rgba(117, 87, 250, 0.45);
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
        /* Fondo lila institucional Kodigo solicitado. Se aplica inline para ganar al $surface
           del Section sin tocar el Container genérico. */
        background: "#E5E5FD",
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
                isRutas ? (
                  <>
                    Encuentra la ruta que mejor se conecta <em>con tus metas.</em>
                  </>
                ) : (
                  <>
                    Encuentra el bootcamp que te llevará <em>más lejos.</em>
                  </>
                )
              }
            />
          </div>
          <Reveal className="side" direction="left">
            <p>
              {isRutas
                ? "Aprende habilidades que abren nuevas posibilidades. Explora nuestras rutas de formación en inteligencia artificial, análisis de datos y desarrollo de software."
                : "Encuentra la formación que te llevará más lejos. Desarrolla nuevas competencias en IA, datos y programación mediante experiencias de aprendizaje orientadas a la práctica."}
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
            {routeCards.map((r, i) => {
              const copy = areaCardStyle[r.area];
              return (
                <Reveal key={r.title} tag="li" index={i % 3} direction={i % 3 === 0 ? "right" : i % 3 === 2 ? "left" : "up"}>
                  <Item>
                    <VisualWrap aria-hidden="true">
                      <Visual $area={r.area}>
                        <div className="zoom" />
                        <span className="glyph">{copy.glyph}</span>
                        <span className="pill">{copy.badge}</span>
                      </Visual>
                      <Seal>
                        <img src={isotype} alt="" width={22} height={22} />
                      </Seal>
                    </VisualWrap>
                    <div className="body">
                      <Chips $area={r.area}>
                        <span>{copy.chip}</span>
                        <span>Ruta práctica</span>
                      </Chips>
                      <Name as="h3">{r.title}</Name>
                      <p>{r.text}</p>
                      <Link to={`/bootcamps?area=${r.area}`} className="more" aria-label={`Explorar ${r.title}`}>
                        <span className="sheet">Ver ruta completa</span>
                        <span className="go">
                          Explorar ruta <ArrowRight />
                        </span>
                      </Link>
                    </div>
                  </Item>
                </Reveal>
              );
            })}
          </RouteGrid>
        ) : (
          <BootcampGrid items={shown} headingLevel="h3" />
        )}
      </Container>
    </Section>
  );
};
