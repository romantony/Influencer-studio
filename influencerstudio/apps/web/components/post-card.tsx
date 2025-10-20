import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface PostCardProps {
  caption: string;
  hashtags: string[];
  status: string;
  scheduledAt?: string;
}

export function PostCard({ caption, hashtags, status, scheduledAt }: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{status}</CardTitle>
        <CardDescription>{scheduledAt ? `Scheduled for ${scheduledAt}` : 'Draft'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{caption}</p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-primary-600">
          {hashtags.map((tag) => (
            <span key={tag}>#{tag.replace(/^#/, '')}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
