import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Section } from './section';

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <Section className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> StudioSuite presents
        </span>
        <h1 className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-5xl font-semibold text-transparent sm:text-6xl">
          Influence smarter with InfluencerStudio
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          AI-driven personas, avatar creation, content scheduling, and engagement — all in one tidy workspace.
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
        <div className="mt-6 grid grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <p className="text-2xl font-semibold text-foreground">10x</p>
            Faster captioning
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">95%</p>
            Mock uptime
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">∞</p>
            Creativity unlocked
          </div>
        </div>
      </Section>
    </div>
  );
}

