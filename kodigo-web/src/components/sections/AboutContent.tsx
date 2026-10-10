import styled from "styled-components";
import type { AboutContent as AboutData } from "@/data/content";
import { Container, Section } from "../ui/Container";
import { BookOpen } from "../ui/Icons";

const Body = styled.div`
  max-width: 68ch;
  margin-inline: auto;

  .label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(2)};
    margin-bottom: ${({ theme }) => theme.space(3)};
    font-size: 1.125rem;
    font-weight: ${({ theme }) => theme.weights.bold};
    color: ${({ theme }) => theme.colors.main};
  }

  h2 {
    font-size: ${({ theme }) => theme.type.h2};
    margin-bottom: ${({ theme }) => theme.space(5)};
  }

  p + p {
    margin-top: ${({ theme }) => theme.space(4)};
  }
`;

export const AboutContent = ({ about }: { about: AboutData }) => (
  <Section aria-labelledby="about-title" style={{ paddingTop: 0 }}>
    <Container>
      <Body>
        <span className="label">
          <BookOpen />
          Nosotros
        </span>
        <h2 id="about-title">{about.heading}</h2>
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Body>
    </Container>
  </Section>
);
