import styled, { css } from "styled-components";
import contenido from "@/assets/icons/contenido.png";
import horarios from "@/assets/icons/horarios.png";
import modalidad from "@/assets/icons/modalidad.png";
import ritmo from "@/assets/icons/ritmo.png";
import sphere from "@/assets/aivent/sphere.webp";
import wave from "@/assets/aivent/bg-wave.webp";
import card3 from "@/assets/aivent/card-3.webp";
import card4 from "@/assets/aivent/card-4.webp";
import card5 from "@/assets/aivent/card-5.webp";
import card6 from "@/assets/aivent/card-6.webp";
import smallPhoto from "@/assets/photos/hero-768.webp";
import mainPhoto from "@/assets/photos/training.webp";
import { adaptiveTraining } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp, flipInY, spin, upDown } from "@/styles/effects";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { bracketLabel, silverText } from "../ui/AiventKit";
import { Container, Section } from "../ui/Container";
import { Reveal } from "../ui/Reveal";

const icons = { horarios, ritmo, modalidad, contenido } as const;
const cardImages = [card3, card4, card5, card6] as const;

// Bloque "Find Tutoring Jobs" de Eduhall (Home 3): collage de fotos a la izquierda con una insignia y una foto pequeña
// flotante, y a la derecha etiqueta, título, texto, rejilla 2x2 de ventajas con icono y un botón.
// Efectos de la plantilla: entradas fade-right / fade-left (AOS), insignia con bounceIn, foto pequeña con upDown,
// puntos decorativos y giro del icono (flipInY) al pasar el cursor.
// Fondo con parallax (jarallax de AIvent): ondas de luz bajo un velo índigo que se funde con las secciones vecinas; con
// cursor y pantalla grande la imagen queda fija mientras la sección se desplaza (background-attachment: fixed).
const Block = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(180deg, ${({ theme }) => theme.colors.aiventDark} 0%, rgba(16, 20, 53, 0.82) 18%, rgba(16, 20, 53, 0.86) 82%, ${({ theme }) => theme.colors.aiventDark} 100%),
    url(${wave}) center / cover no-repeat,
    ${({ theme }) => theme.colors.aiventDark};

  @media (min-width: 992px) and (hover: hover) and (prefers-reduced-motion: no-preference) {
    background-attachment: scroll, fixed, scroll;
  }
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(12)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: ${({ theme }) => theme.space(16)};
  }
`;

const Collage = styled.div<{ $visible: boolean }>`
  position: relative;
  max-width: 560px;
  width: 100%;
  margin-inline: auto;
  padding-bottom: ${({ theme }) => theme.space(10)};

  isolation: isolate;

  /* Esfera 3D de AIvent girando detrás de la foto (rotate-animation) con resplandor violeta. */
  .orb {
    position: absolute;
    top: -40px;
    left: -28px;
    z-index: -1;
    width: 150px;

    ${media.up("md")} {
      top: -64px;
      left: -72px;
      width: 240px;
    }
    height: auto;
    filter: drop-shadow(0 18px 40px rgba(118, 77, 240, 0.5));
    pointer-events: none;
  }

  .main {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 9 / 10;

    ${media.up("lg")} {
      aspect-ratio: 1 / 1;
    }
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.xl};
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .small {
    position: absolute;
    left: -12px;
    bottom: 0;
    width: 52%;
    padding: ${({ theme }) => theme.space(2.5)};
    background: ${({ theme }) => theme.colors.aiventDark2};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.float};

    img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      border-radius: ${({ theme }) => theme.radii.md};
    }

    ${media.up("md")} {
      left: -32px;
    }
  }

  .badge {
    position: absolute;
    top: 28px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(3)};
    padding: ${({ theme }) => `${theme.space(3)} ${theme.space(5)} ${theme.space(3)} ${theme.space(3)}`};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventViolet};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.float};

    ${media.up("md")} {
      right: -24px;
    }

    .circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.aiventViolet};
    }

    strong {
      display: block;
      font-size: 1.5rem;
      line-height: 1.1;
    }

    span.label {
      font-size: 0.875rem;
      font-weight: ${({ theme }) => theme.weights.semibold};
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .orb {
      animation: ${spin} 50s linear infinite;
    }

    /* "scale-in-mask" de AIvent: la foto se destapa de abajo hacia arriba mientras se asienta. */
    .main {
      clip-path: ${({ $visible }) => ($visible ? "inset(0 0 0 0 round 24px)" : "inset(100% 0 0 0 round 24px)")};
      transform: ${({ $visible }) => ($visible ? "none" : "scale(1.12)")};
      transition:
        clip-path 1.2s ${({ theme }) => theme.motion.easing},
        transform 1.4s ${({ theme }) => theme.motion.easing};
    }

    .small {
      animation: ${upDown} 6s ease-in-out infinite;
    }

    .badge {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    }

    ${({ $visible }) =>
      $visible &&
      css`
        .badge {
          animation: ${bounceIn} 1s ease 0.3s both;
        }
      `}
  }
`;

const Text = styled.div<{ $visible: boolean }>`
  .label {
    ${bracketLabel}
    margin-bottom: ${({ theme }) => theme.space(3)};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    line-height: 1.2;
    ${silverText}
  }

  p.lead {
    margin: ${({ theme }) => `${theme.space(4)} 0 ${theme.space(8)}`};
    max-width: 56ch;
    color: ${({ theme }) => theme.colors.onNavy};
  }

  @media (prefers-reduced-motion: no-preference) {
    .label,
    h2,
    p.lead {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    }

    ${({ $visible }) =>
      $visible &&
      css`
        .label {
          animation: ${bounceInDown} 0.9s ease both;
        }
        h2 {
          animation: ${bounceIn} 0.9s ease 0.1s both;
        }
        p.lead {
          animation: ${bounceInUp} 0.9s ease 0.2s both;
        }
      `}
  }
`;

// Filas estilo "Event Schedule" de AIvent: numeral en contorno, icono, título, descripción y miniatura redondeada a la derecha
// (como la foto del ponente), separadas por líneas finas. Cada ventaja aparece una sola vez. Al pasar el cursor, un barrido
// violeta recorre la fila, el numeral se llena, el icono gira (flipInY) y la miniatura recupera su color y se acerca.
const Features = styled.ul<{ $visible: boolean }>`
  margin-top: ${({ theme }) => theme.space(14)};
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  counter-reset: feature;

  @media (prefers-reduced-motion: no-preference) {
    > li {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
      transform: ${({ $visible }) => ($visible ? "none" : "translateX(-32px)")};
      transition:
        opacity 0.7s ease,
        transform 0.8s ${({ theme }) => theme.motion.easing};
    }

    > li:nth-child(2) {
      transition-delay: 0.12s;
    }

    > li:nth-child(3) {
      transition-delay: 0.24s;
    }

    > li:nth-child(4) {
      transition-delay: 0.36s;
    }
  }
`;

const Feature = styled.li`
  position: relative;
  isolation: isolate;
  counter-increment: feature;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  grid-template-areas:
    "icon title"
    "icon text";
  column-gap: ${({ theme }) => theme.space(5)};
  row-gap: ${({ theme }) => theme.space(1)};
  align-items: center;
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(3)}`};
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  ${media.up("md")} {
    grid-template-columns: 72px 56px minmax(0, 1fr) minmax(0, 1.3fr) 96px;
    grid-template-areas: "num icon title text thumb";
    column-gap: ${({ theme }) => theme.space(6)};
    padding: ${({ theme }) => `${theme.space(7)} ${theme.space(5)}`};
  }

  /* Barrido violeta que entra desde la izquierda. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(90deg, rgba(118, 77, 240, 0.32), rgba(118, 77, 240, 0));
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.6s ${({ theme }) => theme.motion.easing};
  }

  &:hover::before {
    transform: scaleX(1);
  }

  .num {
    grid-area: num;
    display: none;
    font-size: 2.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
    transition:
      color ${({ theme }) => theme.motion.duration.base} ease,
      -webkit-text-stroke-color ${({ theme }) => theme.motion.duration.base} ease;

    ${media.up("md")} {
      display: block;
    }
  }

  .num::before {
    content: "0" counter(feature);
  }

  &:hover .num {
    color: ${({ theme }) => theme.colors.white};
    -webkit-text-stroke-color: ${({ theme }) => theme.colors.white};
  }

  .icon {
    grid-area: icon;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventViolet};
    box-shadow: 0 8px 24px rgba(118, 77, 240, 0.35);
  }

  &:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  h3 {
    grid-area: title;
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    grid-area: text;
    font-size: 1rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.onNavy};
  }

  .thumb {
    grid-area: thumb;
    display: none;
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.md};
    filter: saturate(0.5) brightness(0.8);
    transition:
      filter 0.5s ease,
      transform 0.5s ${({ theme }) => theme.motion.easing};

    ${media.up("md")} {
      display: block;
    }
  }

  &:hover .thumb {
    filter: none;
    transform: scale(1.08) rotate(-3deg);
  }
`;

// Cierre del bloque: nota con filo violeta (acento de las tarjetas de Eduhall) bajo el botón.
const Closing = styled.div`
  margin-top: ${({ theme }) => theme.space(10)};
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(6)}`};
  border-left: 4px solid ${({ theme }) => theme.colors.main};
  border-radius: 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0;
  background: ${({ theme }) => theme.colors.aiventDark2};
  border-left-color: ${({ theme }) => theme.colors.aiventViolet};

  h3 {
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.onNavy};
  }
`;

const Award = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14.5-1.5 7 5-2.5 5 2.5-1.5-7" />
  </svg>
);

export const AdaptiveTraining = () => {
  const [ref, visible] = useInView<HTMLDivElement>();
  const [featuresRef, featuresVisible] = useInView<HTMLUListElement>();
  const { badge } = adaptiveTraining;
  return (
    <Block aria-labelledby="adaptive-title">
      <Container>
        <Layout>
          <Reveal direction="right">
            <Collage ref={ref} $visible={visible}>
              <img className="orb" src={sphere} alt="" aria-hidden="true" width={900} height={900} loading="lazy" />
              <img className="main" src={mainPhoto} alt={adaptiveTraining.photoAlt} width={900} height={1000} loading="lazy" />
              <div className="small">
                <img src={smallPhoto} alt={adaptiveTraining.photoSmallAlt} width={768} height={409} loading="lazy" />
              </div>
              <div className="badge">
                <span className="circle">
                  <Award />
                </span>
                <div>
                  <strong>{badge.value}</strong>
                  <span className="label">{badge.label}</span>
                </div>
              </div>
            </Collage>
          </Reveal>
          <Reveal direction="left">
            <Text $visible={visible}>
              <span className="label">{adaptiveTraining.label}</span>
              <h2 id="adaptive-title">{adaptiveTraining.title}</h2>
              <p className="lead">{adaptiveTraining.lead}</p>
              <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} arrow="right">
                {adaptiveTraining.cta}
              </ButtonLink>
              <Reveal direction="up">
                <Closing>
                  <h3>{adaptiveTraining.closing.title}</h3>
                  <p>{adaptiveTraining.closing.text}</p>
                </Closing>
              </Reveal>
            </Text>
          </Reveal>
        </Layout>
        <Features ref={featuresRef} $visible={featuresVisible}>
          {adaptiveTraining.features.map((f, i) => (
            <Feature key={f.title}>
              <span className="num" aria-hidden="true" />
              <div className="icon">
                <img src={icons[f.icon]} alt="" width={24} height={24} loading="lazy" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <img className="thumb" src={cardImages[i % cardImages.length]} alt="" aria-hidden="true" width={96} height={96} loading="lazy" />
            </Feature>
          ))}
        </Features>
      </Container>
    </Block>
  );
};
