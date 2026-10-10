import styled from "styled-components";
import heroPhoto from "@/assets/photos/hero.webp";
import trainingPhoto from "@/assets/photos/training.webp";
import type { FaqItem } from "@/data/content";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { BookOpen } from "../ui/Icons";

// FAQ Kodigo: adapta el patrón `FaqOne.jsx` de Eduhall. Izquierda: collage de dos fotos (mismo enfoque
// que `Methodology` y `Testimonials`). Derecha: label + heading + lead + acordeón estilizado. Primera
// pregunta abierta con fondo violeta y texto blanco; las siguientes con pill + blanco y toggle azul.
// `<details>/<summary>` nativo = accesible sin JS ni Bootstrap.

interface Props {
  items?: FaqItem[];
  flushTop?: boolean;
}

// Preguntas de respaldo hasta que Kodigo entregue las oficiales (X-04).
const fallbackFaq: FaqItem[] = [
  {
    question: "¿Cómo me inscribo a un bootcamp?",
    answer:
      "Elegir un bootcamp es solo el primer paso: completa el formulario, agenda una llamada con admisiones y recibe tu oferta personalizada en pocos días.",
  },
  {
    question: "¿Necesito experiencia previa en tecnología?",
    answer:
      "No. Nuestros bootcamps están diseñados para principiantes; te damos rutas por nivel y te acompañamos desde los fundamentos hasta proyectos completos.",
  },
  {
    question: "¿Cuánto tiempo de acceso tengo al material?",
    answer:
      "Mientras el programa esté vigente en la plataforma, accedes a clases grabadas, recursos y comunidad. También recibirás actualizaciones relevantes sin costo extra.",
  },
  {
    question: "¿Qué pasa si necesito ayuda durante el programa?",
    answer:
      "Tienes coaches activos en cada cohorte y mentores de la industria. Las sesiones de mentoría, los espacios de preguntas y el canal de la comunidad están disponibles durante todo el programa.",
  },
  {
    question: "¿Ofrecen acompañamiento para el empleo?",
    answer:
      "Sí. Construyes un portafolio con proyectos reales y recibes mentoría para conectar con empresas aliadas. El acceso a KODIGO Jobs y la red sigue abierto después de graduarte.",
  },
];

const Wrap = styled(Section)<{ $flushTop?: boolean }>`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: ${({ $flushTop }) => ($flushTop ? "0" : "unset")};
`;

// === LAYOUT 2 COLUMNAS ===
const Grid = styled.div`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space(10)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

// === IZQUIERDA: COLLAGE DE FOTOS ===
const Collage = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
  grid-template-rows: auto auto;
  gap: ${({ theme }) => theme.space(4)};
  align-items: end;
`;

const Photo = styled.div`
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
`;

const PhotoSub = styled(Photo)`
  grid-column: 2;
  grid-row: 2;
  aspect-ratio: 4 / 5;

  ${media.up("md")} {
    aspect-ratio: 4 / 4.5;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -1.25rem;
  right: 0.5rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.float};

  ${media.up("md")} {
    width: 80px;
    height: 80px;
  }

  svg {
    width: 36px;
    height: 36px;
  }
`;

// === DERECHA: COPY + ACORDEÓN ===
const Copy = styled.div`
  max-width: 60ch;
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(4)};
  font-size: 1.0625rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  color: ${({ theme }) => theme.colors.accentOnLight};
`;

const Heading = styled.h2`
  margin-bottom: ${({ theme }) => theme.space(4)};
  font-size: clamp(1.875rem, 1.3rem + 2vw, 2.75rem);
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.heading};
  letter-spacing: -0.01em;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }
`;

const Lead = styled.p`
  margin-bottom: ${({ theme }) => theme.space(8)};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
`;

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(3)};
`;

const Item = styled.details`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.space(4)};
    padding: ${({ theme }) => theme.space(5)} ${({ theme }) => theme.space(6)};
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: "+";
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.main50};
    font-size: 1.4rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  &[open] {
    background: ${({ theme }) => theme.colors.main};
    border-color: transparent;
  }

  &[open] summary {
    color: ${({ theme }) => theme.colors.white};
  }

  &[open] summary::after {
    content: "−";
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.accentOnLight};
  }

  > p {
    padding: 0 ${({ theme }) => theme.space(6)} ${({ theme }) => theme.space(6)};
    color: ${({ theme }) => theme.colors.onNavy};
    font-size: 0.9375rem;
  }

  &[open] > p {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Faq = ({ items, flushTop = false }: Props) => {
  const data = items && items.length ? items : fallbackFaq;

  return (
    <Wrap $flushTop={flushTop} aria-labelledby="faq-title">
      <Container>
        <Grid>
          <Collage>
            <PhotoMain>
              <img src={trainingPhoto} alt="Mentor trabajando con un estudiante Kodigo" width={900} height={1200} loading="lazy" decoding="async" />
            </PhotoMain>
            <PhotoSub>
              <img src={heroPhoto} alt="Equipo Kodigo en sesión de mentoría" width={600} height={675} loading="lazy" decoding="async" />
            </PhotoSub>
            <Badge aria-hidden="true">
              <BookOpen size={36} />
            </Badge>
          </Collage>

          <Copy>
            <Label>Preguntas frecuentes</Label>
            <Heading id="faq-title">
              Encuentra respuestas <em>a tus preguntas.</em>
            </Heading>
            <Lead>
              Antes de empezar, lo más común: cómo inscribirte, qué pasa después y cómo te acompañamos durante y después del programa.
            </Lead>

            <List>
              {data.map((f) => (
                <Item key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </Item>
              ))}
            </List>
          </Copy>
        </Grid>
      </Container>
    </Wrap>
  );
};
