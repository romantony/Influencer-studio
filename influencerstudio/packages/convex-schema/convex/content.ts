import { mutation } from 'convex/server';
import { v } from 'convex/values';
import { getImageAdapter, getTTSAdapter, getVideoAdapter } from '@influencerstudio/sdk';
import { requireUserWithRole } from './auth';

export const generatePhotoSet = mutation({
  args: {
    avatarId: v.id('avatars'),
    outfitCount: v.number(),
    poseCount: v.number()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const avatar = await ctx.db.get(args.avatarId);
    if (!avatar) throw new Error('Avatar not found');

    const adapter = getImageAdapter();
    const assets = [] as { assetId: string; s3Key: string }[];

    for (let outfit = 0; outfit < args.outfitCount; outfit++) {
      for (let pose = 0; pose < args.poseCount; pose++) {
        const render = await adapter.renderAvatar({
          avatarId: avatar._id.toString(),
          prompt: `Avatar ${avatar.name} outfit ${outfit + 1} pose ${pose + 1}`,
          style: avatar.style as any
        });

        const assetId = await ctx.db.insert('avatarAssets', {
          avatarId: avatar._id,
          type: 'photo',
          s3Key: render.s3Key,
          width: render.width,
          height: render.height,
          metadata: { outfit, pose }
        });
        assets.push({ assetId: assetId.toString(), s3Key: render.s3Key });
      }
    }

    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: 'content:generatePhotoSet',
      subject: avatar._id.toString(),
      payload: args,
      createdAt: Date.now()
    });

    return assets;
  }
});

export const generateVideoClip = mutation({
  args: {
    avatarId: v.id('avatars'),
    script: v.string(),
    voiceId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await requireUserWithRole(ctx, 'creator');
    const avatar = await ctx.db.get(args.avatarId);
    if (!avatar) throw new Error('Avatar not found');

    const tts = getTTSAdapter();
    const video = getVideoAdapter();

    const audioKey = await tts.synthesize(args.script, args.voiceId);
    const clip = await video.lipSync(audioKey, avatar.baseImageUrl);

    const assetId = await ctx.db.insert('avatarAssets', {
      avatarId: avatar._id,
      type: 'video',
      s3Key: clip.s3Key,
      width: 1080,
      height: 1920,
      durationSec: clip.durationSec,
      metadata: { script: args.script }
    });

    return {
      assetId: assetId.toString(),
      s3Key: clip.s3Key
    };
  }
});
