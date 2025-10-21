"use client";
import Image from 'next/image';
import { useState } from 'react';
import { AvatarCard } from '@/components/avatar-card';
import { MediaUploader } from '@/components/media-uploader';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { INFLUENCER_CATEGORIES } from '@/components/influencer-categories';
import { GenerateInfluencerPanel } from '@/components/generate-influencer';

const mockAvatars = [
  {
    id: 'avatar-1',
    name: 'Luna Byte',
    style: 'cinematic',
    baseImageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AvatarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Avatars</h1>
          <p className="text-sm text-muted-foreground">Create AI influencers by category.</p>
        </div>
      </header>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Choose a category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INFLUENCER_CATEGORIES.map((cat) => (
            <Card key={cat.id} className="cursor-pointer" onClick={() => setSelectedCategory(cat.id)}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {cat.emoji} {cat.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="relative h-28 w-full overflow-hidden rounded-md">
                  <Image src={cat.coverUrl} alt={cat.name} fill className="object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">{cat.blurb}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedCategory ? (
        <div className="space-y-4 rounded-xl border p-4">
          <GenerateInfluencerPanel selectedId={selectedCategory} onDone={() => {}} />
        </div>
      ) : null}

      <div className="rounded-xl border border-dashed border-border p-6">
        <h2 className="text-lg font-semibold">Upload a selfie</h2>
        <p className="text-sm text-muted-foreground">
          Optionally provide a reference image to guide generations.
        </p>
        <MediaUploader onUploaded={(key) => console.log('Uploaded to', key)} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockAvatars.map((avatar) => (
          <AvatarCard key={avatar.id} name={avatar.name} style={avatar.style} imageUrl={avatar.baseImageUrl} />
        ))}
      </div>
    </section>
  );
}
