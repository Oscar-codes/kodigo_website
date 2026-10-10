import { AboutContent } from "@/components/sections/AboutContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { Stats } from "@/components/sections/Stats";
import { content } from "@/data/content";
import { siteConfig } from "@/data/site";
import { usePageMeta } from "@/hooks/usePageMeta";

export const AboutPage = () => {
  usePageMeta({ title: "Nosotros", description: siteConfig.tagline });
  return (
    <>
      <PageHeader title="Nosotros" lead={siteConfig.tagline} />
      {content.about ? <AboutContent about={content.about} /> : null}
      {content.stats?.length ? <Stats items={content.stats} /> : null}
    </>
  );
};
