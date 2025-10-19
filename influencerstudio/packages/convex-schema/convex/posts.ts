import { mutation, query } from './_compat';
import { v } from 'convex/values';
import { getLLMAdapter } from '@influencerstudio/sdk/src/adapters/llm';
import { requireUserWithRole, assertOwnerOrAdmin } from './auth';
import { CaptionResultSchema } from '@influencerstudio/sdk/src/adapters/llm';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUserWithRole(ctx, 'creator');
    return await ctx.db.query('posts').withIndex('userId', (q) => q.eq('userId', user._id)).collect();
  }
});

export const createDraft = mutation({
  args: {
    influencerId: v.id('influencers'),
    mediaS3Key: v.string(),
    mediaType: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const influencer = await ctx.db.get(args.influencerId);
    if (!influencer) throw new Error('Influencer not found');
    assertOwnerOrAdmin(user, influencer.userId);

    const postId = await ctx.db.insert('posts', {
      userId: user._id,
      influencerId: influencer._id,
      status: 'draft',
      caption: '',
      hashtags: [],
      mediaS3Key: args.mediaS3Key,
      mediaType: args.mediaType,
      scheduledAt: undefined,
      publishedAt: undefined,
      platform: 'instagram',
      moderation: { status: 'pending', reasons: [] },
      metrics: { likes: 0, comments: 0, views: 0 }
    });

    return await ctx.db.get(postId);
  }
});

export const update = mutation({
  args: {
    postId: v.id('posts'),
    payload: v.object({
      caption: v.optional(v.string()),
      hashtags: v.optional(v.array(v.string())),
      status: v.optional(v.string()),
      scheduledAt: v.optional(v.number()),
      moderation: v.optional(v.any())
    })
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    assertOwnerOrAdmin(user, post.userId);
    await ctx.db.patch(args.postId, args.payload);
    return await ctx.db.get(args.postId);
  }
});

export const generateCaption = mutation({
  args: {
    postId: v.id('posts'),
    description: v.string(),
    tone: v.string()
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    const influencer = await ctx.db.get(post.influencerId);
    if (!influencer) throw new Error('Influencer not found');

    const adapter = getLLMAdapter();
    const result = await adapter.generateCaption({
      persona: influencer.personaName,
      tone: args.tone,
      assetDescription: args.description,
      callToAction: influencer.settings?.cta
    });
    const parsed = CaptionResultSchema.parse(result);

    await ctx.db.patch(args.postId, {
      caption: parsed.caption,
      hashtags: parsed.hashtags
    });
    return parsed;
  }
});

export const generateHashtags = mutation({
  args: {
    influencerId: v.id('influencers'),
    description: v.string(),
    tone: v.string()
  },
  handler: async (ctx, args) => {
    const influencer = await ctx.db.get(args.influencerId);
    if (!influencer) throw new Error('Influencer not found');
    const adapter = getLLMAdapter();
    return adapter.suggestHashtags({
      persona: influencer.personaName,
      tone: args.tone,
      assetDescription: args.description
    });
  }
});

export const attachMedia = mutation({
  args: {
    postId: v.id('posts'),
    mediaS3Key: v.string(),
    mediaType: v.string()
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    await ctx.db.patch(args.postId, {
      mediaS3Key: args.mediaS3Key,
      mediaType: args.mediaType
    });
    return await ctx.db.get(args.postId);
  }
});
