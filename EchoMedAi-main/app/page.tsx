import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { AccuracyGraph } from '@/components/home/accuracy-graph';
import { AIAssistantDemo } from '@/components/home/ai-assistant-demo';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { GlobalImpactMap } from '@/components/home/global-impact-map';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <FeaturesSection />
      <AccuracyGraph />
      <AIAssistantDemo />
      <GlobalImpactMap />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}