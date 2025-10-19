import { CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import { FeatureCards } from '@/components/feature-cards';

const features = [
  {
    title: 'AI Personas that feel human',
    description: 'On-brand Instagram voices with tone, pillars, and audience baked in.',
    icon: Sparkles
  },
  {
    title: 'Avatar creation without the hassle',
    description: 'Turn text prompts or selfies into cinematic avatars and outfits.',
    icon: ShieldCheck
  },
  {
    title: 'Smart scheduling and engagement',
    description: 'Plan, publish, and auto-reply with safety guardrails and insights.',
    icon: CalendarDays
  }
];

export default function FeaturesPage() {
  return <FeatureCards items={features} />;
}

