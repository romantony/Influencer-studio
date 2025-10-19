import { Card, CardContent, CardHeader, CardTitle } from '@influencerstudio/ui';
import { Section } from './section';
import { ComponentType } from 'react';

export function FeatureCards({
  id,
  items
}: {
  id?: string;
  items: { title: string; description: string; icon: ComponentType<{ className?: string }> }[];
}) {
  return (
    <Section className="py-8" >
      <div id={id} className="grid gap-6 sm:grid-cols-3">
        {items.map((f) => (
          <Card key={f.title} className="h-full">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-fit">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2 text-xl">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.description}</CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

