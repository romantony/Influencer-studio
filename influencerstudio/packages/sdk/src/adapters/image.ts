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
    const text = `${config.prompt}-${config.style}`;
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h * 31 + text.charCodeAt(i)) >>> 0;
    }
    const hash = h.toString(36).slice(0, 12);
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
