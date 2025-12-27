import FooterSection from "@/components/footer";
import Pricing from "@/components/pricing";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <Pricing />
      <FooterSection />
    </div>
  );
}
