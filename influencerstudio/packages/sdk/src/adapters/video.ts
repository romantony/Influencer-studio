export interface VideoAdapter {
  lipSync(audioKey: string, imageKey: string): Promise<{ s3Key: string; durationSec: number }>;
}

class MockVideoAdapter implements VideoAdapter {
  async lipSync(audioKey: string, imageKey: string) {
    void audioKey;
    void imageKey;
    return {
      s3Key: `s3://mock-bucket/videos/${Date.now()}.mp4`,
      durationSec: 15
    };
  }
}

let adapter: VideoAdapter | undefined;

export function getVideoAdapter(): VideoAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.VIDEO_PROVIDER === 'mock') {
    adapter = new MockVideoAdapter();
    return adapter;
  }

  throw new Error('No video adapter configured.');
}
