import { Section } from './section';

const faqs = [
  {
    q: 'Is this production ready?',
    a: 'The repo ships with mocks and a Convex backend. Swap adapters and wire real providers when ready.'
  },
  {
    q: 'Do I need any paid AI services?',
    a: 'No. USE_MOCK_ADAPTERS=true keeps everything offline-friendly until you flip providers.'
  },
  {
    q: 'Where are assets stored?',
    a: 'To start, mock S3 URLs. In production, configure AWS credentials and a bucket in Convex env.'
  }
];

export function FAQ() {
  return (
    <Section className="py-14">
      <h2 className="mb-6 text-center text-2xl font-semibold">Frequently asked questions</h2>
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border">
        {faqs.map((f) => (
          <details key={f.q} className="group p-4 open:bg-muted/40">
            <summary className="cursor-pointer list-none text-sm font-medium">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

