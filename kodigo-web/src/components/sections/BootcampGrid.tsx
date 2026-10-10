import { Link } from "react-router-dom";
import styled from "styled-components";
import isotype from "@/assets/brand/isotype-white.webp";
import type { Bootcamp } from "@/data/bootcamps";
import { media } from "@/styles/theme";
import { Card } from "../ui/Card";
import { ArrowRight, Clock, Laptop, Signal } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";

const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.up("lg")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

// Tarjeta "course-item" de Eduhall: tarjeta blanca, imagen redondeada con zoom ×1.1 al pasar el cursor, círculo
// superpuesto en la esquina de la imagen (en Eduhall el avatar del docente), chips, datos con iconos, separador punteado
// y enlace al pie (sin precio). No hay fotos por programa: el "visual" es un degradado corporativo violeta-marino con
// resplandor lila, línea diagonal y un símbolo grande de marca de agua. El área se distingue por la etiqueta, el símbolo y
// el chip: naranja, verde y amarillo solo como fondos suaves y con texto oscuro (línea gráfica de Kodigo).
const areaStyle = {
  IA: { badge: "Inteligencia artificial", glyph: "AI", chip: "Inteligencia artificial", soft: "main50", text: "mainHover" },
  Datos: { badge: "Data & Analytics", glyph: "01", chip: "Datos y analítica", soft: "greenSoft", text: "greenText" },
  Desarrollo: { badge: "Desarrollo", glyph: "</>", chip: "Desarrollo web", soft: "orangeSoft", text: "orangeText" },
  Educación: { badge: "Educación", glyph: "A+", chip: "Educación", soft: "yellowSoft", text: "yellowText" },
} as const;

const VisualWrap = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.space(7)};
`;

const Visual = styled.div<{ $area: Bootcamp["area"] }>`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  aspect-ratio: 16 / 7.5;
  min-height: 140px;

  .zoom {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(55% 130% at 92% -15%, ${({ theme }) => theme.colors.lilac}, transparent 62%),
      radial-gradient(45% 100% at 0% 125%, ${({ theme }) => theme.colors.main}, transparent 70%),
      linear-gradient(120deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 55%, ${({ theme }) => theme.colors.main} 100%);
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  /* Línea diagonal fina que cruza el visual. */
  .zoom::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 58.6%, rgba(255, 255, 255, 0.28) 58.8%, transparent 59.1%);
  }

  /* Símbolo grande como marca de agua. */
  .glyph {
    position: absolute;
    right: ${({ theme }) => theme.space(5)};
    bottom: -0.12em;
    font-size: clamp(3.5rem, 2.4rem + 3vw, 5rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.24);
    user-select: none;
  }

  .pill {
    position: absolute;
    top: ${({ theme }) => theme.space(4)};
    left: ${({ theme }) => theme.space(4)};
    padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme, $area }) => theme.colors[areaStyle[$area].text]};
    font-size: 0.6875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

/** Círculo sobre la esquina inferior del visual (el avatar del docente en Eduhall): isotipo de Kodigo sobre tile oscuro. */
const Seal = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.space(3)};
  bottom: -24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandDark};
  box-shadow: ${({ theme }) => theme.shadows.card};

  img {
    width: 22px;
    height: auto;
  }
`;

const Name = styled.h2`
  margin-bottom: ${({ theme }) => theme.space(3)};
  font-size: 1.375rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.3;

  a::after {
    content: "";
    position: absolute;
    inset: 0;
  }
`;

const Chips = styled.div<{ $area: Bootcamp["area"] }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(5)};

  span {
    padding: ${({ theme }) => `${theme.space(1.5)} ${theme.space(3.5)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.main50};
    color: ${({ theme }) => theme.colors.accentOnLight};
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.medium};
  }

  span:first-child {
    background: ${({ theme, $area }) => theme.colors[areaStyle[$area].soft]};
    color: ${({ theme, $area }) => theme.colors[areaStyle[$area].text]};
  }
`;

const Meta = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(5)};
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.weights.medium};

  li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
  }
`;

const Item = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.space(3)};
  transition:
    border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} linear;

  /* La tarjeta se eleva al pasar el cursor (solo con puntero fino; sin hover real no hay movimiento). */
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-6px);
    }
  }

  &:hover .zoom {
    transform: scale(1.1);
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: ${({ theme }) => `0 ${theme.space(3)} ${theme.space(2)}`};
  }

  .body > p {
    margin-bottom: ${({ theme }) => theme.space(5)};
  }

  .more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: ${({ theme }) => theme.space(4)};
    border-top: 1px dashed ${({ theme }) => theme.colors.borderStrong};
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  .more .sheet {
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.regular};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .more .go {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(1.5)};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  .more svg {
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover .more svg {
    transform: translateX(4px);
  }
`;

const Cell = styled(Reveal)`
  display: flex;

  > * {
    flex: 1;
  }
`;

interface BootcampGridProps {
  items: Bootcamp[];
  /** Nivel del título de cada tarjeta; h2 cuando la página solo tiene el h1 encima. */
  headingLevel?: "h2" | "h3";
}

export const BootcampGrid = ({ items, headingLevel = "h2" }: BootcampGridProps) => (
  <Grid>
    {items.map((b, i) => {
      const copy = areaStyle[b.area];
      const meta = [
        b.duration && { Icon: Clock, text: b.duration },
        b.modality && { Icon: Laptop, text: b.modality },
        b.level && { Icon: Signal, text: b.level },
      ].filter(Boolean) as { Icon: typeof Clock; text: string }[];
      return (
        // Escalonado por columna (3 por fila) para que no se acumule retraso en listas largas.
        <Cell key={b.slug} tag="li" index={i % 3} direction={i % 3 === 0 ? "right" : i % 3 === 2 ? "left" : "up"}>
          <Item>
            <VisualWrap aria-hidden="true">
              <Visual $area={b.area}>
                <div className="zoom" />
                <span className="glyph">{copy.glyph}</span>
                <span className="pill">{copy.badge}</span>
              </Visual>
              <Seal>
                <img src={isotype} alt="" width={22} height={22} />
              </Seal>
            </VisualWrap>
            <div className="body">
              <Chips $area={b.area}>
                <span>{copy.chip}</span>
                <span>Ruta práctica</span>
              </Chips>
              <Name as={headingLevel}>
                <Link to={`/bootcamps/${b.slug}`}>{b.name}</Link>
              </Name>
              <p>{b.summary}</p>
              {meta.length > 0 && (
                <Meta aria-label="Datos del programa">
                  {meta.map(({ Icon, text }) => (
                    <li key={text}>
                      <Icon size={18} />
                      {text}
                    </li>
                  ))}
                </Meta>
              )}
              <span className="more" aria-hidden="true">
                <span className="sheet">Ficha del programa</span>
                <span className="go">
                  Ver detalles <ArrowRight />
                </span>
              </span>
            </div>
          </Item>
        </Cell>
      );
    })}
  </Grid>
);
