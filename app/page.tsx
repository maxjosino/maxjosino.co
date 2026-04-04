import { ContributionsSection } from "@/components/contributions-section";
import { CtaSection } from "@/components/cta-section";
import { ExperienceSection } from "@/components/experience-section";
import { IntroSection } from "@/components/intro-section";
import { SpotifyCard } from "@/components/spotify-card";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <SpotifyCard />
      <ExperienceSection />
      <ContributionsSection />
      <CtaSection />
    </>
  );
}
