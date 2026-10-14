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

// Bloque "Our Popular Tutors" de Eduhall: título centrado con rebote y cuatro tarjetas de persona (foto, nombre, cargo y
// enlace). Efectos de la plantilla: entradas escalonadas (AOS), zoom ×1.1 de la foto al pasar el cursor (course-item),
// borde violeta y sombra al hover (transition-2) y la flecha del botón que se desplaza.
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
  background: ${({ theme }) => theme.colors.aiventDark};
`;

// Tarjetas de "Speakers" de AIvent: foto a todo el cuadro, caption de vidrio esmerilado abajo y, al pasar el cursor,
// zoom de la foto y resplandor violeta radial en los bordes.
const Member = styled.article`
  position: relative;
  isolation: isolate;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.aiventDark2};

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
    background: radial-gradient(circle, rgba(118, 77, 240, 0) 50%, rgba(118, 77, 240, 1) 100%);
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
    background: linear-gradient(0deg, rgba(16, 20, 53, 0.85) 0%, rgba(16, 20, 53, 0) 100%);
  }

  .caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space(1)};
    margin: ${({ theme }) => theme.space(4)};
    padding: ${({ theme }) => theme.space(4)};
    border-radius: ${({ theme }) => theme.radii.sm};
    text-align: center;
    color: ${({ theme }) => theme.colors.white};
    background: rgba(0, 0, 0, 0.18);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  h3 {
    font-size: 1.1875rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.white};
  }

  .role {
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 0.875rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.white};
  }
`;

// Botón de perfil: píldora clara con borde que se rellena al pasar el cursor. Sin URL se muestra deshabilitado.
const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.white};
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.navy};
  }

  &:not([href]) {
    border-color: rgba(255, 255, 255, 0.35);
    color: rgba(255, 255, 255, 0.75);
    cursor: not-allowed;
  }

  &:not([href]):hover {
    background: transparent;
    color: rgba(255, 255, 255, 0.75);
  }
`;

export const TeamBlock = () => (
  <Block aria-labelledby="team-title">
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
