import Link from 'next/link';
import { Button } from '@influencerstudio/ui';
import { ArrowRight, Sparkles, CalendarDays, ShieldCheck } from 'lucide-react';

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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
          StudioSuite presents
        </span>
        <h1 className="text-5xl font-bold sm:text-6xl">
          Influence smarter with <span className="text-primary-600">InfluencerStudio</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A unified workspace for AI-driven Instagram personas, avatar creation, content scheduling, and community engagement.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/signin" className="flex items-center gap-2">
              Start creating <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#features">Explore features</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="grid gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
          >
            <feature.icon className="h-10 w-10 text-primary-500" />
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 p-10 text-white">
        <h2 className="text-3xl font-semibold">Built for teams at scale</h2>
        <p className="mt-2 max-w-xl text-white/80">
          Integrate with StoryStudio APIs, secure assets in AWS S3, and collaborate with clear moderation and audit trails.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button asChild variant="ghost" className="bg-white text-primary-600 hover:bg-white/80">
            <Link href="/signup" className="flex items-center gap-2">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm uppercase tracking-wide text-white/70">
            Trusted by the StudioSuite creative network
          </span>
        </div>
      </section>
    </main>
  );
}
