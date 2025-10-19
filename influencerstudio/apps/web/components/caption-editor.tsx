'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@influencerstudio/ui';
import { useToast } from './toaster';

const schema = z.object({
  description: z.string().min(5, 'Tell us about the media'),
  tone: z.string().default('vibrant')
});

type FormValues = z.infer<typeof schema>;

interface CaptionEditorProps {
  onGenerate(values: FormValues): Promise<void>;
}

export function CaptionEditor({ onGenerate }: CaptionEditorProps) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { tone: 'vibrant' } });
  const toast = useToast();

  const submit = form.handleSubmit(async (values) => {
    await onGenerate(values);
    toast.push({ title: 'Caption generated', variant: 'success' });
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Describe your media</span>
        <textarea
          className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
        ) : null}
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">Tone</span>
        <Input placeholder="vibrant, playful, educational" {...form.register('tone')} />
      </label>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Generating…' : 'Generate caption'}
      </Button>
    </form>
  );
}
