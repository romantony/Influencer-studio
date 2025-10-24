import { mutation, query } from './_compat';
import { v } from 'convex/values';
import { z } from 'zod';
import { getImageAdapter } from '@influencerstudio/sdk/src/adapters/image';
import { getTTSAdapter } from '@influencerstudio/sdk/src/adapters/tts';
import { getVideoAdapter } from '@influencerstudio/sdk/src/adapters/video';
import { requireUserWithRole, assertOwnerOrAdmin } from './auth';

const createFromTextSchema = z.object({
  prompt: z.string().min(10),
  style: z.enum(['realistic', 'anime', 'pixar', 'cinematic']),
  name: z.string().min(2)
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUserWithRole(ctx, 'creator');
    return await ctx.db.query('avatars').withIndex('userId', (q) => q.eq('userId', user._id)).collect();
  }
});

export const createFromText = mutation({
  args: {
    prompt: v.string(),
    style: v.string(),
    name: v.string()
  },
  handler: async (ctx, rawArgs) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const args = createFromTextSchema.parse(rawArgs);
    const adapter = getImageAdapter();
    const render = await adapter.renderAvatar({ prompt: args.prompt, style: args.style });

    const avatarId = await ctx.db.insert('avatars', {
      userId: user._id,
      name: args.name,
      style: args.style,
      baseImageUrl: render.s3Key,
      config: { prompt: args.prompt },
      createdAt: Date.now()
    });

    await ctx.db.insert('avatarAssets', {
      avatarId,
      type: 'photo',
      s3Key: render.s3Key,
      width: render.width,
      height: render.height,
      metadata: { source: 'text-generation' }
    });

    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'avatar:create',
      subject: avatarId.toString(),
      payload: args,
      createdAt: Date.now()
    });

    return await ctx.db.get(avatarId);
  }
});

export const createFromPhoto = mutation({
  args: {
    uploadKey: v.string(),
    name: v.string(),
    style: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const adapter = getImageAdapter();
    const render = await adapter.renderAvatar({
      prompt: `Stylize uploaded photo ${args.uploadKey}`,
      style: args.style as any
    });

    const avatarId = await ctx.db.insert('avatars', {
      userId: user._id,
      name: args.name,
      style: args.style,
      baseImageUrl: render.s3Key,
      config: { uploadKey: args.uploadKey },
      createdAt: Date.now()
    });

    await ctx.db.insert('avatarAssets', {
      avatarId,
      type: 'photo',
      s3Key: render.s3Key,
      width: render.width,
      height: render.height,
      metadata: { source: 'photo-stylization' }
    });
    return await ctx.db.get(avatarId);
  }
});

export const deleteAvatar = mutation({
  args: { avatarId: v.id('avatars') },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const avatar = await ctx.db.get(args.avatarId);
    if (!avatar) throw new Error('Avatar not found');
    assertOwnerOrAdmin(user, avatar.userId);

    const assets = await ctx.db
      .query('avatarAssets')
      .withIndex('avatarId', (q) => q.eq('avatarId', args.avatarId))
      .collect();

    for (const asset of assets) {
      await ctx.db.delete(asset._id);
    }
    await ctx.db.delete(args.avatarId);
    return true;
  }
});

/**
 * Generate a talking avatar video from script
 * Uses ElevenLabs TTS + RunComfy video generation
 */
export const generateVideo = mutation({
  args: {
    avatarId: v.id('avatars'),
    script: v.string(),
    videoPrompt: v.string(),
    voiceId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const avatar = await ctx.db.get(args.avatarId);
    if (!avatar) throw new Error('Avatar not found');
    assertOwnerOrAdmin(user, avatar.userId);

    try {
      // Step 1: Convert script to speech using ElevenLabs
      const tts = getTTSAdapter();
      const audioKey = await tts.synthesize(args.script, args.voiceId);

      // Step 2: Generate video using RunComfy
      const video = getVideoAdapter();
      const clip = await video.lipSync(audioKey, avatar.baseImageUrl, args.videoPrompt);

      // Step 3: Store the video asset
      const assetId = await ctx.db.insert('avatarAssets', {
        avatarId: avatar._id,
        type: 'video',
        s3Key: clip.s3Key,
        width: 1080,
        height: 1920,
        durationSec: clip.durationSec,
        metadata: { 
          script: args.script,
          videoPrompt: args.videoPrompt,
          voiceId: args.voiceId,
          audioKey
        }
      });

      return {
        assetId: assetId.toString(),
        s3Key: clip.s3Key,
        durationSec: clip.durationSec
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});
