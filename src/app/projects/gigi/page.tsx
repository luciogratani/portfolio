import { Navigation } from "@/components/gigi/navigation";
import { HeroSection } from "@/components/gigi/hero-section";
import { FlavorCarousel } from "@/components/gigi/flavor-carousel";
import { BentoGrid } from "@/components/gigi/bento-grid";
import { ActivationsSection } from "@/components/gigi/activations-section";
import { SocialSection } from "@/components/gigi/social-section";
import { Footer } from "@/components/gigi/footer";

// Composizione 1:1 della landing di riferimento. `bg-background` dell'originale
// dipendeva dal tema shadcn (non importato qui): usiamo bg-white, l'unico token
// di tema che i componenti richiedessero.
export default function GigiPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FlavorCarousel />
      <BentoGrid />
      <ActivationsSection />
      <SocialSection />
      <Footer />
    </main>
  );
}
