import { Allies } from "@/components/sections/Allies";
import { Benefits } from "@/components/sections/Benefits";
import { BootcampShowcase } from "@/components/sections/BootcampShowcase";
import { CallToAction } from "@/components/sections/CallToAction";
import { CareerPath } from "@/components/sections/CareerPath";
import { Experience } from "@/components/sections/Experience";
import { Faq } from "@/components/sections/Faq";
import { GoalPaths } from "@/components/sections/GoalPaths";
import { Hero } from "@/components/sections/Hero";
import { Methodology } from "@/components/sections/Methodology";
import { Organizations } from "@/components/sections/Organizations";
import { Steps } from "@/components/sections/Steps";
import { Testimonials } from "@/components/sections/Testimonials";
import { bootcamps } from "@/data/bootcamps";
import { content } from "@/data/content";
import { usePageMeta } from "@/hooks/usePageMeta";

// Orden y color de fondo de las secciones de Inicio. Una sección blanca que sigue a otra blanca no repite el relleno
// superior (la anterior ya aporta el inferior); si la anterior es tintada, conserva su relleno completo.
type Tone = "white" | "surface";

export const HomePage = () => {
  usePageMeta();
const steps = content.steps?.length ? content.steps : undefined;
  const allies = content.partners?.length ? content.partners : undefined;
  const testimonials = content.testimonials?.length ? content.testimonials : undefined;
  const faq = content.faq?.length ? content.faq : undefined;

  // Organizations (panel navy) y Allies (panel tintado) son dos secciones distintas. La sección
  // FAQ trae preguntas internas para que la home page la muestre siempre (visualmente cierra la página
  // antes del CTA final).
  const shown: { id: string; tone: Tone; show: boolean }[] = [
    { id: "bootcamps", tone: "surface", show: true },
    { id: "experience", tone: "white", show: true },
    { id: "methodology", tone: "surface", show: true },
    { id: "careerPath", tone: "white", show: true },
    { id: "steps", tone: "surface", show: Boolean(steps) },
    { id: "testimonials", tone: "white", show: true },
    { id: "organizations", tone: "surface", show: true },
    { id: "allies", tone: "white", show: true },
    { id: "faq", tone: "surface", show: true },
    { id: "cta", tone: "white", show: true },
  ].filter((s) => s.show) as { id: string; tone: Tone; show: boolean }[];
  const flush = (id: string) => {
    const i = shown.findIndex((s) => s.id === id);
    return shown[i].tone === "white" && shown[i - 1]?.tone === "white";
  };

  return (
    <>
      <Hero />
      <Benefits />
      <GoalPaths />
      <BootcampShowcase items={bootcamps} />
      <Experience />
      <Methodology />
      <CareerPath />
      {/* Cada sección solo aparece si Kodigo entregó su contenido (ver src/data/content.ts). */}
      {steps ? <Steps items={steps} /> : null}
      {testimonials ? <Testimonials items={testimonials} /> : <Testimonials />}
      <Organizations />
      <Allies items={allies ?? []} />
      <Faq items={faq} flushTop={flush("faq")} />
      <CallToAction flushTop={flush("cta")} />
    </>
  );
};
