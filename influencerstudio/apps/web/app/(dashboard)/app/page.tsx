import { Suspense } from 'react';
import { MetricCard } from '@/components/metric-card';
import { Skeleton } from '@/components/ui';
import { getDashboardSummary } from '@/lib/server-data';

export default async function DashboardHome() {
  const summary = await getDashboardSummary();
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">
          Track your AI influencer performance and manage creative pipelines in one place.
        </p>
      </header>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summary.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </Suspense>
    </section>
  );
}
