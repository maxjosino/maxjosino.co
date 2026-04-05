import { ContributionsSection } from "@/components/contributions-section";
import { CtaSection } from "@/components/cta-section";
import { ExperienceSection } from "@/components/experience-section";
import { IntroSection } from "@/components/intro-section";
import { LocationCard } from "@/components/location-card";
import { SpotifyCard } from "@/components/spotify-card";
import { SwarmCard } from "@/components/swarm-card";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <LocationCard />
      <SwarmCard />
      <SpotifyCard />
      <ExperienceSection />
      <ContributionsSection />
      <CtaSection />
    </>
  );
}
