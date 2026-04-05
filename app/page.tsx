import { ContributionsSection } from "@/components/contributions-section";
import { CtaSection } from "@/components/cta-section";
import { ExperienceSection } from "@/components/experience-section";
import { IntroSection } from "@/components/intro-section";
import { SpotifyCard } from "@/components/spotify-card";
import { SwarmCard } from "@/components/swarm-card";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <SwarmCard />
      <SpotifyCard />
      <ExperienceSection />
      <ContributionsSection />
      <CtaSection />
    </>
  );
}
