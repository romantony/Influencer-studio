export interface TTSAdapter {
  synthesize(text: string, voiceId: string): Promise<string>;
}

class MockTTSAdapter implements TTSAdapter {
  async synthesize(text: string, voiceId: string): Promise<string> {
    void text;
    return `s3://mock-bucket/audio/${voiceId}-${Date.now()}.mp3`;
  }
}

class ElevenLabsTTSAdapter implements TTSAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async synthesize(text: string, voiceId: string): Promise<string> {
    try {
      // Call ElevenLabs TTS API
      const response = await fetch(`${this.baseUrl}/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      // Get audio buffer
      const audioBuffer = await response.arrayBuffer();

      // Generate S3 key for the audio file
      const timestamp = Date.now();
      const s3Key = `audio/tts/${voiceId}-${timestamp}.mp3`;

      // Upload to S3 using presigned URL or direct upload
      // For now, we'll use a utility function that should be available in the convex environment
      const uploadUrl = await this.getUploadUrl(s3Key, 'audio/mpeg');

      // Upload the audio file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'audio/mpeg'
        },
        body: audioBuffer
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload audio to S3: ${uploadResponse.status}`);
      }

      // Return the S3 key that can be used to generate download URLs
      return s3Key;
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }

  private async getUploadUrl(key: string, contentType: string): Promise<string> {
    // This will be called from Convex actions where we have access to S3 utilities
    // For now, return a placeholder that will be replaced when called from Convex
    const convexUrl = process.env.STORYSTUDIO_CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error('STORYSTUDIO_CONVEX_URL or NEXT_PUBLIC_CONVEX_URL not configured');
    }

    const response = await fetch(`${convexUrl}/s3:getPresignedUploadUrl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, contentType })
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned upload URL: ${response.status}`);
    }

    const data = await response.json();
    return data.uploadUrl;
  }
}

let adapter: TTSAdapter | undefined;

export function getTTSAdapter(): TTSAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.TTS_PROVIDER === 'mock') {
    adapter = new MockTTSAdapter();
    return adapter;
  }

  // Use ElevenLabs adapter
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured. Set USE_MOCK_ADAPTERS=true for local development.');
  }

  adapter = new ElevenLabsTTSAdapter(apiKey);
  return adapter;
}
