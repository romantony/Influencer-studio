import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ key: z.string() });

async function requestConvex(path: string, body: unknown) {
  const convexUrl = process.env.STORYSTUDIO_CONVEX_URL ?? 'http://localhost:8187';
  const response = await fetch(`${convexUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Convex request failed: ${response.status}`);
  }
  return response.json();
}

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  if (process.env.USE_MOCK_ADAPTERS !== 'false') {
    return NextResponse.json({ downloadUrl: `https://s3.mock/${body.key}` });
  }
  const result = await requestConvex('/s3:getPresignedDownloadUrl', body);
  return NextResponse.json(result);
}

