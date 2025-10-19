import { CaptionEditor } from '@/components/caption-editor';
import { PostCard } from '@/components/post-card';
import { SafetyBadge } from '@/components/safety-badge';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@influencerstudio/ui';

const mockPosts = [
  {
    id: 'post-1',
    caption: 'A new drop is coming your way!',
    hashtags: ['studio', 'creator'],
    status: 'draft',
    moderation: { status: 'approved', reasons: [] },
    scheduledAt: null
  }
];

export default function PostsPage() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Post generator</h1>
          <p className="text-sm text-muted-foreground">Generate captions, hashtags, and CTAs.</p>
        </div>
        <Button>Create draft</Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Draft</CardTitle>
              <SafetyBadge status={post.moderation.status as any} reasons={post.moderation.reasons} />
            </CardHeader>
            <CardContent>
              <PostCard caption={post.caption} hashtags={post.hashtags} status={post.status} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI caption assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <CaptionEditor onGenerate={async () => {}} />
        </CardContent>
      </Card>
    </section>
  );
}
