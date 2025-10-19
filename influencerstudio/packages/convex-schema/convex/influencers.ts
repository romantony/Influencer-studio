import { mutation, query } from './_compat';
import { v } from 'convex/values';
import { z } from 'zod';
import { requireUserWithRole, assertOwnerOrAdmin } from './auth';

const influencerInput = z.object({
  personaName: z.string().min(2),
  tone: z.string(),
  pillars: z.array(z.string().min(1)).min(1),
  bio: z.string().min(10),
  handleSuggestion: z.string().min(2),
  settings: z.record(z.any()).default({})
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUserWithRole(ctx, 'creator');
    return await ctx.db.query('influencers').withIndex('userId', (q) => q.eq('userId', user._id)).collect();
  }
});

export const create = mutation({
  args: {
    personaName: v.string(),
    tone: v.string(),
    pillars: v.array(v.string()),
    bio: v.string(),
    handleSuggestion: v.string(),
    settings: v.optional(v.any())
  },
  handler: async (ctx, rawArgs) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const args = influencerInput.parse(rawArgs);
    const influencerId = await ctx.db.insert('influencers', {
      userId: user._id,
      personaName: args.personaName,
      tone: args.tone,
      pillars: args.pillars,
      bio: args.bio,
      handleSuggestion: args.handleSuggestion,
      settings: args.settings,
      // Additional defaults for analytics
      // e.g., frequency preferences can be stored in settings
    });
    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'influencer:create',
      subject: influencerId.toString(),
      payload: args,
      createdAt: Date.now()
    });
    return await ctx.db.get(influencerId);
  }
});

export const update = mutation({
  args: {
    influencerId: v.id('influencers'),
    payload: v.object({
      tone: v.optional(v.string()),
      pillars: v.optional(v.array(v.string())),
      bio: v.optional(v.string()),
      settings: v.optional(v.any())
    })
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const influencer = await ctx.db.get(args.influencerId);
    if (!influencer) throw new Error('Influencer not found');
    assertOwnerOrAdmin(user, influencer.userId);

    await ctx.db.patch(args.influencerId, args.payload);
    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'influencer:update',
      subject: args.influencerId.toString(),
      payload: args.payload,
      createdAt: Date.now()
    });
    return await ctx.db.get(args.influencerId);
  }
});
