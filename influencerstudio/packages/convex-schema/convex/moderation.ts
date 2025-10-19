import { mutation } from './_compat';
import { v } from 'convex/values';
import { requireUserWithRole } from './auth';

export const denylist = ['hate', 'violence'];

export function evaluateCaption(caption: string) {
  const lower = caption.toLowerCase();
  const flagged = denylist.filter((word) => lower.includes(word));
  const toxicity = lower.includes('terrible') ? 0.8 : 0.1;
  return {
    status: flagged.length || toxicity > 0.7 ? 'rejected' : 'approved',
    reasons: [
      ...flagged.map((word) => `Contains blocked keyword: ${word}`),
      toxicity > 0.7 ? 'High toxicity score' : null
    ].filter(Boolean) as string[]
  };
}

export const scanCaption = mutation({
  args: {
    caption: v.string()
  },
  handler: async (_ctx, args) => evaluateCaption(args.caption)
});

export const scanMedia = mutation({
  args: {
    assetId: v.id('avatarAssets')
  },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.assetId);
    if (!asset) throw new Error('Asset not found');
    // Mock NSFW probability
    const nsfwProbability = asset.metadata?.pose === 0 ? 0.1 : 0.2;
    return {
      status: nsfwProbability > 0.8 ? 'rejected' : 'approved',
      score: nsfwProbability
    };
  }
});

export const override = mutation({
  args: {
    postId: v.id('posts'),
    status: v.string(),
    reasons: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'admin');
    await ctx.db.patch(args.postId, {
      moderation: {
        status: args.status,
        reasons: args.reasons
      }
    });
    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'moderation:override',
      subject: args.postId.toString(),
      payload: args,
      createdAt: Date.now()
    });
    return true;
  }
});
