import { mutation, query, type MutationCtx } from './_compat';
import { v, type Id } from 'convex/values';
import { requireUserWithRole } from './auth';

export const instagramPublish = async (ctx: MutationCtx<any>, args: { postId: Id<'posts'> }) => {
  const post = await ctx.db.get(args.postId);
  if (!post) throw new Error('Post not found');
  await ctx.db.patch(args.postId, {
    status: 'published',
    publishedAt: Date.now(),
    metrics: { likes: 120, comments: 15, views: 3400 }
  });
  await ctx.db.insert('webhooks', {
    type: 'instagram.publish',
    payload: { postId: args.postId },
    createdAt: Date.now()
  });
};

export const publish = mutation({
  args: {
    postId: v.id('posts')
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    if (post.userId !== user._id && user.role !== 'admin') throw new Error('Forbidden');
    await instagramPublish(ctx, { postId: args.postId });
    return await ctx.db.get(args.postId);
  }
});

export const ingestCallback = mutation({
  args: {
    payload: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('webhooks', {
      type: 'instagram.callback',
      payload: args.payload,
      createdAt: Date.now()
    });
    return { ok: true };
  }
});

export const listComments = query({
  args: {
    postId: v.id('posts')
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error('Post not found');
    return [
      { id: '1', author: 'mockfan', text: 'Love this!', createdAt: Date.now() - 10000 },
      { id: '2', author: 'creatorbuddy', text: 'Collab soon?', createdAt: Date.now() - 20000 }
    ];
  }
});
