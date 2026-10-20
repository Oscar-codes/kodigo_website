import styled from "styled-components";
import { team } from "@/data/alliances";
import { media } from "@/styles/theme";
import { Container, Section } from "../ui/Container";
import { LinkedIn } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

// Retratos del equipo: se importan por nombre de archivo (generados por `npm run assets:build`).
const photos = import.meta.glob<string>("../../assets/team/*.webp", { eager: true, query: "?url", import: "default" });
const photoOf = (slug: string) => photos[`../../assets/team/${slug}.webp`];

// Equipo de la landing B2B: título centrado y cuatro tarjetas de persona (foto, nombre, cargo y enlace a LinkedIn).
// Efectos: entradas escalonadas, zoom de la foto y resplandor morado al pasar el cursor.
const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Block = styled(Section)`
  padding-block: ${({ theme }) => theme.section.dense};
`;

// Tarjeta de persona: foto a todo el cuadro, caption de vidrio esmerilado abajo y, al pasar el cursor, zoom de la foto y
// resplandor morado radial en los bordes.
const Member = styled.article`
  position: relative;
  isolation: isolate;
  height: 100%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.b2b.cardBorder};
  border-radius: 20px;
  background: ${({ theme }) => theme.b2b.bg2};

  .photo img {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center 15%;

    ${media.up("md")} {
      aspect-ratio: 4 / 5;
      object-position: center;
    }
    transition: transform 0.6s ${({ theme }) => theme.motion.easing};
  }

  &:hover .photo img {
    transform: scale(1.08);
  }

  .glow {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    background: radial-gradient(circle, rgba(110, 60, 200, 0) 50%, rgba(110, 60, 200, 0.95) 100%);
    transition: opacity ${({ theme }) => theme.motion.duration.base} ease;
  }

  &:hover .glow,
  &:focus-within .glow {
    opacity: 1;
  }

  .caption-wrap {
    position: absolute;
    inset: auto 0 0;
    z-index: 2;
    padding-top: ${({ theme }) => theme.space(16)};
    background: linear-gradient(0deg, rgba(26, 15, 69, 0.92) 0%, rgba(26, 15, 69, 0) 100%);
  }

  .caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space(1)};
    margin: ${({ theme }) => theme.space(3)};
    padding: ${({ theme }) => theme.space(3)};
    border: 1px solid rgba(196, 181, 245, 0.18);
    border-radius: ${({ theme }) => theme.radii.md};
    text-align: center;
    color: ${({ theme }) => theme.b2b.text};
    background: rgba(26, 15, 69, 0.45);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  h3 {
    font-size: 1.1875rem;
    font-weight: 800;
    line-height: 1.3;
    color: ${({ theme }) => theme.b2b.text};
  }

  .role {
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.875rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.b2b.text2};
  }
`;

// Botón de perfil: píldora clara con borde que se rellena al pasar el cursor. Sin URL se muestra deshabilitado.
const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: 8px 12px;
  border: 1px solid rgba(196, 181, 245, 0.55);
  border-radius: ${({ theme }) => theme.radii.pill};
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.b2b.text};
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: ${({ theme }) => theme.b2b.lavender};
    border-color: ${({ theme }) => theme.b2b.lavender};
    color: ${({ theme }) => theme.b2b.onGradient};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.b2b.teal};
    outline-offset: 2px;
  }

  &:not([href]) {
    border-color: rgba(196, 181, 245, 0.3);
    color: rgba(244, 242, 248, 0.7);
    cursor: not-allowed;
  }

  &:not([href]):hover {
    background: transparent;
    border-color: rgba(196, 181, 245, 0.3);
    color: rgba(244, 242, 248, 0.7);
  }
`;

export const TeamBlock = () => (
  <Block id="equipo" aria-labelledby="team-title">
    <Container>
      <SectionTitle id="team-title" tone="dark" label={team.label} title={team.title} lead={team.lead} />
      <Grid>
        {team.members.map((m, i) => (
          <Reveal key={m.name} tag="li" index={i} direction="up">
            <Member>
              <div className="photo">
                <img src={photoOf(m.photo)} alt={`Retrato de ${m.name}`} width={480} height={600} loading="lazy" />
              </div>
              <span className="glow" aria-hidden="true" />
              <div className="caption-wrap">
                <div className="caption">
                  <h3>{m.name}</h3>
                  <p className="role">{m.role}</p>
                <ProfileLink
                  {...(m.linkedin
                    ? { href: m.linkedin, target: "_blank", rel: "noopener noreferrer", "aria-label": `${team.linkedinCta}: ${m.name}` }
                    : { role: "link", "aria-disabled": true, "aria-label": `${team.linkedinCta}: ${m.name} (perfil no disponible aún)` })}
                >
                  <LinkedIn />
                  {team.linkedinCta}
                </ProfileLink>
                </div>
              </div>
            </Member>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Block>
);
