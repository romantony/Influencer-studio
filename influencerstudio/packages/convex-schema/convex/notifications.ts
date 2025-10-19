import { mutation } from 'convex/server';
import { v } from 'convex/values';
import { requireUserWithRole } from './auth';

export const send = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    if (user._id !== args.userId && user.role !== 'admin') {
      throw new Error('Cannot notify other users');
    }

    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'notification:send',
      subject: args.userId.toString(),
      payload: { title: args.title },
      createdAt: Date.now()
    });

    return { delivered: true, strategy: 'mock' };
  }
});
