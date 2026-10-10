import { BootcampGrid } from "@/components/sections/BootcampGrid";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container, Section } from "@/components/ui/Container";
import { bootcamps } from "@/data/bootcamps";
import { usePageMeta } from "@/hooks/usePageMeta";

export const BootcampsPage = () => {
  usePageMeta({ title: "Bootcamps", description: "Programas de formación en IA, datos y desarrollo." });
  return (
  <>
    <PageHeader
      title="Bootcamps"
      lead="Programas de formación en IA, datos y desarrollo."
      crumbs={[{ label: "Inicio", to: "/" }, { label: "Bootcamps" }]}
    />
    <Section style={{ paddingTop: 0 }}>
      <Container>
        <BootcampGrid items={bootcamps} />
      </Container>
    </Section>
  </>
  );
};
