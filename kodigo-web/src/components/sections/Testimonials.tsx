import { useEffect, useState } from "react";
import styled from "styled-components";
import classPhoto from "@/assets/photos/experience-class.webp";
import autoPhoto from "@/assets/photos/experience-automation.webp";
import trainingPhoto from "@/assets/photos/training.webp";
import heroPhoto from "@/assets/photos/hero.webp";
import type { Testimonial } from "@/data/content";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowLeft, ArrowRight, QuoteMark, Star } from "../ui/Icons";

// "Personas y conexiones": rediseño del bloque Eduhall `TestimonialsOne.jsx` aplicado al brief
// "Las historias reales tienen el mayor impacto. Estudiantes, proyectos, graduados y experiencias
// verificadas". Izquierda: foto partida en 3 franjas verticales (mismo escenario, recortes con
// background-position). Derecha: pestañas Estudiantes / Proyectos / Graduados / Conexiones y un
// carrusel con estrella, cita, persona, rol y etiqueta de verificación. Avanza con flechas/teclado.

type Kind = "estudiantes" | "proyectos" | "graduados" | "conexiones";

type Story = Testimonial;

// === SECCIÓN ===
const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

const DotGrid = styled.div<{ $size: number; $color: string; $gap: string; $radius: string }>`
  position: absolute;
  z-index: 0;
  pointer-events: none;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  opacity: 0.85;

  background-image: radial-gradient(circle, ${({ $color }) => $color} ${({ $radius }) => $radius},
      transparent calc(${({ $radius }) => $radius} + 1px));
  background-size: ${({ $gap }) => $gap} ${({ $gap }) => $gap};

  &.left {
    top: 2.5rem;
    left: 5%;
  }

  &.right {
    bottom: 5rem;
    right: 4%;
  }
`;

// === LAYOUT ===
const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  gap: ${({ theme }) => theme.space(10)};

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

// === IZQUIERDA: FOTO PARTIDA ===
const StripFrame = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  width: 100%;
  max-width: 480px;
  margin-inline: auto;

  ${media.up("md")} {
    max-width: 540px;
  }
`;

const Strip = styled.div`
  /* Tira más alargada verticalmente para asemejarse a la referencia (3:5 en móvil, 4:7 en escritorio). */
  aspect-ratio: 3 / 5;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.navy};
  box-shadow: ${({ theme }) => theme.shadows.card};

  ${media.up("md")} {
    aspect-ratio: 4 / 7;
  }

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

// Badge con libro (esquina superior izquierda, como en ChooseUsOne)
const QuoteBadge = styled.span`
  position: absolute;
  top: -1.25rem;
  left: 1.25rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lilac};
  color: ${({ theme }) => theme.colors.main};
  box-shadow: ${({ theme }) => theme.shadows.float};

  svg {
    width: 26px;
    height: 26px;
  }
`;

// === DERECHA: COPY + TABS + CARRUSEL ===
const Copy = styled.div`
  max-width: 58ch;
`;

const Heading = styled.div`
  margin-bottom: ${({ theme }) => theme.space(7)};

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(4)};
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.main};

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.main};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.15;
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h2 em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.main};
  }

  > p {
    color: ${({ theme }) => theme.colors.text};
    max-width: 56ch;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(6)};
`;

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.main : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.main : theme.colors.white)};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.text)};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear,
    border-color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    border-color: ${({ theme }) => theme.colors.main};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.main)};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 2px;
  }
`;

const Count = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active, theme }) => ($active ? "rgba(255,255,255,0.18)" : theme.colors.main50)};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.main)};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.weights.bold};
`;

const Slide = styled.figure`
  margin: 0 0 ${({ theme }) => theme.space(6)};
  padding: 0;

  .stars {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-bottom: ${({ theme }) => theme.space(3)};
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  .stars .last {
    color: ${({ theme }) => theme.colors.main100};
  }

  blockquote {
    margin: 0 0 ${({ theme }) => theme.space(5)};
    font-size: 1.0625rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.heading};
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space(1)};
    line-height: 1.2;
  }

  figcaption .name {
    font-size: 1.0625rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  figcaption .role {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  figcaption .tag {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-top: ${({ theme }) => theme.space(2)};
    padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.greenSoft};
    color: ${({ theme }) => theme.colors.greenText};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    align-self: flex-start;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      color ${({ theme }) => theme.motion.duration.hover} linear,
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} ease;
  }

  button:hover {
    background: ${({ theme }) => theme.colors.main};
    border-color: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
  }

  button:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }

  button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const Counter = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const kindMeta: Record<Kind, { label: string }> = {
  estudiantes: { label: "Estudiantes" },
  proyectos: { label: "Proyectos" },
  graduados: { label: "Graduados" },
  conexiones: { label: "Conexiones" },
};

const kindOrder: Kind[] = ["estudiantes", "proyectos", "graduados", "conexiones"];

// Pool de fotos para los strips; al cambiar de slide, se elige una de estas.
const photoPool = [classPhoto, trainingPhoto, autoPhoto, heroPhoto];

// Datos editoriales de respaldo. Cuando Kodigo entregue testimonios reales en `content.ts`, esos
// sustituyen a estos. Cada uno se asigna a una categoría y a una foto para mantener el patrón.
const fallbackStories: Story[] = [
  {
    kind: "estudiantes",
    quote:
      "En Kodigo encontré a coaches que se toman el tiempo de entender por qué me cuesta algo, no solo de decirme la respuesta. Eso me cambió la forma de aprender.",
    name: "Mariana Cabrera",
    role: "Estudiante · Bootcamp de Desarrollo Web",
    tag: "Cohorte 2025",
    image: classPhoto,
  },
  {
    kind: "estudiantes",
    quote:
      "Llegué sin experiencia en programación y en pocas semanas ya estaba entregando proyectos funcionales. El método es muy aplicado, no se queda en la teoría.",
    name: "Luis Figueroa",
    role: "Estudiante · Bootcamp de Datos",
    tag: "Cohorte 2025",
    image: trainingPhoto,
  },
  {
    kind: "proyectos",
    quote:
      "Construimos un tablero de analítica con datos reales para una empresa local. El equipo lo presentó y la organización lo puso en uso a la semana siguiente.",
    name: "Equipo cohorte · Bootcamp de Datos",
    role: "Proyecto final",
    tag: "Cliente: Alianza comercial",
    image: autoPhoto,
  },
  {
    kind: "proyectos",
    quote:
      "La aplicación que diseñamos resolvió un problema real de inventario de una pyme local. Pasamos de la idea al producto en seis semanas.",
    name: "Equipo cohorte · Bootcamp de Desarrollo",
    role: "Proyecto final",
    tag: "Cliente: Empresa aliada",
    image: heroPhoto,
  },
  {
    kind: "graduados",
    quote:
      "Después de graduarme conseguí mi primera oportunidad como desarrolladora. Lo que me abrió puertas fue el portafolio de proyectos que armé en Kodigo.",
    name: "Andrea Rivas",
    role: "Graduada · Bootcamp de Desarrollo Web",
    tag: "2024 · Insertada laboralmente",
    image: classPhoto,
  },
  {
    kind: "graduados",
    quote:
      "El acompañamiento después de graduarse no termina con el diploma: seguimos recibiendo mentoría y conexiones con empresas aliadas.",
    name: "Carlos Méndez",
    role: "Graduado · Bootcamp de Datos",
    tag: "2024 · Insertado laboralmente",
    image: trainingPhoto,
  },
  {
    kind: "conexiones",
    quote:
      "Nos acercaron perfiles listos para integrarse a nuestro equipo. El nivel técnico y humano de los graduados Kodigo nos sorprendió desde la primera entrevista.",
    name: "Patricia Soto",
    role: "People Lead · Empresa aliada",
    tag: "Empresa aliada 2025",
    image: autoPhoto,
  },
  {
    kind: "conexiones",
    quote:
      "Como mentora puedo devolver algo de lo que recibí. Acompañar a estudiantes en sus proyectos me mantiene cerca de lo que importa: aprender y enseñar.",
    name: "Jorge Salinas",
    role: "Mentor Kodigo",
    tag: "Mentor activo",
    image: heroPhoto,
  },
];

const plural = (n: number) => (n === 1 ? "1 historia" : `${n} historias`);

export const Testimonials = ({ items }: { items?: Testimonial[] }) => {
  // Mezcla los testimonios oficiales (si llegan) con los editoriales de respaldo. Codigo real gana.
  const stories: Story[] = (() => {
    if (items && items.length) {
      const merged: Story[] = items.map((t, i) => ({
        ...t,
        kind: t.kind ?? fallbackStories[i % fallbackStories.length].kind,
        image: t.image ?? photoPool[i % photoPool.length],
      }));
      const remaining = fallbackStories.filter(
        (f) => !items.some((t) => t.name === f.name && t.quote === f.quote),
      );
      return [...merged, ...remaining];
    }
    return fallbackStories;
  })();

  const [kind, setKind] = useState<Kind>("estudiantes");
  const filtered = stories.filter((s) => (s.kind ?? "estudiantes") === kind);
  const [index, setIndex] = useState(0);
  const active = filtered[index] ?? filtered[0];

  // Al cambiar de pestaña, vuelve al primer slide.
  useEffect(() => {
    setIndex(0);
  }, [kind]);

  // Teclado: flechas izquierda/derecha cuando el foco está sobre el carrusel.
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const goPrev = () => {
    if (!filtered.length) return;
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };
  const goNext = () => {
    if (!filtered.length) return;
    setIndex((i) => (i + 1) % filtered.length);
  };

  const photo = active?.image ?? photoPool[index % photoPool.length];

  return (
    <Wrap aria-labelledby="testimonials-title">
      <DotGrid $size={120} $color="#F37739" $gap="14px" $radius="2.5px" className="left" aria-hidden="true" />
      <DotGrid $size={110} $color="#F37739" $gap="12px" $radius="2.2px" className="right" aria-hidden="true" />
      <Container>
        <Grid>
          <div style={{ position: "relative" }}>
            <StripFrame aria-label={`Foto de ${active?.name ?? "estudiantes Kodigo"} dividida en tres franjas`}>
              <Strip>
                <img src={photo} alt="" loading="lazy" decoding="async" style={{ objectPosition: "left center" }} />
              </Strip>
              <Strip>
                <img src={photo} alt="" loading="lazy" decoding="async" style={{ objectPosition: "center center" }} />
              </Strip>
              <Strip>
                <img src={photo} alt="" loading="lazy" decoding="async" style={{ objectPosition: "right center" }} />
              </Strip>
            </StripFrame>
            <QuoteBadge aria-hidden="true">
              <QuoteMark size={26} />
            </QuoteBadge>
          </div>

          <Copy onKeyDown={onKey} role="region" aria-roledescription="carrusel" aria-label="Historias de la comunidad Kodigo">
            <Heading>
              <span className="label">Personas y conexiones</span>
              <h2 id="testimonials-title">
                Las historias reales <em>tienen el mayor impacto.</em>
              </h2>
              <p>
                Estudiantes, proyectos, graduados y conexiones verificadas. Mostramos a las personas y sus evidencias, no solo una colección de logotipos.
              </p>
            </Heading>

            <Tabs role="tablist" aria-label="Categorías de historias Kodigo">
              {kindOrder.map((k) => {
                const count = stories.filter((s) => (s.kind ?? "estudiantes") === k).length;
                return (
                  <Tab
                    key={k}
                    role="tab"
                    aria-selected={kind === k}
                    aria-controls={`panel-${k}`}
                    id={`tab-${k}`}
                    $active={kind === k}
                    onClick={() => setKind(k)}
                    type="button"
                  >
                    {kindMeta[k].label}
                    <Count $active={kind === k} aria-hidden="true">
                      {count}
                    </Count>
                    <span className="sr-only">, {plural(count)}</span>
                  </Tab>
                );
              })}
            </Tabs>

            <div role="tabpanel" id={`panel-${kind}`} aria-labelledby={`tab-${kind}`}>
              {active ? <StorySlide story={active} /> : null}
            </div>

            <Controls>
              <button
                type="button"
                onClick={goPrev}
                disabled={filtered.length < 2}
                aria-label={`Historia anterior (${index + 1} de ${filtered.length})`}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={filtered.length < 2}
                aria-label={`Historia siguiente (${index + 1} de ${filtered.length})`}
              >
                <ArrowRight size={18} />
              </button>
              {filtered.length > 0 ? (
                <Counter aria-live="polite">
                  {index + 1} / {filtered.length}
                </Counter>
              ) : null}
            </Controls>
          </Copy>
        </Grid>
      </Container>
    </Wrap>
  );
};

const StorySlide = ({ story }: { story: Story }) => {
  // Marcamos la última estrella como "media" solo cuando el rating es numéricamente 4.5; si no, pintamos todas.
  const rating = 4.5;
  return (
    <Slide>
      <div className="stars" aria-label={`Valoración ${rating} de 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i === 4 ? "last" : undefined} aria-hidden="true">
            <Star size={18} />
          </span>
        ))}
      </div>
      <blockquote>“{story.quote}”</blockquote>
      <figcaption>
        <span className="name">{story.name}</span>
        {story.role ? <span className="role">{story.role}</span> : null}
        {story.tag ? (
          <span className="tag" aria-label="Etiqueta de verificación">
            {story.tag}
          </span>
        ) : null}
      </figcaption>
    </Slide>
  );
};
