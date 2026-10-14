import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import benefitsBg from "@/assets/photos/benefits-bg.webp";
import type { Testimonial } from "@/data/content";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { Star, StarHalf } from "@phosphor-icons/react";
import { ArrowLeft, ArrowRight, BookOpen, Community, QuoteMark, ThumbsUp, Users, VideoCamera } from "../ui/Icons";
import { wobble } from "@/styles/effects";
import { Reveal } from "../ui/Reveal";
import { VisuallyHidden } from "../ui/VisuallyHidden";

// "Personas y conexiones": arriba, los contadores (KPI) estilo Eduhall CounterOne; debajo, el bloque de testimonios de
// Eduhall (TestimonialsOne): tarjetas blancas con avatar circular, insignia naranja de comillas, estrellas, nombre y rol en
// un carrusel horizontal a la izquierda y, a la derecha, etiqueta, título, texto y flechas. Las historias son las mismas
// de antes (estudiantes, proyectos, graduados y conexiones); ya no hay pestañas ni foto partida.

type Story = Testimonial;

// === SECCIÓN ===
const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* Foto de reunión de fondo bajo un velo azul de marca (navy -> violeta) con opacidad media: la foto se lee con claridad
     pero queda por detrás de los contadores y del panel. Arriba parte del navy de la marquesina de logos (sin escalón)
     y abajo se funde con el tono surface de la sección siguiente. */
  background:
    linear-gradient(180deg, rgba(19, 30, 75, 0.92) 0%, rgba(30, 40, 130, 0.62) 30%, rgba(60, 70, 205, 0.5) 72%, ${({ theme }) => theme.colors.surface} 100%),
    url(${benefitsBg}) center / cover no-repeat,
    ${({ theme }) => theme.colors.navy};
`;

// Panel tintado (fondo `surface` de Eduhall) que contiene el bloque de testimonios. Va dentro del contenedor y con
// esquinas redondeadas para no fundirse con la sección tintada que le sigue en el Home.
const Band = styled.div`
  padding: ${({ theme }) => theme.space(6)} ${({ theme }) => theme.space(5)} ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};

  ${media.up("lg")} {
    padding: ${({ theme }) => theme.space(12)} ${({ theme }) => theme.space(10)} ${({ theme }) => theme.space(6)};
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
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space(12)};
  }
`;

// === IZQUIERDA: CARRUSEL DE TARJETAS ===
const Track = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.space(6)};
  overflow-x: auto;
  padding: ${({ theme }) => `${theme.space(2)} ${theme.space(1)} ${theme.space(8)}`};
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  /* Desvanece el borde derecho para sugerir que hay más tarjetas. */
  -webkit-mask-image: linear-gradient(90deg, #000 90%, transparent);
  mask-image: linear-gradient(90deg, #000 90%, transparent);

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii.md};
  }

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }

  > li {
    flex: 0 0 min(340px, 84%);
    scroll-snap-align: start;
  }

  /* El segundo de cada par baja un poco, como en la referencia de Eduhall. */
  > li:nth-child(even) {
    margin-top: ${({ theme }) => theme.space(6)};
  }
`;

const Card = styled.figure`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: ${({ theme }) => theme.space(6)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lift};
  }

  .avatar {
    position: relative;
    align-self: flex-start;
    margin-bottom: ${({ theme }) => theme.space(5)};
  }

  /* Avatar con iniciales (no hay retratos de las personas): círculo con el degradado de Kodigo. */
  .initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.main}, ${({ theme }) => theme.colors.lilac});
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.02em;
  }

  /* Insignia naranja de comillas, montada sobre el borde inferior derecho del avatar. */
  .quote {
    position: absolute;
    right: -10px;
    bottom: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 3px solid ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.white};
  }

  .quote svg {
    width: 16px;
    height: 16px;
  }

  blockquote {
    margin: 0 0 ${({ theme }) => theme.space(5)};
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }

  .stars {
    display: inline-flex;
    gap: 4px;
    margin-bottom: ${({ theme }) => theme.space(3)};
    /* Color de énfasis de la marca: rgb(108, 232, 215) = #6ce8d7 (theme.colors.accentOnDark). */
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  figcaption {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space(1)};
    line-height: 1.3;
  }

  .name {
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.heading};
  }

  .role {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .tag {
    align-self: flex-start;
    margin-top: ${({ theme }) => theme.space(3)};
    padding: ${({ theme }) => `${theme.space(1)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.greenSoft};
    color: ${({ theme }) => theme.colors.greenText};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

// === DERECHA: COPY + FLECHAS ===
const Copy = styled.div`
  max-width: 52ch;

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.accentOnLight};
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

  > p {
    margin-bottom: ${({ theme }) => theme.space(8)};
    color: ${({ theme }) => theme.colors.text};
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
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      color ${({ theme }) => theme.motion.duration.hover} linear,
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} ease;
  }

  button:hover:not([disabled]) {
    background: ${({ theme }) => theme.colors.main};
    border-color: ${({ theme }) => theme.colors.accentOnLight};
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
  }
`;

// Datos editoriales de respaldo. Cuando Kodigo entregue testimonios reales en `content.ts`, esos sustituyen a estos.
const fallbackStories: Story[] = [
  {
    kind: "estudiantes",
    quote:
      "En Kodigo encontré a coaches que se toman el tiempo de entender por qué me cuesta algo, no solo de decirme la respuesta. Eso me cambió la forma de aprender.",
    name: "Mariana Cabrera",
    role: "Estudiante · Bootcamp de Desarrollo Web",
    tag: "Cohorte 2025",
  },
  {
    kind: "estudiantes",
    quote:
      "Llegué sin experiencia en programación y en pocas semanas ya estaba entregando proyectos funcionales. El método es muy aplicado, no se queda en la teoría.",
    name: "Luis Figueroa",
    role: "Estudiante · Bootcamp de Datos",
    tag: "Cohorte 2025",
  },
  {
    kind: "proyectos",
    quote:
      "Construimos un tablero de analítica con datos reales para una empresa local. El equipo lo presentó y la organización lo puso en uso a la semana siguiente.",
    name: "Equipo cohorte · Bootcamp de Datos",
    role: "Proyecto final",
    tag: "Cliente: Alianza comercial",
  },
  {
    kind: "proyectos",
    quote:
      "La aplicación que diseñamos resolvió un problema real de inventario de una pyme local. Pasamos de la idea al producto en seis semanas.",
    name: "Equipo cohorte · Bootcamp de Desarrollo",
    role: "Proyecto final",
    tag: "Cliente: Empresa aliada",
  },
  {
    kind: "graduados",
    quote:
      "Después de graduarme conseguí mi primera oportunidad como desarrolladora. Lo que me abrió puertas fue el portafolio de proyectos que armé en Kodigo.",
    name: "Andrea Rivas",
    role: "Graduada · Bootcamp de Desarrollo Web",
    tag: "2024 · Insertada laboralmente",
  },
  {
    kind: "graduados",
    quote:
      "El acompañamiento después de graduarse no termina con el diploma: seguimos recibiendo mentoría y conexiones con empresas aliadas.",
    name: "Carlos Méndez",
    role: "Graduado · Bootcamp de Datos",
    tag: "2024 · Insertado laboralmente",
  },
  {
    kind: "conexiones",
    quote:
      "Nos acercaron perfiles listos para integrarse a nuestro equipo. El nivel técnico y humano de los graduados Kodigo nos sorprendió desde la primera entrevista.",
    name: "Patricia Soto",
    role: "People Lead · Empresa aliada",
    tag: "Empresa aliada 2025",
  },
  {
    kind: "conexiones",
    quote:
      "Como mentora puedo devolver algo de lo que recibí. Acompañar a estudiantes en sus proyectos me mantiene cerca de lo que importa: aprender y enseñar.",
    name: "Jorge Salinas",
    role: "Mentor Kodigo",
    tag: "Mentor activo",
  },
];

/** Iniciales del avatar: primeras letras de las dos primeras palabras con letra (ignora "·"). */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /\p{L}/u.test(w))
    .slice(0, 2)
    .map((w) => Array.from(w)[0].toUpperCase())
    .join("");

// === BLOQUE DE CONTADORES (estilo Eduhall CounterOne) ===
// Tarjetas de "KPI" en la parte SUPERIOR de la seccion Beneficios (= Testimonials). Mismo lenguaje
// visual que el componente de la plantilla Eduhall: icono en circulo blanco + numero grande + etiqueta.
// Los valores son PROVISIONALES hasta que Kodigo entregue las cifras oficiales con su fuente
// (regla del proyecto: no se publican cifras sin respaldo). El hook useCountUp anima un entero;
// el formato final aplica el prefijo y, si suffix es "K", divide entre 1000 con N decimales.
type Tone = "main" | "orange";
const counterCards: {
  icon: React.ReactNode;
  tone: Tone;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}[] = [
  { icon: <VideoCamera />, tone: "orange", value: 4500, prefix: "+", suffix: "K", decimals: 1, label: "Personas formadas" },
  { icon: <Users />, tone: "main", value: 428, label: "Personas empleadas" },
  { icon: <ThumbsUp />, tone: "main", value: 400, prefix: "+", label: "Personas certificadas" },
  { icon: <Community />, tone: "orange", value: 360, prefix: "+", label: "Empresas formadas" },
];

const counterTones: Record<Tone, { bg: "main50" | "orangeSoft"; icon: "main" | "orangeText" }> = {
  main: { bg: "main50", icon: "main" },
  orange: { bg: "orangeSoft", icon: "orangeText" },
};

const CounterGrid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
  margin-bottom: ${({ theme }) => theme.space(14)};

  ${media.up("sm")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const CounterItem = styled(Reveal)<{ $tone: Tone }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => `${theme.space(9)} ${theme.space(5)}`};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  isolation: isolate;
  transition:
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  /* Misma capa cromatica que el .zoom de BootcampGrid (lila + main sobre navy/violetDeep).
     Se aplica a TODO el fondo de la tarjeta para que las 4 cards de contadores
     compartan el efecto visual de las cards de formaciones. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(55% 130% at 92% -15%, ${({ theme }) => theme.colors.lilac}, transparent 62%),
      radial-gradient(45% 100% at 0% 125%, ${({ theme }) => theme.colors.main}, transparent 70%),
      linear-gradient(120deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.violetDeep} 55%, ${({ theme }) => theme.colors.main} 100%);
  }

  /* Linea diagonal fina que cruza la tarjeta (mismo detalle que las cards de formaciones). */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(105deg, transparent 58.6%, rgba(255, 255, 255, 0.18) 58.8%, transparent 59.1%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lift};
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme, $tone }) => theme.colors[counterTones[$tone].icon]};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  /* Efecto "animation-item" de Eduhall (animate__wobble de animate.css): el icono
     (svg) se tambalea al pasar el cursor por la tarjeta. La animación se aplica
     al <svg> y no al span contenedor para que solo el icono se mueva, no el
     círculo blanco de fondo. Se anula con movimiento reducido. */
  @media (prefers-reduced-motion: no-preference) {
    &:hover .icon svg {
      animation: ${wobble} 1s ease-in-out;
      transform-origin: center;
    }
  }

  .number {
    font-size: clamp(2rem, 1.4rem + 2vw, 2.75rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.1;
    color: ${({ theme }) => theme.colors.white};
    letter-spacing: -0.01em;
  }

  .label {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.9;
  }
`;

/** Formatea el contador segun prefijo, sufijo y decimales del stat. */
const formatStat = (
  n: number,
  prefix: string | undefined,
  suffix: string | undefined,
  decimals: number | undefined,
) => {
  const out = suffix === "K" ? (n / 1000).toFixed(decimals ?? 1) : n.toLocaleString("en-US");
  return `${prefix ?? ""}${out}${suffix ?? ""}`;
};

// Tarjeta de contador: componente propio para poder usar useCountUp (un hook no puede llamarse dentro de un .map).
const CounterCard = ({ card: c, index: i, visible }: { card: (typeof counterCards)[number]; index: number; visible: boolean }) => {
  const shown = useCountUp(c.value, visible);
  const labelId = `counter-${i}`;
  return (
    <CounterItem tag="li" index={i} direction={i === 0 ? "right" : i === 3 ? "left" : "up"} $tone={c.tone} aria-labelledby={labelId}>
      <span className="icon" aria-hidden="true">
        {c.icon}
      </span>
      <span className="number" aria-hidden="true">
        {formatStat(shown, c.prefix, c.suffix, c.decimals)}
      </span>
      <VisuallyHidden>{formatStat(c.value, c.prefix, c.suffix, c.decimals)}</VisuallyHidden>
      <span id={labelId} className="label">
        {c.label}
      </span>
    </CounterItem>
  );
};

export const Testimonials = ({ items }: { items?: Testimonial[] }) => {
  // Mezcla los testimonios oficiales (si llegan) con los editoriales de respaldo. Lo real gana.
  const stories: Story[] = (() => {
    if (items && items.length) {
      const remaining = fallbackStories.filter((f) => !items.some((t) => t.name === f.name && t.quote === f.quote));
      return [...items, ...remaining];
    }
    return fallbackStories;
  })();

  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Habilita/deshabilita las flechas según la posición del carrusel.
  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  // Desplaza una tarjeta (ancho + separación) en la dirección pedida.
  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap) });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  const [counterRef, counterVisible] = useInView<HTMLUListElement>("0px 0px 200px 0px");

  return (
    <Wrap aria-labelledby="testimonials-title">
      {/* Bloque superior de contadores (estilo Eduhall CounterOne): vive en la MISMA sección
         "Beneficios" y aparece encima del bloque de testimonios. */}
      <Container>
        <VisuallyHidden as="h2">Cifras clave de Kodigo</VisuallyHidden>
        <CounterGrid ref={counterRef}>
          {counterCards.map((c, i) => (
            <CounterCard key={c.label} card={c} index={i} visible={counterVisible} />
          ))}
        </CounterGrid>
      </Container>
      <Container>
        <Band>
          <Grid>
            <Track
              ref={trackRef}
              tabIndex={0}
              role="group"
              aria-roledescription="carrusel"
              aria-label="Historias de la comunidad Kodigo"
              onScroll={updateEdges}
              onKeyDown={onKey}
            >
              {stories.map((s) => (
                <Reveal key={`${s.name}-${s.quote.slice(0, 12)}`} tag="li" direction="up">
                  <Card>
                    <div className="avatar" aria-hidden="true">
                      <span className="initials">{initialsOf(s.name)}</span>
                      <span className="quote">
                        <QuoteMark size={16} />
                      </span>
                    </div>
                    <blockquote>{s.quote}</blockquote>
                    {/* Valoración 4.5 con Phosphor Icons: ph-star-fill (completa) y ph-star-half (media). */}
                    <div className="stars" role="img" aria-label="Valoración 4.5 de 5">
                      {Array.from({ length: 4 }, (_, i) => (
                        <Star key={i} size={20} weight="fill" aria-hidden="true" />
                      ))}
                      <StarHalf size={20} weight="fill" aria-hidden="true" />
                    </div>
                    <figcaption>
                      <span className="name">{s.name}</span>
                      {s.role ? <span className="role">{s.role}</span> : null}
                      {s.tag ? <span className="tag">{s.tag}</span> : null}
                    </figcaption>
                  </Card>
                </Reveal>
              ))}
            </Track>

            <Copy>
              <span className="label">
                <BookOpen />
                Personas y conexiones
              </span>
              <h2 id="testimonials-title">
                Las historias reales <em>tienen el mayor impacto.</em>
              </h2>
              <p>
                Estudiantes, proyectos, graduados y conexiones verificadas. Mostramos a las personas y sus evidencias, no solo una colección de logotipos.
              </p>
              <Controls>
                <button type="button" onClick={() => scrollByCard(-1)} disabled={edges.start} aria-label="Historia anterior">
                  <ArrowLeft size={18} />
                </button>
                <button type="button" onClick={() => scrollByCard(1)} disabled={edges.end} aria-label="Historia siguiente">
                  <ArrowRight size={18} />
                </button>
              </Controls>
            </Copy>
          </Grid>
        </Band>
      </Container>
    </Wrap>
  );
};
