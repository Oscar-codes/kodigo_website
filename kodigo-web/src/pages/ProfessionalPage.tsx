import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { AdaptiveTraining } from "@/components/sections/AdaptiveTraining";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { AlliancesHero } from "@/components/sections/AlliancesHero";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { PageHeader } from "@/components/sections/PageHeader";
import { Partners } from "@/components/sections/Partners";
import { TeamBlock } from "@/components/sections/TeamBlock";
import { UpcomingWorkshops } from "@/components/sections/UpcomingWorkshops";
import { Workshop } from "@/components/sections/Workshop";
import { Card } from "@/components/ui/Card";
import { Container, Section } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { content } from "@/data/content";
import { professionalSections } from "@/data/professional";
import { usePageMeta } from "@/hooks/usePageMeta";
import { media } from "@/styles/theme";
import { NotFoundPage } from "./NotFoundPage";

const Cards = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(6)};

  ${media.up("md")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SectionCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  height: 100%;

  h2 {
    font-size: ${({ theme }) => theme.type.h3};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  h2 a::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  .more {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space(1)};
    margin-top: auto;
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.main};
  }
`;

export const ProfessionalPage = () => {
  const { slug } = useParams();
  const section = professionalSections.find((s) => s.slug === slug);
  usePageMeta(
    section?.slug === "alianzas"
      ? { title: "Alianzas", description: "Kodigo para empresas: entrenamos a tus equipos para aplicar IA en procesos y necesidades reales." }
      : !slug
      ? { title: "Profesional" }
      : section
        ? { title: section.title, description: section.lead }
        : { title: "Página no encontrada", noindex: true },
  );

  if (!slug) {
    return (
      <>
        <PageHeader title="Profesional" crumbs={[{ label: "Inicio", to: "/" }, { label: "Profesional" }]} />
        <Section style={{ paddingTop: 0 }}>
          <Container>
            <Cards>
              {professionalSections.map((s) => (
                <li key={s.slug}>
                  <SectionCard>
                    <h2>
                      <Link to={`/profesional/${s.slug}`}>{s.title}</Link>
                    </h2>
                    {s.lead && <p>{s.lead}</p>}
                    <span className="more" aria-hidden="true">
                      Ver más <ArrowRight />
                    </span>
                  </SectionCard>
                </li>
              ))}
            </Cards>
          </Container>
        </Section>
      </>
    );
  }

  if (!section) return <NotFoundPage />;

  // Alianzas = "Kodigo para empresas": banner, cifras de impacto, workshop con formulario y, al final, los aliados.
  if (section.slug === "alianzas") {
    return (
      <>
        <AlliancesHero />
        <ImpactStats />
        <Workshop />
        <UpcomingWorkshops />
        <CaseStudies />
        <AdaptiveTraining />
        <TeamBlock />
        {content.partners?.length ? <Partners items={content.partners} variant="grid" /> : null}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={section.title}
        lead={section.lead}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Profesional", to: "/profesional" }, { label: section.title }]}
      />
      {section.showPartners && content.partners?.length ? <Partners items={content.partners} variant="grid" flushTop /> : null}
    </>
  );
};
