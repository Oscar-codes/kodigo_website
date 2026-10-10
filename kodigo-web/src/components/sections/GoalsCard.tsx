import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { media } from "@/styles/theme";
import { ArrowUpRight, Compass, Sparkles, TrendUp, Users } from "../ui/Icons";

// "Encuentra tu punto de partida": tarjeta flotante que aparece en el carrusel del Hero (solo en
// ≥ md). Estilo: cabecera tipo macOS (3 puntos + breadcrumb) + 4 rutas horizontales + tarjeta
// flotante "Tu siguiente paso" abajo-izquierda con CTA a "Ver opciones".

interface Goal {
  icon: ReactNode;
  title: string;
  text: string;
  to: string;
  highlighted?: boolean;
}

// Las rutas y destacados alinean con la sección `GoalPaths`. La última opción queda activa por defecto
// (estilo Eduhall) para anclar el "B2B Kodigo" del resto de la página.
const goals: Goal[] = [
  {
    icon: <Compass size={20} />,
    title: "Iniciar en tecnología",
    text: "Tu primer paso en el mundo tech.",
    to: "/bootcamps",
  },
  {
    icon: <TrendUp size={20} />,
    title: "Potenciar mi carrera",
    text: "Sube de nivel con nuevas habilidades.",
    to: "/bootcamps",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Aplicar inteligencia artificial",
    text: "Lleva la IA a tu trabajo.",
    to: "/bootcamps",
  },
  {
    icon: <Users size={20} />,
    title: "Capacitar a mi equipo",
    text: "Formación estratégica para tu organización.",
    to: "/profesional/alianzas",
    highlighted: true,
  },
];

// === WRAPPER: agrupa el panel + la mini-card flotante y los posiciona juntos sobre el slide ===
const Wrapper = styled.div`
  /* Móvil: ancho fijo (sin "100%"), protegido del slide flex y centrado. */
  box-sizing: border-box;
  width: 380px;
  max-width: 100%;
  margin: ${({ theme }) => `${theme.space(6)} auto 0`};
  align-self: center;
  flex: 0 0 auto;

  /* Tablet en adelante: flotante a la derecha, centrada verticalmente. */
  ${media.up("md")} {
    position: absolute;
    top: 50%;
    right: ${({ theme }) => theme.space(6)};
    transform: translateY(-50%);
    width: 400px;
    max-width: none;
    margin: 0;

    @media (prefers-reduced-motion: no-preference) {
      animation: cardWrapIn 700ms ${({ theme }) => theme.motion.easing} both;
    }

    @keyframes cardWrapIn {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(-50%); }
    }
  }

  ${media.up("lg")} {
    right: ${({ theme }) => theme.space(10)};
  }
`;

// === PANEL PRINCIPAL ===
const Panel = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(80% 80% at 100% 0%, rgba(75, 74, 241, 0.35), transparent 65%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.navyMid} 100%);
  border: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
  box-shadow: ${({ theme }) => theme.shadows.lift};
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

// Sello "Kodigo" violeta con el monigote '</>'. Flota sobre la esquina superior derecha del panel
// replicando el badge oficial del proyecto en Hero, Methodology, etc.
const CodeMark = styled.span`
  position: absolute;
  top: -1.25rem;
  right: -0.75rem;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  transform: rotate(8deg);
  box-shadow:
    0 14px 32px rgba(75, 74, 241, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  pointer-events: none;

  ${media.up("md")} {
    top: -1.75rem;
    right: -1.5rem;
    width: 88px;
    height: 88px;
    border-radius: 22px;
  }

  > svg {
    width: 60%;
    height: 60%;
  }
`;

// === BARRA TIPO MACOS (3 puntos + breadcrumb) ===
const WindowBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(5)}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
  background: rgba(255, 255, 255, 0.03);

  .dots {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green { background: #28c840; }

  .crumb {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.onNavy};
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
  }

  .crumb strong {
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

// === CONTENIDO ===
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(6)} ${theme.space(6)}`};
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: ${({ theme }) => `0 ${theme.space(3)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.lilac};
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  height: 26px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.weights.bold};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: -0.005em;

  ${media.up("md")} {
    font-size: 1.625rem;
  }
`;

const Sub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.onNavy};
  line-height: 1.4;
`;

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(2)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li<{ $active?: boolean }>`
  a {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) 18px;
    align-items: center;
    gap: ${({ theme }) => theme.space(3)};
    padding: ${({ theme }) => theme.space(3)};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid
      ${({ $active, theme }) => ($active ? theme.colors.main : theme.colors.borderOnNavy)};
    background: ${({ $active }) =>
      $active ? "rgba(75, 74, 241, 0.18)" : "rgba(255, 255, 255, 0.04)"};
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    min-height: 56px;
    transition:
      background-color ${({ theme }) => theme.motion.duration.hover} linear,
      border-color ${({ theme }) => theme.motion.duration.hover} linear,
      transform ${({ theme }) => theme.motion.duration.hover} ease;
  }

  a:hover {
    background: rgba(75, 74, 241, 0.22);
    border-color: ${({ theme }) => theme.colors.main};
    transform: translateX(2px);
  }

  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.lilac)};
    background: ${({ $active }) =>
      $active ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.06)"};
  }

  .body {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    gap: 2px;
    min-width: 0;
  }

  .title {
    font-size: 0.9375rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.onNavy};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrow {
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.lilac)};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Suggestion = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space(2)};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.onNavy};

  strong {
    color: ${({ theme }) => theme.colors.main};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

// === MINI-CARD FLOTANTE "TU SIGUIENTE PASO" ===
const MiniCard = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.float};
  color: ${({ theme }) => theme.colors.heading};
  margin-top: ${({ theme }) => theme.space(4)};

  ${media.up("md")} {
    position: absolute;
    left: -2rem;
    bottom: -1.75rem;
    margin-top: 0;
    width: clamp(320px, 75%, 420px);
    flex-wrap: nowrap;
    padding: ${({ theme }) => `${theme.space(4)} ${theme.space(5)}`};
  }

  ${media.up("lg")} {
    left: -3rem;
  }

  .note {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(3)};
    flex: 1 1 auto;
    min-width: 0;
  }

  .note .dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.main50};
    color: ${({ theme }) => theme.colors.main};
    flex: none;
  }

  .note .text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    min-width: 0;
  }

  .note strong {
    font-size: 0.8125rem;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.heading};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .note span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const CtaMini = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  height: 44px;
  padding: ${({ theme }) => `0 ${theme.space(5)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  text-decoration: none;
  flex: none;
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.mainHover};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

interface Props {
  /** Indica la opción a destacar (key del array). Si no, la última opción marcada `highlighted`. */
  highlightIndex?: number;
}

export const GoalsCard = ({ highlightIndex }: Props) => {
  // Si pasan highlightIndex, úsalo; si no, usa el primer `highlighted:true` del array.
  const activeIdx = highlightIndex ?? Math.max(
    0,
    goals.findIndex((g) => g.highlighted),
  );

  return (
    <Wrapper aria-labelledby="goals-card-title">
      <Panel>
        <CodeMark aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 8 4 12 9 16" />
            <polyline points="15 8 20 12 15 16" />
          </svg>
        </CodeMark>
        <WindowBar aria-hidden="true">
          <span className="dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </span>
          <span className="crumb">
            tu_ruta <span aria-hidden="true">/</span> <strong>kodigo</strong>
          </span>
          <span aria-hidden="true" style={{ width: 60 }} />
        </WindowBar>

        <Body>
          <Head>
            <Eyebrow>Encuentra tu punto de partida</Eyebrow>
            <Title id="goals-card-title">¿Qué quieres lograr?</Title>
            <Sub>Selecciona tu objetivo y descubre por dónde empezar.</Sub>
          </Head>

          <List>
            {goals.map((g, i) => (
              <Row key={g.title} $active={i === activeIdx}>
                <Link to={g.to} aria-label={`${g.title}: ${g.text}`}>
                  <span className="icon" aria-hidden="true">
                    {g.icon}
                  </span>
                  <span className="body">
                    <span className="title">{g.title}</span>
                    <span className="text">{g.text}</span>
                  </span>
                  <span className="arrow" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </Row>
            ))}
          </List>

          <Suggestion>
            <span>Ruta sugerida:</span>
            <strong>{goals[activeIdx].title}</strong>
          </Suggestion>
        </Body>
      </Panel>

      <MiniCard role="complementary" aria-label="Tu siguiente paso en Kodigo">
        <div className="note">
          <span className="dot" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <span className="text">
            <strong>Tu siguiente paso comienza aquí.</strong>
            <span>Te guiamos según tu meta.</span>
          </span>
        </div>
        <CtaMini to="/bootcamps" aria-label="Ver todas las opciones de Kodigo">
          Ver opciones
          <ArrowUpRight size={16} />
        </CtaMini>
      </MiniCard>
    </Wrapper>
  );
};
