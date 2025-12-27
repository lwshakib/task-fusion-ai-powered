import FooterSection from "@/components/footer";
import Pricing from "@/components/pricing";
import HeroSection from "@/components/hero-section";
import { FeaturesSection } from "@/components/features";
import { SolutionSection } from "@/components/solution";
import { AboutSection } from "@/components/about";

export default function Home() {
  return (
    <div className="min-h-screen w-full selection:bg-primary/10">
      <div id="home">
        <HeroSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="solution">
        <SolutionSection />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <FooterSection />
    </div>
  );
}
