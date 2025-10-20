import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const assets = [
  { id: 'asset-1', type: 'photo', url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80', metadata: { outfit: 1 } },
  { id: 'asset-2', type: 'video', url: 'https://example.com/video.mp4', metadata: { durationSec: 15 } }
];

export default function LibraryPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Asset library</h1>
        <p className="text-sm text-muted-foreground">Reuse avatars, outfits, and generated content.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{asset.type.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {asset.type === 'photo' ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
                  <Image src={asset.url} alt={asset.id} fill className="object-cover" />
                </div>
              ) : (
                <video controls className="h-48 w-full rounded-xl bg-black" src={asset.url} />
              )}
              <p className="text-xs text-muted-foreground">Metadata: {JSON.stringify(asset.metadata)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
