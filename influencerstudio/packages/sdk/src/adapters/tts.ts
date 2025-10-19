export interface TTSAdapter {
  synthesize(text: string, voiceId: string): Promise<string>;
}

class MockTTSAdapter implements TTSAdapter {
  async synthesize(text: string, voiceId: string): Promise<string> {
    void text;
    return `s3://mock-bucket/audio/${voiceId}-${Date.now()}.mp3`;
  }
}

let adapter: TTSAdapter | undefined;

export function getTTSAdapter(): TTSAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.TTS_PROVIDER === 'mock') {
    adapter = new MockTTSAdapter();
    return adapter;
  }

  throw new Error('No TTS adapter configured. Provide a concrete implementation.');
}
