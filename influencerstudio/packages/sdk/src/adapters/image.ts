export interface ImageRenderConfig {
  avatarId?: string;
  prompt: string;
  style: 'realistic' | 'anime' | 'pixar' | 'cinematic';
  seed?: number;
}

export interface ImageAdapter {
  renderAvatar(config: ImageRenderConfig): Promise<{ s3Key: string; width: number; height: number }>;
}

class MockImageAdapter implements ImageAdapter {
  async renderAvatar(config: ImageRenderConfig) {
    const hash = Buffer.from(`${config.prompt}-${config.style}`).toString('base64url').slice(0, 12);
    return {
      s3Key: `s3://mock-bucket/avatars/${hash}.png`,
      width: 1024,
      height: 1024
    };
  }
}

let adapter: ImageAdapter | undefined;

export function getImageAdapter(): ImageAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.IMAGE_PROVIDER === 'mock') {
    adapter = new MockImageAdapter();
    return adapter;
  }

  throw new Error('No image adapter configured.');
}
