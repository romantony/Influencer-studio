"use client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { CaptionEditor } from '@/components/caption-editor';

const personas = [
  {
    id: 'influencer-1',
    personaName: 'Ava Flux',
    tone: 'Vibrant',
    pillars: ['Beauty', 'Tech', 'Lifestyle'],
    bio: 'AI-native glam technologist inspiring creative founders.'
  }
];

export default function InfluencersPage() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Influencer personas</h1>
          <p className="text-sm text-muted-foreground">Define tone, pillars, and audience.</p>
        </div>
        <Button>Create persona</Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {personas.map((persona) => (
          <Card key={persona.id}>
            <CardHeader>
              <CardTitle>{persona.personaName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{persona.bio}</p>
              <p className="text-xs uppercase text-primary-600">Tone: {persona.tone}</p>
              <p className="text-xs text-muted-foreground">Pillars: {persona.pillars.join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Persona builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Persona name" />
          <Input placeholder="Tone (e.g. vibrant, educational)" />
          <Input placeholder="Content pillars (comma separated)" />
          <CaptionEditor onGenerate={async () => {}} />
        </CardContent>
      </Card>
    </section>
  );
}
