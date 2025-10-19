import { query, mutation, type GenericQueryCtx, type GenericMutationCtx, type Doc } from './_compat';
import { v, type Id } from 'convex/values';

export type Role = 'admin' | 'creator' | 'viewer';

type RoleCtx = GenericQueryCtx<any> | GenericMutationCtx<any>;

async function getUserFromIdentity(ctx: RoleCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query('users')
    .withIndex('email', (q) => q.eq('email', identity.tokenIdentifier))
    .unique();
}

function hasRequiredRole(userRole: Role, required: Role) {
  const hierarchy: Role[] = ['viewer', 'creator', 'admin'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(required);
}

export async function requireUserWithRole(ctx: RoleCtx, role: Role) {
  const user = await getUserFromIdentity(ctx);
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!hasRequiredRole(user.role as Role, role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db.query('users').withIndex('email', (q) => q.eq('email', identity.tokenIdentifier)).unique();
  }
});

export const ensureUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.union(v.literal('admin'), v.literal('creator'), v.literal('viewer')))
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('users').withIndex('email', (q) => q.eq('email', args.email)).unique();
    if (existing) {
      return existing;
    }

    const userId = await ctx.db.insert('users', {
      email: args.email,
      name: args.name,
      role: args.role ?? 'creator',
      createdAt: Date.now()
    });

    await ctx.db.insert('profiles', {
      userId,
      handle: args.name.toLowerCase().replace(/\s+/g, ''),
      avatarUrl: undefined,
      bio: '',
      timezone: 'UTC'
    });

    return await ctx.db.get(userId);
  }
});

export const requireRole = query({
  args: { role: v.union(v.literal('admin'), v.literal('creator'), v.literal('viewer')) },
  handler: async (ctx, args) => requireUserWithRole(ctx, args.role)
});

export function assertOwnerOrAdmin(user: Doc<'users'>, ownerId: Id<'users'>) {
  if (user.role === 'admin') return;
  if (user._id === ownerId) return;
  throw new Error('Forbidden');
}
