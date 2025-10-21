"use node";
import { action, mutation, query } from './_compat';
import { v } from 'convex/values';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthorized');
  const user = await ctx.db
    .query('users')
    .withIndex('email', (q: any) => q.eq('email', identity.tokenIdentifier))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

export const listGeneratedAssets = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return await ctx.db
      .query('generatedAssets')
      .withIndex('userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  }
});

export const saveGeneratedAssets = mutation({
  args: {
    items: v.array(
      v.object({
        userId: v.id('users'),
        category: v.string(),
        prompt: v.string(),
        imageUrl: v.string(),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        poseIndex: v.optional(v.number()),
        replicateId: v.optional(v.string())
      })
    )
  },
  handler: async (ctx, args) => {
    const ids = [] as string[];
    for (const it of args.items) {
      const id = await ctx.db.insert('generatedAssets', {
        ...it,
        createdAt: Date.now()
      });
      ids.push(id.toString());
    }
    return ids;
  }
});

export const generateInfluencerImages = action({
  args: {
    category: v.string(),
    prompt: v.string(),
    numImages: v.optional(v.number()),
    numPoses: v.number(),
    referenceImageUrl: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) throw new Error('Missing REPLICATE_API_TOKEN in Convex env');
    const bucket = process.env.S3_BUCKET ?? 'influencer-studio';
    const cloudfront = process.env.CLOUDFRONT_DOMAIN; // e.g., d17gwle4op8ewx.cloudfront.net
    const region = process.env.AWS_REGION ?? 'us-east-1';
    const s3 = new S3Client({ region });

    const numImages = Math.max(1, Math.min(4, args.numImages ?? 1));
    const numPoses = Math.max(1, Math.min(6, args.numPoses));

    const input: Record<string, any> = {
      prompt: args.prompt,
      num_outputs: numImages,
    };
    if (args.referenceImageUrl) {
      input.image = args.referenceImageUrl;
    }
    if (args.aspectRatio) {
      input.aspect_ratio = args.aspectRatio; // Flux supports strings like '9:16', '1:1'
    }

    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'prunaai/flux.1-dev',
        input
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Replicate request failed: ${res.status} ${errText}`);
    }
    const prediction = await res.json();
    const replicateId: string | undefined = prediction?.id ?? prediction?.uuid;

    // Poll for completion (simple, bounded)
    let outputUrls: string[] = [];
    for (let i = 0; i < 60; i++) {
      const pr = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${apiToken}` }
      });
      const pj = await pr.json();
      if (pj.status === 'succeeded' || pj.status === 'failed' || pj.status === 'canceled') {
        outputUrls = Array.isArray(pj.output) ? pj.output : [];
        if (pj.status !== 'succeeded') {
          throw new Error(`Replicate job ${pj.status}`);
        }
        break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!outputUrls.length) {
      throw new Error('No outputs returned by Replicate');
    }

    // Upload each output to S3 and store CloudFront URL if configured
    const items: any[] = [];
    let index = 0;
    const slug = (args.category || 'general')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    for (const url of outputUrls) {
      index += 1;
      const resImg = await fetch(url);
      if (!resImg.ok) throw new Error(`Failed to fetch output image: ${resImg.status}`);
      const arrayBuf = await resImg.arrayBuffer();
      const key = `generated/${user._id}/${slug}/${Date.now()}-${index}.jpg`;
      await s3.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from(arrayBuf), ContentType: 'image/jpeg' })
      );
      const publicUrl = cloudfront ? `https://${cloudfront}/${key}` : url;
      items.push({
        userId: user._id,
        category: args.category,
        prompt: args.prompt,
        imageUrl: publicUrl,
        width: undefined,
        height: undefined,
        poseIndex: (index % numPoses) + 1,
        replicateId,
        metadata: { aspectRatio: args.aspectRatio ?? '9:16' },
      });
    }

    await ctx.runMutation('replicate:saveGeneratedAssets', { items });
    return { count: items.length, items };
  }
});
