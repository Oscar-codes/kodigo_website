import styled, { css } from "styled-components";
import contenido from "@/assets/icons/contenido.png";
import horarios from "@/assets/icons/horarios.png";
import modalidad from "@/assets/icons/modalidad.png";
import ritmo from "@/assets/icons/ritmo.png";
import card3 from "@/assets/aivent/card-3.webp";
import card4 from "@/assets/aivent/card-4.webp";
import card5 from "@/assets/aivent/card-5.webp";
import card6 from "@/assets/aivent/card-6.webp";
import smallPhoto from "@/assets/photos/hero-768.webp";
import mainPhoto from "@/assets/photos/training.webp";
import { adaptiveTraining } from "@/data/alliances";
import { siteConfig } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import { bounceIn, bounceInDown, bounceInUp, flipInY, upDown } from "@/styles/effects";
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
const Block = styled(Section)`
  background: ${({ theme }) => theme.colors.aiventDark};
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

  .dots {
    position: absolute;
    top: -24px;
    left: -24px;
    width: 120px;
    height: 120px;
    background: radial-gradient(${({ theme }) => theme.colors.main} 1.6px, transparent 2px) 0 0 / 16px 16px;
    opacity: 0.35;
    z-index: -1;
  }

  .main {
    display: block;
    width: 100%;
    aspect-ratio: 9 / 10;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.xl};
    box-shadow: ${({ theme }) => theme.shadows.lift};
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

// Tarjetas "What You'll Gain" de AIvent: imagen a todo el cuadro con degradado inferior, texto superpuesto y, al pasar el
// cursor, zoom de la imagen y resplandor violeta radial. El icono gira (flipInY) como en el resto de la página.
const Features = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
  margin-top: ${({ theme }) => theme.space(16)};

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Feature = styled(Reveal)`
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-height: 340px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.aiventDark2};

  .bg {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ${({ theme }) => theme.motion.easing};
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(0deg, rgba(16, 20, 53, 0.96) 0%, rgba(16, 20, 53, 0.78) 45%, rgba(16, 20, 53, 0.1) 100%);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0;
    background: radial-gradient(circle, rgba(118, 77, 240, 0) 50%, rgba(118, 77, 240, 0.95) 100%);
    transition: opacity ${({ theme }) => theme.motion.duration.base} ease;
  }

  &:hover .bg {
    transform: scale(1.08);
  }

  &:hover::after {
    opacity: 1;
  }

  &:hover .icon {
    animation: ${flipInY} 1s ease-in-out;
  }

  .content {
    padding: ${({ theme }) => theme.space(6)};
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: ${({ theme }) => theme.space(4)};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.aiventViolet};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 1.1875rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.white};
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
  const { badge } = adaptiveTraining;
  return (
    <Block aria-labelledby="adaptive-title">
      <Container>
        <Layout>
          <Reveal direction="right">
            <Collage ref={ref} $visible={visible}>
              <span className="dots" aria-hidden="true" />
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
        <Features>
          {adaptiveTraining.features.map((f, i) => (
            <Feature key={f.title} tag="li" index={i} direction="up">
              <img className="bg" src={cardImages[i % cardImages.length]} alt="" width={800} height={800} loading="lazy" />
              <div className="content">
                <div className="icon">
                  <img src={icons[f.icon]} alt="" width={24} height={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Feature>
          ))}
        </Features>
      </Container>
    </Block>
  );
};
