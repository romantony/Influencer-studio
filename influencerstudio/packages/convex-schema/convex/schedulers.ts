import { mutation, internalMutation } from './_compat';
import { v } from 'convex/values';
import { requireUserWithRole } from './auth';
import { instagramPublish } from './instagram';

export const schedulePost = mutation({
  args: {
    postId: v.id('posts'),
    runAt: v.number()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    if (post.userId !== user._id && user.role !== 'admin') throw new Error('Forbidden');

    const scheduleId = await ctx.db.insert('schedules', {
      userId: post.userId,
      influencerId: post.influencerId,
      postId: post._id,
      runAt: args.runAt,
      status: 'scheduled'
    });

    await ctx.db.patch(args.postId, {
      status: 'scheduled',
      scheduledAt: args.runAt
    });

    return await ctx.db.get(scheduleId);
  }
});

export const runDueJobs = internalMutation({
  args: { now: v.number() },
  handler: async (ctx, args) => {
    const due = await ctx.db.query('schedules').withIndex('runAt', (q) => q.lte('runAt', args.now)).collect();
    for (const job of due) {
      await instagramPublish(ctx, { postId: job.postId });
      await ctx.db.patch(job._id, { status: 'completed' });
    }
    return due.length;
  }
});
