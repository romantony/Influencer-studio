import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getLLMAdapter } from '@influencerstudio/sdk';

const createSchema = z.object({
  personaName: z.string(),
  tone: z.string(),
  pillars: z.array(z.string()),
  bio: z.string()
});

const mockInfluencers = [
  {
    id: 'influencer-1',
    personaName: 'Ava Flux',
    tone: 'Vibrant',
    pillars: ['Beauty', 'Tech', 'Lifestyle'],
    bio: 'Your AI-native glam technologist.'
  }
];

export async function GET() {
  return NextResponse.json(mockInfluencers);
}

export async function POST(request: Request) {
  const body = createSchema.parse(await request.json());
  const adapter = getLLMAdapter();
  await adapter.suggestHashtags({
    persona: body.personaName,
    tone: body.tone,
    assetDescription: body.bio
  });
  const influencer = { id: `mock-${Date.now()}`, ...body };
  mockInfluencers.push(influencer);
  return NextResponse.json(influencer, { status: 201 });
}
