import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const schema = defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('admin'), v.literal('creator'), v.literal('viewer')),
    createdAt: v.number()
  }).index('email', ['email']),
  profiles: defineTable({
    userId: v.id('users'),
    handle: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.string(),
    timezone: v.string()
  }).index('userId', ['userId']),
  avatars: defineTable({
    userId: v.id('users'),
    name: v.string(),
    style: v.string(),
    baseImageUrl: v.string(),
    config: v.any(),
    createdAt: v.number()
  }).index('userId', ['userId']),
  avatarAssets: defineTable({
    avatarId: v.id('avatars'),
    type: v.union(v.literal('photo'), v.literal('video')),
    s3Key: v.string(),
    width: v.number(),
    height: v.number(),
    durationSec: v.optional(v.number()),
    metadata: v.any()
  }).index('avatarId', ['avatarId']),
  generatedAssets: defineTable({
    userId: v.id('users'),
    category: v.string(),
    prompt: v.string(),
    imageUrl: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    poseIndex: v.optional(v.number()),
    replicateId: v.optional(v.string()),
    createdAt: v.number()
  }).index('userId', ['userId']),
  influencers: defineTable({
    userId: v.id('users'),
    personaName: v.string(),
    tone: v.string(),
    pillars: v.array(v.string()),
    bio: v.string(),
    handleSuggestion: v.string(),
    settings: v.any()
  }).index('userId', ['userId']),
  posts: defineTable({
    userId: v.id('users'),
    influencerId: v.id('influencers'),
    status: v.union(
      v.literal('draft'),
      v.literal('scheduled'),
      v.literal('published'),
      v.literal('failed')
    ),
    caption: v.string(),
    hashtags: v.array(v.string()),
    mediaS3Key: v.string(),
    mediaType: v.string(),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    platform: v.literal('instagram'),
    moderation: v.object({ status: v.string(), reasons: v.array(v.string()) }),
    metrics: v.object({ likes: v.number(), comments: v.number(), views: v.number() })
  })
    .index('userId', ['userId'])
    .index('influencerId', ['influencerId'])
    .index('status', ['status']),
  schedules: defineTable({
    userId: v.id('users'),
    influencerId: v.id('influencers'),
    postId: v.id('posts'),
    runAt: v.number(),
    status: v.string()
  }).index('runAt', ['runAt']),
  webhooks: defineTable({
    type: v.string(),
    payload: v.any(),
    createdAt: v.number()
  }).index('type', ['type']),
  settings: defineTable({
    userId: v.id('users'),
    key: v.string(),
    value: v.string()
  }).index('userIdKey', ['userId', 'key']),
  auditLogs: defineTable({
    actorId: v.id('users'),
    action: v.string(),
    subject: v.string(),
    payload: v.any(),
    createdAt: v.number()
  }).index('actorId', ['actorId'])
});

export type Schema = typeof schema;
export default schema;
