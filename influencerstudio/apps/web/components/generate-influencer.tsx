"use client";
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { INFLUENCER_CATEGORIES, type InfluencerCategory } from './influencer-categories';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { MediaUploader } from '@/components/media-uploader';
import { useToast } from './toaster';
import { useAction, useQuery } from 'convex/react';

type Props = {
  selectedId?: string;
  onDone?: () => void;
};

export function GenerateInfluencerPanel({ selectedId, onDone }: Props) {
  const toast = useToast();
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [numPoses, setNumPoses] = useState(3);
  const [referenceUrl, setReferenceUrl] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [refining, setRefining] = useState(false);

  const category: InfluencerCategory | undefined = useMemo(
    () => INFLUENCER_CATEGORIES.find((c) => c.id === selectedId),
    [selectedId]
  );

  const generate = (useAction as any)('replicate:generateInfluencerImages');
  const refine = (useAction as any)('anthropic:refineImagePrompt');
  const assets = (useQuery as any)('replicate:listGeneratedAssets', {});

  if (!category) return null;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setReferenceUrl(url);
  };

  async function onRefine() {
    try {
      setRefining(true);
      const base = prompt || category.samplePrompt;
      const res = await refine({ category: category.name, basePrompt: base, aspectRatio });
      if (res?.prompt) setPrompt(res.prompt);
      toast.push({ title: 'Prompt refined', description: 'Review and adjust if needed.' });
    } catch (e: any) {
      console.error(e);
      toast.push({ title: 'Failed to refine prompt', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setRefining(false);
    }
  }

  async function onGenerate() {
    if (!prompt || busy) return;
    if (!window.confirm(`Use this prompt to generate images?\n\n${prompt}`)) return;
    setBusy(true);
    try {
      await generate({
        category: category!.name,
        prompt,
        numImages,
        numPoses,
        referenceImageUrl: referenceUrl,
        aspectRatio,
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
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Or upload to cloud and use a presigned URL:</p>
            <MediaUploader
              onUploaded={async (key) => {
                try {
                  const res = await fetch('/api/storage/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key }),
                  });
                  const data = await res.json();
                  if (data.downloadUrl) {
                    setReferenceUrl(data.downloadUrl);
                    toast.push({ title: 'Reference ready', description: 'Using S3 presigned URL for generation.' });
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prompt & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Prompt</label>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onRefine} disabled={refining}>
                {refining ? 'Refining…' : 'Refine with AI'}
              </Button>
            </div>
          </div>
          <textarea
            className="h-32 w-full rounded-md border bg-background p-2 text-sm outline-none"
            value={prompt || category.samplePrompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={category.samplePrompt}
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium"># Images</label>
              <Input
                type="number"
                min={1}
                max={4}
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
            <div>
              <label className="text-sm font-medium">Aspect Ratio</label>
              <select
                className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
              >
                <option value="1:1">1:1</option>
                <option value="3:4">3:4</option>
                <option value="4:5">4:5</option>
                <option value="9:16">9:16</option>
                <option value="16:9">16:9</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerate} disabled={busy}>
              {busy ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Avatar Generation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Pick a category to pre-fill a strong sample prompt.</li>
            <li>Optionally upload a reference selfie or image.</li>
            <li>Refine the prompt with AI or write your own.</li>
            <li>Select images count, poses, and aspect ratio.</li>
            <li>Confirm the final prompt and start generation.</li>
            <li>Review results in Library → Generated Assets.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
