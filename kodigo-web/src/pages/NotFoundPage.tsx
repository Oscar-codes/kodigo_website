import styled from "styled-components";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { usePageMeta } from "@/hooks/usePageMeta";

const Center = styled.div`
  text-align: center;
`;

export const NotFoundPage = () => {
  usePageMeta({ title: "Página no encontrada", noindex: true });
  return (
    <>
      <PageHeader title="Página no encontrada" lead="La dirección que buscas no existe." />
      <Section style={{ paddingTop: 0 }}>
        <Container>
          <Center>
            <ButtonLink to="/" arrow>
              Volver al inicio
            </ButtonLink>
          </Center>
        </Container>
      </Section>
    </>
  );
};
