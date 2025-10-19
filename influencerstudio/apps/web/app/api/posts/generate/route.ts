import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getLLMAdapter } from '@influencerstudio/sdk';

const schema = z.object({
  influencerId: z.string(),
  assetId: z.string(),
  tone: z.string().default('vibrant'),
  callToAction: z.string().optional()
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const adapter = getLLMAdapter();
  const result = await adapter.generateCaption({
    persona: body.influencerId,
    tone: body.tone,
    assetDescription: `Asset ${body.assetId}`,
    callToAction: body.callToAction
  });
  return NextResponse.json(result);
}
