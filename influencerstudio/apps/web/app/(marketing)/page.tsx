import { CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import { Hero } from '@/components/hero';
import { FeatureCards } from '@/components/feature-cards';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';

const features = [
  {
    title: 'AI Personas that feel human',
    description:
      'Craft on-brand Instagram voices with tone, pillars, and target audience baked in.',
    icon: Sparkles
  },
  {
    title: 'Avatar creation without the hassle',
    description: 'Turn text prompts or selfies into cinematic avatars and outfits.',
    icon: ShieldCheck
  },
  {
    title: 'Smart scheduling and engagement',
    description:
      'Plan, publish, and auto-reply with safety guardrails and analytics insights.',
    icon: CalendarDays
  }
];

export default function MarketingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Hero />
      <FeatureCards id="features" items={features} />
      <Testimonials />
      <FAQ />
    </main>
  );
}
