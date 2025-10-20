import { MetricCard } from '@/components/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const metrics = [
  { label: 'Reach', value: '42k', trend: '+8% vs last week' },
  { label: 'Likes', value: '12.3k', trend: '+4% vs last week' },
  { label: 'Comments', value: '1.8k', trend: '+15% vs last week' }
];

const recommendations = [
  { window: 'Morning Magic', hour: 9, rationale: 'Audience spike before commute.' },
  { window: 'Evening Spotlight', hour: 19, rationale: 'High comment activity post-work.' }
];

export default function AnalyticsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Understand performance and recommended actions.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Best time to post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.window} className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">{rec.window}</h3>
              <p className="text-xs text-muted-foreground">{rec.rationale}</p>
              <p className="text-xs text-primary-600">{rec.hour}:00 local time</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
