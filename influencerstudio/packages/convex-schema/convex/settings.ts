import { mutation, query } from './_compat';
import { v } from 'convex/values';
import { requireUserWithRole } from './auth';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUserWithRole(ctx, 'creator');
    return await ctx.db.query('settings').withIndex('userIdKey', (q) => q.eq('userId', user._id)).collect();
  }
});

export const upsert = mutation({
  args: {
    key: v.string(),
    value: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const existing = await ctx.db
      .query('settings')
      .withIndex('userIdKey', (q) => q.eq('userId', user._id).eq('key', args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
      return await ctx.db.get(existing._id);
    }

    const settingId = await ctx.db.insert('settings', {
      userId: user._id,
      key: args.key,
      value: args.value
    });
    return await ctx.db.get(settingId);
  }
});
