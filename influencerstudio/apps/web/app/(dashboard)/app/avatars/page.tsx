"use client";
import Image from 'next/image';
import { useState } from 'react';
import { AvatarCard } from '@/components/avatar-card';
import { MediaUploader } from '@/components/media-uploader';
import { VideoGenerator } from '@/components/video-generator';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { INFLUENCER_CATEGORIES } from '@/components/influencer-categories';
import { GenerateInfluencerPanel } from '@/components/generate-influencer';
import { ImageTile } from '@/components/image-tile';

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
  const [selectedAvatar, setSelectedAvatar] = useState<typeof mockAvatars[0] | undefined>(undefined);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const cdnHost = process.env.NEXT_PUBLIC_CDN_HOST;
  const featuredFashion = cdnHost
    ? {
      url: `https://${cdnHost}/fashion/rooftop-paris-01.jpg`,
      prompt:
        'A glamorous AI influencer posing on a minimalist rooftop in Paris at golden hour, wearing a sleek modern outfit with flowing fabric, soft cinematic lighting, lens flare, Vogue-style editorial composition, aesthetic depth of field, 50mm lens shot.',
    }
    : null;
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Avatars</h1>
          <p className="text-sm text-muted-foreground">Create AI influencers by category.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showVideoGenerator ? 'outline' : 'default'}
            onClick={() => setShowVideoGenerator(!showVideoGenerator)}
          >
            {showVideoGenerator ? 'Hide Video Generator' : 'Generate Video'}
          </Button>
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
          <GenerateInfluencerPanel selectedId={selectedCategory} onDone={() => { }} />
        </div>
      ) : null}

      {/* Video Generator */}
      {showVideoGenerator && selectedAvatar ? (
        <div className="space-y-4 rounded-xl border border-primary-200 bg-primary-50/30 p-6">
          <h2 className="text-lg font-semibold">Generate Talking Avatar Video</h2>
          <VideoGenerator
            avatarId={selectedAvatar.id}
            avatarImageUrl={selectedAvatar.baseImageUrl}
            avatarName={selectedAvatar.name}
            onVideoGenerated={(url) => {
              console.log('Video generated:', url);
              setShowVideoGenerator(false);
            }}
          />
        </div>
      ) : showVideoGenerator && !selectedAvatar ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Select an avatar below to generate a video
          </p>
        </div>
      ) : null}

      {/* Featured Fashion & Lifestyle asset from S3/CloudFront */}
      {featuredFashion ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Fashion & Lifestyle – Featured</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ImageTile
              src={featuredFashion.url}
              alt="Fashion & Lifestyle Featured"
              prompt={featuredFashion.prompt}
            />
          </div>
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
          <div key={avatar.id} onClick={() => setSelectedAvatar(avatar)} className="cursor-pointer">
            <AvatarCard
              name={avatar.name}
              style={avatar.style}
              imageUrl={avatar.baseImageUrl}
              onSelect={() => setSelectedAvatar(avatar)}
            />
            {selectedAvatar?.id === avatar.id && (
              <div className="mt-2 rounded-md bg-primary-100 p-2 text-center text-sm font-medium text-primary-700">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
