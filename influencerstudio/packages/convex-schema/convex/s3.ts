"use node";
import { action } from './_compat';
import { v } from 'convex/values';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_REGION ?? 'us-east-1';
const bucket = process.env.S3_BUCKET ?? 'influencerstudio-dev';

const s3Client = new S3Client({ region });

async function signPutUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
}

async function signGetUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}

export const getPresignedUploadUrl = action({
  args: {
    key: v.string(),
    contentType: v.string()
  },
  handler: async (_ctx, args) => {
    const key = `influencerstudio/${args.key}`;
    return {
      uploadUrl: await signPutUrl(key, args.contentType),
      key
    };
  }
});

export const getPresignedDownloadUrl = action({
  args: {
    key: v.string()
  },
  handler: async (_ctx, args) => {
    const key = `influencerstudio/${args.key}`;
    return {
      downloadUrl: await signGetUrl(key)
    };
  }
});

// Deletion is defined in s3_internal.ts as an internal mutation
