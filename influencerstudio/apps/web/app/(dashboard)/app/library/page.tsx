"use client";
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useQuery } from 'convex/react';

export default function LibraryPage() {
  const generated = (useQuery as any)('replicate:listGeneratedAssets', {});
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Asset library</h1>
        <p className="text-sm text-muted-foreground">Reuse avatars, outfits, and generated content.</p>
      </header>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Generated Assets</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(generated ?? []).map((asset: any) => (
            <Card key={asset._id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{asset.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
                  <Image src={asset.imageUrl} alt={asset.prompt} fill className="object-cover" />
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{asset.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
