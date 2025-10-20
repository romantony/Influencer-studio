import { SchedulerCalendar } from '@/components/scheduler-calendar';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

const scheduled = ['2024-01-05T15:00:00Z', '2024-01-07T18:00:00Z'];

export default function SchedulePage() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Scheduler</h1>
          <p className="text-sm text-muted-foreground">Avoid conflicts with intelligent rate limiting.</p>
        </div>
        <Button>Schedule post</Button>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <SchedulerCalendar scheduledDates={scheduled} />
        <Card>
          <CardHeader>
            <CardTitle>Quick schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input type="datetime-local" />
            <Button className="w-full">Schedule</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
