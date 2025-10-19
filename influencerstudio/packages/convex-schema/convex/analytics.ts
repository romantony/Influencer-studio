import { query } from 'convex/server';
import { v } from 'convex/values';
import { requireUserWithRole } from './auth';

export const postMetrics = query({
  args: {
    postId: v.id('posts')
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    if (post.userId !== user._id && user.role !== 'admin') throw new Error('Forbidden');
    return post.metrics;
  }
});

export const recommendationWindows = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const posts = await ctx.db
      .query('posts')
      .withIndex('userId', (q) => q.eq('userId', user._id))
      .collect();

    const times = posts.map((post) => post.scheduledAt ?? Date.now());
    const avgHour = Math.round(
      times.reduce((acc, ts) => acc + new Date(ts).getHours(), 0) / Math.max(times.length, 1)
    );

    return [
      {
        window: 'Morning Magic',
        hour: ((avgHour - 2 + 24) % 24),
        rationale: 'Based on historical engagement and mock heuristics'
      },
      {
        window: 'Evening Spotlight',
        hour: ((avgHour + 5) % 24),
        rationale: 'Secondary slot balancing audience time zones'
      }
    ];
  }
});
