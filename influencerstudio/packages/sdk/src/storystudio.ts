import fetch from 'node-fetch';
import { z } from 'zod';

const baseUrl = process.env.STORYSTUDIO_API_BASE_URL ?? 'http://localhost:4000';
const apiKey = process.env.STORYSTUDIO_API_KEY ?? 'mock-key';

const baseHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': apiKey
};

const ImagePromptSchema = z.object({
  id: z.string(),
  persona: z.string(),
  prompt: z.string()
});
export type ImagePrompt = z.infer<typeof ImagePromptSchema>;

const VideoPromptSchema = z.object({
  id: z.string(),
  persona: z.string(),
  script: z.string()
});
export type VideoPrompt = z.infer<typeof VideoPromptSchema>;

const TranscriptionSchema = z.object({
  id: z.string(),
  text: z.string()
});

const UsageSchema = z.object({
  creditsUsed: z.number(),
  creditsRemaining: z.number()
});

async function request<T>(path: string, body?: unknown) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: baseHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    throw new Error(`StoryStudio request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function createImagePrompt(input: {
  persona: string;
  style: string;
  context: string;
}): Promise<ImagePrompt> {
  if (process.env.USE_MOCK_ADAPTERS !== 'false') {
    return {
      id: `mock-image-${Date.now()}`,
      persona: input.persona,
      prompt: `${input.context} in ${input.style} style`
    };
  }

  const data = await request<unknown>('/image-prompts', input);
  return ImagePromptSchema.parse(data);
}

export async function createVideoPrompt(input: {
  persona: string;
  tone: string;
  topic: string;
}): Promise<VideoPrompt> {
  if (process.env.USE_MOCK_ADAPTERS !== 'false') {
    return {
      id: `mock-video-${Date.now()}`,
      persona: input.persona,
      script: `Hey there! Let's talk about ${input.topic} with a ${input.tone} vibe.`
    };
  }

  const data = await request<unknown>('/video-prompts', input);
  return VideoPromptSchema.parse(data);
}

export async function transcribeAudio(input: { s3Key: string }): Promise<string> {
  if (process.env.USE_MOCK_ADAPTERS !== 'false') {
    return `Transcription for ${input.s3Key}`;
  }
  const data = await request<unknown>('/transcribe', input);
  return TranscriptionSchema.parse(data).text;
}

export async function getCostsAndUsage(): Promise<z.infer<typeof UsageSchema>> {
  if (process.env.USE_MOCK_ADAPTERS !== 'false') {
    return {
      creditsUsed: 42,
      creditsRemaining: 1337
    };
  }

  const res = await fetch(`${baseUrl}/usage`, {
    headers: baseHeaders,
    method: 'GET'
  });
  if (!res.ok) {
    throw new Error(`StoryStudio usage request failed: ${res.status}`);
  }
  const data = await res.json();
  return UsageSchema.parse(data);
}
