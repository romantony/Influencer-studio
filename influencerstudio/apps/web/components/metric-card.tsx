import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {trend ? <p className="text-xs text-muted-foreground">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
