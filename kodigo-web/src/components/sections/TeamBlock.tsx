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

const Member = styled.article`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: border-color ${({ theme }) => theme.motion.duration.hover} linear,
    box-shadow ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    border-color: ${({ theme }) => theme.colors.main200};
    box-shadow: ${({ theme }) => theme.shadows.lift};
  }

  .photo {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface};
  }

  .photo img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.motion.duration.hover} linear;
  }

  &:hover .photo img {
    transform: scale(1.1);
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: ${({ theme }) => `${theme.space(5)} ${theme.space(3)} ${theme.space(3)}`};
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.space(2)};
    font-size: 1.25rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    line-height: 1.3;
  }

  .role {
    margin-bottom: ${({ theme }) => theme.space(5)};
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`;

// Botón de perfil: píldora con borde violeta que se rellena al pasar el cursor. Sin URL se muestra deshabilitado.
const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-top: auto;
  padding: 11px 20px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.main};
  transition: background-color ${({ theme }) => theme.motion.duration.hover} linear,
    color ${({ theme }) => theme.motion.duration.hover} linear;

  &:hover {
    background: ${({ theme }) => theme.colors.main};
    color: ${({ theme }) => theme.colors.white};
  }

  &:not([href]) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }

  &:not([href]):hover {
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const TeamBlock = () => (
  <Section aria-labelledby="team-title">
    <Container>
      <SectionTitle id="team-title" label={team.label} title={team.title} lead={team.lead} />
      <Grid>
        {team.members.map((m, i) => (
          <Reveal key={m.name} tag="li" index={i} direction="up">
            <Member>
              <div className="photo">
                <img src={photoOf(m.photo)} alt={`Retrato de ${m.name}`} width={480} height={600} loading="lazy" />
              </div>
              <div className="body">
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
            </Member>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);
