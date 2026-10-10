import styled from "styled-components";
import type { Bootcamp } from "@/data/bootcamps";
import { media } from "@/styles/theme";
import { ButtonLink } from "../ui/Button";

// Detalle al estilo "course details" de Eduhall: contenido a la izquierda y tarjeta lateral con los datos y la acción.
const Layout = styled.div<{ $withAside: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.space(10)};

  ${media.up("lg")} {
    grid-template-columns: ${({ $withAside }) => ($withAside ? "minmax(0, 1fr) 360px" : "minmax(0, 1fr)")};
    align-items: start;
  }
`;

// En móvil el panel va primero para que "Inscribirme" sea visible sin recorrer el temario.
const Aside = styled.aside`
  order: -1;
  padding: ${({ theme }) => theme.space(6)};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.float};

  ${media.up("lg")} {
    order: 2;
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.space(6)});
  }

  h2 {
    font-size: 1.25rem;
    margin-bottom: ${({ theme }) => theme.space(4)};
  }

  dl {
    margin-bottom: ${({ theme }) => theme.space(6)};
  }

  dl > div {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space(4)};
    padding-block: ${({ theme }) => theme.space(3)};
    border-bottom: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  }

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 0;
    text-align: right;
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.colors.heading};
  }

  a {
    width: 100%;
  }
`;

const Body = styled.div`
  min-width: 0;
`;

const Block = styled.section`
  margin-bottom: ${({ theme }) => theme.space(12)};

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    margin-bottom: ${({ theme }) => theme.space(6)};
  }
`;

const Modules = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space(4)};
  padding: 0;
  list-style: none;
  counter-reset: module;

  > li {
    counter-increment: module;
    padding: ${({ theme }) => theme.space(5)} ${({ theme }) => theme.space(6)};
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }

  h3 {
    font-size: ${({ theme }) => theme.type.h3};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  h3::before {
    content: counter(module) ". ";
    color: ${({ theme }) => theme.colors.main};
  }

  ul {
    margin-top: ${({ theme }) => theme.space(3)};
    padding-left: ${({ theme }) => theme.space(5)};
    list-style: disc;
  }

  ul li::marker {
    color: ${({ theme }) => theme.colors.main};
  }
`;

const Requirements = styled.ul`
  padding-left: ${({ theme }) => theme.space(5)};
  list-style: disc;

  li::marker {
    color: ${({ theme }) => theme.colors.main};
  }
`;

const Pending = styled.p`
  padding: ${({ theme }) => theme.space(6)};
  border: 1px dashed ${({ theme }) => theme.colors.main200};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

interface BootcampInfoProps {
  bootcamp: Bootcamp;
  /** Destino de inscripción ya resuelto (programa o global). Sin valor, no hay botón. */
  enrollmentUrl?: string;
}

export const BootcampInfo = ({ bootcamp, enrollmentUrl }: BootcampInfoProps) => {
  const facts = [
    { label: "Duración", value: bootcamp.duration },
    { label: "Modalidad", value: bootcamp.modality },
    { label: "Nivel", value: bootcamp.level },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));
  const hasSyllabus = Boolean(bootcamp.syllabus?.length);
  const hasRequirements = Boolean(bootcamp.requirements?.length);
  const hasAside = facts.length > 0 || Boolean(enrollmentUrl);

  return (
    <Layout $withAside={hasAside}>
      {hasAside && (
        <Aside aria-labelledby="aside-title">
          <h2 id="aside-title">Datos del programa</h2>
          {facts.length > 0 && (
            <dl>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {enrollmentUrl && (
            <ButtonLink to={enrollmentUrl} arrow>
              Inscribirme
            </ButtonLink>
          )}
        </Aside>
      )}

      <Body>
        {hasSyllabus && (
          <Block aria-labelledby="syllabus-title">
            <h2 id="syllabus-title">Temario</h2>
            <Modules>
              {bootcamp.syllabus!.map((m) => (
                <li key={m.title}>
                  <h3>{m.title}</h3>
                  {m.topics && m.topics.length > 0 && (
                    <ul>
                      {m.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </Modules>
          </Block>
        )}

        {hasRequirements && (
          <Block aria-labelledby="requirements-title">
            <h2 id="requirements-title">Requisitos</h2>
            <Requirements>
              {bootcamp.requirements!.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </Requirements>
          </Block>
        )}

        {!hasSyllabus && !hasRequirements && !hasAside && (
          <Pending>El temario, la duración y los requisitos de este programa se publicarán próximamente.</Pending>
        )}
      </Body>
    </Layout>
  );
};
