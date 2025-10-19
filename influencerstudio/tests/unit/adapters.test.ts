import { describe, it, expect } from 'vitest';
import { getLLMAdapter, getImageAdapter, getVideoAdapter, getTTSAdapter } from '@influencerstudio/sdk';

describe('adapter mocks', () => {
  it('generates captions with hashtags', async () => {
    const adapter = getLLMAdapter();
    const result = await adapter.generateCaption({
      persona: 'Ava Flux',
      tone: 'Bold',
      assetDescription: 'Launch trailer'
    });
    expect(result.caption).toContain('Ava Flux');
    expect(result.hashtags.length).toBeGreaterThan(0);
  });

  it('renders image to mock s3 key', async () => {
    const adapter = getImageAdapter();
    const result = await adapter.renderAvatar({ prompt: 'Cyber avatar', style: 'cinematic' });
    expect(result.s3Key).toContain('s3://');
  });

  it('creates tts audio and video lip sync', async () => {
    const tts = getTTSAdapter();
    const video = getVideoAdapter();
    const audioKey = await tts.synthesize('Hello world', 'voice-demo');
    const clip = await video.lipSync(audioKey, 'image.png');
    expect(audioKey).toContain('s3://');
    expect(clip.s3Key).toContain('s3://');
  });
});
