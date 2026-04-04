import { ContributionsSection } from "@/components/contributions-section";
import { CtaSection } from "@/components/cta-section";
import { ExperienceSection } from "@/components/experience-section";
import { IntroSection } from "@/components/intro-section";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <ExperienceSection />
      <ContributionsSection />
      <CtaSection />
    </>
  );
}
