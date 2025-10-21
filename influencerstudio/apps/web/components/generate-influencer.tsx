"use client";
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { INFLUENCER_CATEGORIES, type InfluencerCategory } from './influencer-categories';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { useToast } from './toaster';
import { useAction, useQuery } from 'convex/react';

type Props = {
  selectedId?: string;
  onDone?: () => void;
};

export function GenerateInfluencerPanel({ selectedId, onDone }: Props) {
  const toast = useToast();
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState(4);
  const [numPoses, setNumPoses] = useState(3);
  const [referenceUrl, setReferenceUrl] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const category: InfluencerCategory | undefined = useMemo(
    () => INFLUENCER_CATEGORIES.find((c) => c.id === selectedId),
    [selectedId]
  );

  const generate = (useAction as any)('replicate:generateInfluencerImages');
  const assets = (useQuery as any)('replicate:listGeneratedAssets', {});

  if (!category) return null;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use a temporary object URL as a reference for preview; upload to S3 is optional
    const url = URL.createObjectURL(file);
    setReferenceUrl(url);
  };

  async function onGenerate() {
    if (!prompt || busy) return;
    setBusy(true);
    try {
      await generate({
        category: category!.name,
        prompt,
        numImages,
        numPoses,
        referenceImageUrl: referenceUrl
      } as any);
      toast.push({ title: 'Generation started', description: 'Fetching images from Replicate…' });
      setReferenceUrl(undefined);
      onDone?.();
    } catch (e: any) {
      console.error(e);
      toast.push({ title: 'Generation failed', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            {category.emoji} {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted">
            <Image src={category.coverUrl} alt={category.name} fill className="object-cover" />
          </div>
          <label className="text-sm font-medium">Reference image (optional)</label>
          <Input type="file" accept="image/*" capture="environment" onChange={onSelectFile} />
          {referenceUrl ? (
            <div className="relative h-40 w-full overflow-hidden rounded-md border">
              <Image src={referenceUrl} alt="reference" fill className="object-cover" />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prompt & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="text-sm font-medium">Prompt</label>
          <textarea
            className="h-32 w-full rounded-md border bg-background p-2 text-sm outline-none"
            value={prompt || category.samplePrompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={category.samplePrompt}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium"># Images</label>
              <Input
                type="number"
                min={1}
                max={8}
                value={numImages}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNumImages(Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium"># Poses</label>
              <Input
                type="number"
                min={1}
                max={6}
                value={numPoses}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNumPoses(Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerate} disabled={busy}>
              {busy ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
