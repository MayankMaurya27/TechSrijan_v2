import { IntroVideo } from "@/components/effects/intro-video";
import { ScrollJourney } from "@/components/landing/scroll-journey";

export default function LandingPage() {
  return (
    <>
      {/* Intro Video Sequence (plays once per new tab, skips if no video provided) */}
      <IntroVideo src="/intro.mp4" />

      {/* Pure Full-Screen Scroll-Driven Cinematic Flight through Imperium Citadel */}
      <ScrollJourney />
    </>
  );
}

