export interface VideoAdapter {
  lipSync(audioKey: string, imageKey: string, videoPrompt?: string): Promise<{ s3Key: string; durationSec: number }>;
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

class RunComfyVideoAdapter implements VideoAdapter {
  private apiKey: string;
  private deploymentId: string;
  private baseUrl = 'https://api.runcomfy.net/prod/v1';

  constructor(apiKey: string, deploymentId: string) {
    this.apiKey = apiKey;
    this.deploymentId = deploymentId;
  }

  async lipSync(audioKey: string, imageKey: string, videoPrompt: string = 'a person is talking'): Promise<{ s3Key: string; durationSec: number }> {
    try {
      // Generate presigned URLs for audio and image
      const audioUrl = await this.getDownloadUrl(audioKey);
      const imageUrl = await this.getDownloadUrl(imageKey);

      // Start the RunComfy inference job
      const inferenceResponse = await fetch(`${this.baseUrl}/deployments/${this.deploymentId}/inference`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          overrides: {
            "125": {
              "inputs": {
                "audio": audioUrl
              }
            },
            "241": {
              "inputs": {
                "positive_prompt": videoPrompt
              }
            },
            "284": {
              "inputs": {
                "image": imageUrl
              }
            }
          }
        })
      });

      if (!inferenceResponse.ok) {
        const errorText = await inferenceResponse.text();
        throw new Error(`RunComfy inference request failed: ${inferenceResponse.status} - ${errorText}`);
      }

      const inferenceData = await inferenceResponse.json();
      const requestId = inferenceData.request_id || inferenceData.id;

      if (!requestId) {
        throw new Error('No request_id returned from RunComfy inference');
      }

      // Poll for completion
      let videoUrl: string | null = null;
      const maxAttempts = 60; // 5 minutes with 5-second intervals
      const pollInterval = 5000; // 5 seconds

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        // Check status
        const statusResponse = await fetch(`${this.baseUrl}/deployments/${this.deploymentId}/requests/${requestId}/status`, {
          headers: { 'Authorization': this.apiKey }
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to check status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'succeeded' || statusData.status === 'completed') {
          // Get the result
          const resultResponse = await fetch(`${this.baseUrl}/deployments/${this.deploymentId}/requests/${requestId}/result`, {
            headers: { 'Authorization': this.apiKey }
          });

          if (!resultResponse.ok) {
            throw new Error(`Failed to get result: ${resultResponse.status}`);
          }

          const resultData = await resultResponse.json();

          // Extract video URL from result
          // The exact structure depends on RunComfy's response format
          videoUrl = resultData.output || resultData.outputs?.[0] || resultData.video_url;
          break;
        } else if (statusData.status === 'failed' || statusData.status === 'error') {
          throw new Error(`RunComfy job failed: ${statusData.error || 'Unknown error'}`);
        }

        // Continue polling if status is 'pending', 'processing', etc.
      }

      if (!videoUrl) {
        throw new Error('Video generation timed out or no video URL returned');
      }

      // Download the video and upload to S3
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error(`Failed to download generated video: ${videoResponse.status}`);
      }

      const videoBuffer = await videoResponse.arrayBuffer();

      // Generate S3 key for the video
      const timestamp = Date.now();
      const s3Key = `videos/generated/${timestamp}.mp4`;

      // Upload to S3
      const uploadUrl = await this.getUploadUrl(s3Key, 'video/mp4');
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'video/mp4' },
        body: videoBuffer
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload video to S3: ${uploadResponse.status}`);
      }

      // Estimate duration (you might want to use a library to get actual duration)
      const durationSec = 15; // Default estimate

      return {
        s3Key,
        durationSec
      };
    } catch (error) {
      console.error('RunComfy video generation error:', error);
      throw error;
    }
  }

  private async getDownloadUrl(key: string): Promise<string> {
    const convexUrl = process.env.STORYSTUDIO_CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error('STORYSTUDIO_CONVEX_URL or NEXT_PUBLIC_CONVEX_URL not configured');
    }

    const response = await fetch(`${convexUrl}/s3:getPresignedDownloadUrl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned download URL: ${response.status}`);
    }

    const data = await response.json();
    return data.downloadUrl;
  }

  private async getUploadUrl(key: string, contentType: string): Promise<string> {
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

let adapter: VideoAdapter | undefined;

export function getVideoAdapter(): VideoAdapter {
  if (adapter) return adapter;

  if (process.env.USE_MOCK_ADAPTERS !== 'false' || process.env.VIDEO_PROVIDER === 'mock') {
    adapter = new MockVideoAdapter();
    return adapter;
  }

  // Use RunComfy adapter
  const apiKey = process.env.RUNCOMFY_API_KEY;
  const deploymentId = process.env.RUNCOMFY_DEPLOYMENT_ID || 'bb5bcbdf-d63c-460c-bbaf-31237d987ee6';

  if (!apiKey) {
    throw new Error('RUNCOMFY_API_KEY not configured. Set USE_MOCK_ADAPTERS=true for local development.');
  }

  adapter = new RunComfyVideoAdapter(apiKey, deploymentId);
  return adapter;
}
