"use node";
import { action, mutation, query } from './_compat';
import { v } from 'convex/values';

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
    numImages: v.number(),
    numPoses: v.number(),
    referenceImageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) throw new Error('Missing REPLICATE_API_TOKEN in Convex env');

    const total = Math.max(1, Math.min(8, args.numImages)) * Math.max(1, Math.min(6, args.numPoses));

    const input: Record<string, any> = {
      prompt: args.prompt,
      num_outputs: Math.max(1, Math.min(8, args.numImages)),
    };
    if (args.referenceImageUrl) {
      input.image = args.referenceImageUrl;
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

    // Prepare DB inserts
    const items = outputUrls.map((url, idx) => ({
      userId: user._id,
      category: args.category,
      prompt: args.prompt,
      imageUrl: url,
      width: undefined,
      height: undefined,
      poseIndex: (idx % Math.max(1, Math.min(6, args.numPoses))) + 1,
      replicateId
    }));

    await ctx.runMutation('replicate:saveGeneratedAssets', { items });
    return { count: items.length, items };
  }
});

