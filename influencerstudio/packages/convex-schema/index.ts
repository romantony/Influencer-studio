export * as schema from './convex/schema';
export * as auth from './convex/auth';
export * as s3 from './convex/s3';
export * as influencers from './convex/influencers';
export * as avatars from './convex/avatars';
export * as content from './convex/content';
export * as posts from './convex/posts';
export * as moderation from './convex/moderation';
export * as analytics from './convex/analytics';
export * as notifications from './convex/notifications';
export * as schedulers from './convex/schedulers';
export * as instagram from './convex/instagram';
export * as settings from './convex/settings';

export const api = {
  s3: {
    getPresignedUploadUrl: 's3:getPresignedUploadUrl',
    getPresignedDownloadUrl: 's3:getPresignedDownloadUrl'
  },
  posts: {
    generateCaption: 'posts:generateCaption',
    generateHashtags: 'posts:generateHashtags'
  },
  influencers: {
    list: 'influencers:list',
    create: 'influencers:create'
  },
  avatars: {
    createFromText: 'avatars:createFromText',
    list: 'avatars:list'
  }
} as const;
