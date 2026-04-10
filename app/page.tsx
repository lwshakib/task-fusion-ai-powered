import FooterSection from '@/components/marketing/footer';
import Pricing from '@/components/marketing/pricing';
import HeroSection from '@/components/marketing/hero-section';
import { FeaturesSection } from '@/components/marketing/features';
import { SolutionSection } from '@/components/marketing/solution';
import { AboutSection } from '@/components/marketing/about';

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
