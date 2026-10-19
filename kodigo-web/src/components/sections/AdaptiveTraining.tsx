import styled, { css } from "styled-components";
import adaptationBg from "@/assets/b2b/adaptacion-bg.webp";
import iconHorarios from "@/assets/b2b/icons/adaptacion-01-horarios-reloj.svg";
import iconRitmo from "@/assets/b2b/icons/adaptacion-02-ritmo-calendario.svg";
import iconModalidad from "@/assets/b2b/icons/adaptacion-03-modalidad-laptop.svg";
import iconContenido from "@/assets/b2b/icons/adaptacion-04-contenido-objetivo.svg";
import thumb1 from "@/assets/b2b/lista-01.webp";
import thumb2 from "@/assets/b2b/lista-02.webp";
import thumb3 from "@/assets/b2b/lista-03.webp";
import thumb4 from "@/assets/b2b/lista-04.webp";
import smallPhoto from "@/assets/photos/hero-768.webp";
import mainPhoto from "@/assets/photos/training.webp";
import { adaptiveTraining } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp, flipInY, upDown } from "@/styles/effects";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";
import { bracketLabel, headlineText, iconTile, imageBackdrop, keywordText } from "../ui/B2bKit";
import { Container, Section } from "../ui/Container";
import { Plexus, type GlobeOptions } from "../ui/Plexus";
import { Reveal } from "../ui/Reveal";

const icons = { horarios: iconHorarios, ritmo: iconRitmo, modalidad: iconModalidad, contenido: iconContenido } as const;
const thumbs = [thumb1, thumb2, thumb3, thumb4] as const;
const GLOBE: GlobeOptions = { seed: 5, count: 200, speed: 0.12 };

// Bloque de adaptación a la operación de la empresa: collage de fotos a la izquierda (globo plexus, insignia "+360" y
// foto pequeña flotante) y a la derecha etiqueta, título con la frase final en degradado, texto, botón y nota de cierre.
// Debajo, las cuatro ventajas como filas: numeral en contorno, ícono, título, descripción y miniatura redondeada.
// Fondo ya tratado en morado que se funde con las secciones vecinas.
const Block = styled(Section)`
  ${imageBackdrop(adaptationBg, 0.5)}
  padding-block: ${({ theme }) => theme.section.dense};
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(12)};
  align-items: center;

  ${media.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
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

  /* Globo plexus detrás de la foto, asomando por la esquina superior izquierda. */
  .orb {
    position: absolute;
    top: -48px;
    left: -40px;
    z-index: -1;
    width: 170px;
    height: 170px;

    ${media.up("md")} {
      top: -64px;
      left: -40px;
      width: 240px;
      height: 240px;
    }

    ${media.up("xl")} {
      top: -72px;
      left: -84px;
      width: 260px;
      height: 260px;
    }
  }

  .main {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 9 / 10;
    object-fit: cover;
    border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
    border-radius: 28px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);

    ${media.up("lg")} {
      aspect-ratio: 1 / 1;
    }
  }

  .small {
    position: absolute;
    left: -12px;
    bottom: 0;
    width: 52%;
    padding: ${({ theme }) => theme.space(2.5)};
    background: ${({ theme }) => theme.b2b.bg2};
    border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
    border-radius: 22px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);

    img {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      border-radius: 14px;
    }

    ${media.up("xl")} {
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
    padding: ${({ theme }) => `${theme.space(3)} ${theme.space(6)} ${theme.space(3)} ${theme.space(3)}`};
    border-radius: 16px;
    background: ${({ theme }) => theme.b2b.purple};
    color: ${({ theme }) => theme.b2b.text};
    box-shadow: 0 16px 40px -8px rgba(110, 60, 200, 0.7);

    ${media.up("xl")} {
      right: -24px;
    }

    .circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${({ theme }) => theme.b2b.text};
      color: ${({ theme }) => theme.b2b.purple};
    }

    strong {
      display: block;
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1.1;
    }

    span.label {
      font-size: 0.875rem;
      font-weight: ${({ theme }) => theme.weights.medium};
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    /* La foto se destapa de abajo hacia arriba mientras se asienta. */
    .main {
      clip-path: ${({ $visible }) => ($visible ? "inset(0 0 0 0 round 28px)" : "inset(100% 0 0 0 round 28px)")};
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
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  h2 {
    font-size: clamp(2.25rem, 1.4rem + 2.6vw, 3.5rem);
    line-height: 1.08;
    ${headlineText}
  }

  h2 em {
    font-style: normal;
    white-space: nowrap;
    ${keywordText}
  }

  p.lead {
    margin: ${({ theme }) => `${theme.space(5)} 0 ${theme.space(8)}`};
    max-width: 52ch;
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.b2b.text2};
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

// Nota de cierre: tarjeta de vidrio con un trazo teal junto al título.
const Closing = styled.div`
  margin-top: ${({ theme }) => theme.space(10)};
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(7)}`};
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(110, 60, 200, 0.4), rgba(38, 20, 84, 0.55));
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  h3 {
    display: flex;
    align-items: baseline;
    gap: ${({ theme }) => theme.space(3)};
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
    color: ${({ theme }) => theme.b2b.text};
  }

  h3::before {
    content: "";
    flex: none;
    width: 16px;
    height: 3px;
    border-radius: 3px;
    background: ${({ theme }) => theme.b2b.teal};
    transform: translateY(-4px);
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.b2b.text2};
  }
`;

// Filas de ventajas: numeral en contorno, ícono, título, descripción y miniatura redondeada, separadas por líneas finas.
// Al pasar el cursor, un barrido morado recorre la fila, el numeral se llena, el ícono gira (flipInY) y la miniatura se acerca.
const Features = styled.ul<{ $visible: boolean }>`
  margin-top: ${({ theme }) => theme.space(14)};
  border-top: 1px solid ${({ theme }) => theme.b2b.line};
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
  grid-template-columns: 56px minmax(0, 1fr) 72px;
  grid-template-areas:
    "icon title thumb"
    "icon text thumb";
  column-gap: ${({ theme }) => theme.space(5)};
  row-gap: ${({ theme }) => theme.space(1)};
  align-items: center;
  padding: ${({ theme }) => `${theme.space(5)} ${theme.space(3)}`};
  border-bottom: 1px solid ${({ theme }) => theme.b2b.line};

  ${media.up("md")} {
    grid-template-columns: 72px 54px minmax(0, 1fr) minmax(0, 1.3fr) 104px;
    grid-template-areas: "num icon title text thumb";
    column-gap: ${({ theme }) => theme.space(6)};
    padding: ${({ theme }) => `${theme.space(5)} ${theme.space(5)}`};
  }

  /* Barrido morado que entra desde la izquierda. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(90deg, rgba(110, 60, 200, 0.4), rgba(110, 60, 200, 0.08));
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
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(160, 123, 240, 0.7);
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
    color: ${({ theme }) => theme.b2b.text};
    -webkit-text-stroke-color: ${({ theme }) => theme.b2b.text};
  }

  .icon {
    ${iconTile}
    grid-area: icon;
    width: 54px;
    height: 54px;
    border-radius: 14px;
  }

  .icon img {
    width: 24px;
    height: 24px;
  }

  &:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  h3 {
    grid-area: title;
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
    color: ${({ theme }) => theme.b2b.text};
  }

  p {
    grid-area: text;
    font-size: 1rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.b2b.text2};
  }

  .thumb {
    grid-area: thumb;
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 14px;
    filter: saturate(0.85) brightness(0.9);
    transition:
      filter 0.5s ease,
      transform 0.5s ${({ theme }) => theme.motion.easing};

    ${media.up("md")} {
      width: 100px;
      height: 100px;
    }
  }

  &:hover .thumb {
    filter: none;
    transform: scale(1.08) rotate(-3deg);
  }
`;

const Award = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14.5-1.5 7 5-2.5 5 2.5-1.5-7" />
  </svg>
);

// Resalta la frase final del título ("No al revés.") con el degradado de palabra clave.
const emphasizeLastSentence = (title: string) => {
  const i = title.lastIndexOf(". ");
  return i < 0 ? (
    title
  ) : (
    <>
      {title.slice(0, i + 2)}
      <em>{title.slice(i + 2)}</em>
    </>
  );
};

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
              <div className="orb" aria-hidden="true">
                <Plexus kind="globe" options={GLOBE} />
              </div>
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
              <h2 id="adaptive-title">{emphasizeLastSentence(adaptiveTraining.title)}</h2>
              <p className="lead">{adaptiveTraining.lead}</p>
              <ButtonLink to={siteConfig.advisoryUrl ?? "#contacto"} variant="gradient" arrow="right">
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
              <img className="thumb" src={thumbs[i % thumbs.length]} alt="" aria-hidden="true" width={100} height={100} loading="lazy" />
            </Feature>
          ))}
        </Features>
      </Container>
    </Block>
  );
};
