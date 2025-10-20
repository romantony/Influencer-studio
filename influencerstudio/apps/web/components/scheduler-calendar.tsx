'use client';

import { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface SchedulerCalendarProps {
  scheduledDates: string[];
}

export function SchedulerCalendar({ scheduledDates }: SchedulerCalendarProps) {
  const selected = useMemo(() => scheduledDates.map((date) => new Date(date)), [scheduledDates]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DayPicker mode="multiple" selected={selected} disabled />
        <ul className="space-y-2 text-sm text-muted-foreground">
          {selected.map((date) => (
            <li key={date.toISOString()}>{format(date, 'PPPpp')}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
