import { Card, CardContent } from '@influencerstudio/ui';
import { Section } from './section';

const items = [
  {
    quote:
      'Scheduling and captioning feel effortless. The simple UI hides a ton of power.',
    author: 'Maya — Creator'
  },
  {
    quote: 'Our team aligned on tone and safety in days, not weeks.',
    author: 'Leo — Community Lead'
  },
  {
    quote: 'Mock adapters made local prototyping a breeze.',
    author: 'Jess — Engineer'
  }
];

export function Testimonials() {
  return (
    <Section className="py-16">
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((t) => (
          <Card key={t.author}>
            <CardContent className="p-6 text-sm">
              <p className="mb-3 italic">“{t.quote}”</p>
              <p className="text-muted-foreground">{t.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

