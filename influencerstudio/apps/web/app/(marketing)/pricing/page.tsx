import { Button, Card, CardContent, CardHeader, CardTitle } from '@influencerstudio/ui';
import { Section } from '@/components/section';

const plans = [
  { name: 'Free', price: '$0', tagline: 'For exploration', features: ['1 persona', '5 drafts', 'Community support'] },
  {
    name: 'Creator',
    price: '$12',
    tagline: 'For daily posting',
    features: ['Unlimited drafts', 'Scheduler', 'Caption generator', 'Basic analytics']
  },
  {
    name: 'Pro',
    price: '$29',
    tagline: 'For teams',
    features: ['Everything in Creator', 'Team seats', 'Moderation overrides', 'Priority support']
  }
];

export default function PricingPage() {
  return (
    <Section className="py-16">
      <h1 className="mb-8 text-center text-4xl font-semibold">Pricing</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {p.name}
                {p.name === 'Creator' && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Popular</span>
                )}
              </CardTitle>
              <div className="mt-1 text-3xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2">
              <ul className="mb-4 list-disc pl-5 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button className="mt-auto">Get started</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
