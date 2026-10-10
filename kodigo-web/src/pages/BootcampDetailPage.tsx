import { useParams } from "react-router-dom";
import { BootcampInfo } from "@/components/sections/BootcampInfo";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container, Section } from "@/components/ui/Container";
import { findBootcamp } from "@/data/bootcamps";
import { usePageMeta } from "@/hooks/usePageMeta";
import { siteConfig } from "@/data/site";
import { NotFoundPage } from "./NotFoundPage";

export const BootcampDetailPage = () => {
  const { slug } = useParams();
  const bootcamp = findBootcamp(slug);
  // El padre fija el título también para el 404 (los efectos de los hijos corren antes que los del padre).
  usePageMeta(
    bootcamp
      ? { title: bootcamp.name, description: bootcamp.summary }
      : { title: "Página no encontrada", noindex: true },
  );

  if (!bootcamp) return <NotFoundPage />;

  return (
    <>
      <PageHeader
        title={bootcamp.name}
        lead={bootcamp.summary}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Bootcamps", to: "/bootcamps" }, { label: bootcamp.name }]}
      />
      <Section style={{ paddingTop: 0 }}>
        <Container>
          <BootcampInfo bootcamp={bootcamp} enrollmentUrl={bootcamp.enrollmentUrl ?? siteConfig.enrollmentUrl} />
        </Container>
      </Section>
    </>
  );
};
