import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Partner } from "@/data/content";
import { institutionNames } from "@/data/partnerGroups";
import { useInView } from "@/hooks/useInView";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { ArrowUpRight } from "../ui/Icons";

// "Clientes": red de aliados estratégicos en un panel oscuro con dos filas por categoría (centros educativos e instituciones,
// y empresas): etiqueta con línea de acento a la izquierda y, a la derecha, una frase y los logos en celdas con filo fino.
// Los logos son para fondo claro, así que van en teselas blancas dentro de cada celda.

const ALLIANCES_URL = "/profesional/alianzas";

const Wrap = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;
`;

const Panel = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
  border-radius: ${({ theme }) => theme.radii.xl};
  color: ${({ theme }) => theme.colors.onNavy};
  background:
    radial-gradient(55% 60% at 100% 0%, rgba(117, 87, 250, 0.35), transparent 70%),
    radial-gradient(45% 50% at 0% 100%, rgba(175, 148, 248, 0.16), transparent 70%),
    linear-gradient(160deg, ${({ theme }) => theme.colors.navy} 0%, ${({ theme }) => theme.colors.navyMid} 100%);
  box-shadow: ${({ theme }) => theme.shadows.lift};
`;

const Intro = styled.div`
  padding: ${({ theme }) => `${theme.space(10)} ${theme.space(5)}`};

  ${media.up("md")} {
    padding: ${({ theme }) => `${theme.space(14)} ${theme.space(10)} ${theme.space(12)}`};
  }

  .eyebrow {
    display: block;
    margin-bottom: ${({ theme }) => theme.space(4)};
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentOnDark};
  }

  h2 {
    max-width: 24ch;
    font-size: clamp(2rem, 1.2rem + 3.2vw, 3.75rem);
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.05;
    color: ${({ theme }) => theme.colors.white};
  }

  h2 em {
    display: block;
    font-style: normal;
    background-image: linear-gradient(180deg, #c7b0ff 0%, #adf3e6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .line {
    display: block;
    width: 48px;
    height: 3px;
    margin: ${({ theme }) => `${theme.space(6)} 0`};
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.yellow};
  }

  p {
    max-width: 56ch;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.onNavy};
  }
`;

const Row = styled.div`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.borderOnNavy};

  ${media.up("md")} {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .side {
    padding: ${({ theme }) => `${theme.space(6)} ${theme.space(5)} ${theme.space(2)}`};

    ${media.up("md")} {
      padding: ${({ theme }) => `${theme.space(10)} ${theme.space(8)}`};
    }
  }

  .kicker {
    display: block;
    font-size: 0.75rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    letter-spacing: 0.18em;
    line-height: 1.7;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.onNavy};
  }

  .rule {
    display: block;
    width: 28px;
    height: 2px;
    margin-top: ${({ theme }) => theme.space(3)};
    background: ${({ theme }) => theme.colors.yellow};
  }

  .body {
    min-width: 0;
    padding: ${({ theme }) => `${theme.space(3)} ${theme.space(5)} ${theme.space(8)}`};

    ${media.up("md")} {
      padding: ${({ theme }) => `${theme.space(10)} ${theme.space(8)}`};
      border-left: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
    }
  }

  .blurb {
    max-width: 62ch;
    margin-bottom: ${({ theme }) => theme.space(6)};
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Cells = styled.ul<{ $visible: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
  border-left: 1px solid ${({ theme }) => theme.colors.borderOnNavy};

  ${media.up("sm")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  ${media.up("xl")} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  > li {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.space(3)};
    border-right: 1px solid ${({ theme }) => theme.colors.borderOnNavy};
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderOnNavy};

    @media (prefers-reduced-motion: no-preference) {
      opacity: ${({ $visible }) => ($visible ? 1 : 0)};
      transform: ${({ $visible }) => ($visible ? "none" : "translateY(14px)")};
      transition:
        opacity 0.55s ease calc(var(--i, 0) * 30ms),
        transform 0.55s ${({ theme }) => theme.motion.easing} calc(var(--i, 0) * 30ms);
    }
  }

  > li > a {
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;

const Tile = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 168px;
  height: 76px;
  padding: ${({ theme }) => `${theme.space(2.5)} ${theme.space(4)}`};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.weights.semibold};
  text-align: center;
  transition:
    transform ${({ theme }) => theme.motion.duration.hover} ease,
    box-shadow ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(117, 87, 250, 0.45);
  }

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

const PartnerCell = ({ partner, index }: { partner: Partner; index: number }) => {
  const inner = (
    <Tile>
      {partner.logo ? (
        <img src={partner.logo} alt={partner.name} width={partner.width} height={partner.height} loading="lazy" decoding="async" />
      ) : (
        partner.name
      )}
    </Tile>
  );
  return (
    <li style={{ "--i": Math.min(index, 24) } as CSSProperties}>
      {partner.url ? (
        <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (abre en una pestaña nueva)`}>
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
};

const FootRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(5)};
  margin-top: ${({ theme }) => theme.space(10)};
`;

const CtaSecondaryAlt = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 48px;
  padding: ${({ theme }) => `0 ${theme.space(6)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.accentOnLight};
  font-weight: ${({ theme }) => theme.weights.semibold};
  transition:
    background-color ${({ theme }) => theme.motion.duration.hover} linear,
    border-color ${({ theme }) => theme.motion.duration.hover} linear,
    transform ${({ theme }) => theme.motion.duration.hover} ease;

  &:hover {
    background: ${({ theme }) => theme.colors.main50};
    border-color: ${({ theme }) => theme.colors.accentOnLight};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.yellow};
    outline-offset: 3px;
  }
`;

interface AlliesProps {
  items: Partner[];
}

interface GroupProps {
  kicker: string;
  blurb: string;
  label: string;
  partners: Partner[];
}

const Group = ({ kicker, blurb, label, partners }: GroupProps) => {
  const [ref, visible] = useInView<HTMLUListElement>("0px 0px 120px 0px");
  if (!partners.length) return null;
  return (
    <Row>
      <div className="side">
        <span className="kicker">{kicker}</span>
        <span className="rule" aria-hidden="true" />
      </div>
      <div className="body">
        <p className="blurb">{blurb}</p>
        <Cells ref={ref} $visible={visible} aria-label={label}>
          {partners.map((p, i) => (
            <PartnerCell key={p.name} partner={p} index={i} />
          ))}
        </Cells>
      </div>
    </Row>
  );
};

export const Allies = ({ items }: AlliesProps) => {
  const institutions = items.filter((p) => institutionNames.includes(p.name));
  const companies = items.filter((p) => !institutionNames.includes(p.name));

  return (
    <Wrap aria-labelledby="allies-title">
      <Container>
        <Panel>
          <Intro>
            <span className="eyebrow">Clientes</span>
            <h2 id="allies-title">
              Formamos parte de una red de <em>aliados estratégicos.</em>
            </h2>
            <span className="line" aria-hidden="true" />
            <p>
              Con centros educativos apoyamos la formación de talento; con empresas formamos y empleamos según sus necesidades de contratación.
            </p>
          </Intro>

          <Group
            kicker="Centros educativos e instituciones"
            blurb="Apoyamos la formación junto a centros educativos e instituciones."
            label="Centros educativos e instituciones aliadas"
            partners={institutions}
          />
          <Group
            kicker="Empresas que confían en Kodigo"
            blurb="Formamos y empleamos talento en base a las necesidades de contratación de cada empresa."
            label="Empresas aliadas"
            partners={companies}
          />
        </Panel>

        <FootRow>
          <CtaSecondaryAlt to={ALLIANCES_URL} aria-label="Ver el directorio completo de aliados">
            Ver todos los aliados
            <ArrowUpRight size={18} />
          </CtaSecondaryAlt>
        </FootRow>
      </Container>
    </Wrap>
  );
};
