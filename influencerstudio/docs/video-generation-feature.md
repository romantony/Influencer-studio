# Avatar Video Generation Feature

This feature enables generating talking avatar videos using AI-powered text-to-speech and video synthesis.

## Components

### 1. ElevenLabs TTS Adapter (`packages/sdk/src/adapters/tts.ts`)
- Converts text scripts to natural-sounding speech
- Uploads audio files to S3
- Uses ElevenLabs Multilingual v2 model
- Supports multiple voices (Rachel, George, Adam, Sarah, Elli)

### 2. RunComfy Video Adapter (`packages/sdk/src/adapters/video.ts`)
- Generates talking head videos from static images
- Uses RunComfy Infinite Talk deployment
- Polls for completion and handles video download
- Uploads final video to S3

### 3. Video Generator Component (`apps/web/components/video-generator.tsx`)
- User interface for video creation
- Script input (500 char limit)
- Voice selection dropdown
- Video prompt customization
- Real-time progress tracking
- Video preview and download

### 4. Convex Mutation (`packages/convex-schema/convex/avatars.ts`)
- `generateVideo` mutation orchestrates the workflow:
  1. Convert script to speech (TTS)
  2. Generate video from image + audio + prompt
  3. Store video asset in database
  4. Return presigned download URL

## Setup

### Required Environment Variables

```bash
# ElevenLabs API
ELEVENLABS_API_KEY=sk_74bb5c88d108317c17280232eb5a4c161ec9a2bbb60ba481
TTS_PROVIDER=elevenlabs

# RunComfy API
RUNCOMFY_API_KEY=78963d72-fc33-4a9a-9419-7b79dd4b989b
RUNCOMFY_DEPLOYMENT_ID=bb5bcbdf-d63c-460c-bbaf-31237d987ee6
VIDEO_PROVIDER=runcomfy

# Convex & S3
STORYSTUDIO_CONVEX_URL=http://127.0.0.1:8187
AWS_REGION=us-east-1
S3_BUCKET=influencer-studio
USE_MOCK_ADAPTERS=false
```

### Installation

1. Copy environment variables to `.env.local`:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

2. Install dependencies (if needed):
```bash
cd apps/web
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

## Usage

### From Avatar Page

1. Navigate to `/app/avatars`
2. Select an avatar from the list
3. Click "Generate Video" button
4. Fill in the form:
   - **Voice**: Choose from available ElevenLabs voices
   - **Script**: Enter text for avatar to speak (max 500 chars)
   - **Video Prompt**: Describe the action/movement (e.g., "a person talking with hand gestures")
5. Click "Generate Video"
6. Wait for processing (typically 2-5 minutes)
7. Preview and download the generated video

### Programmatic Usage

```typescript
import { useAction } from 'convex/react'

const generateVideo = useAction('avatars:generateVideo' as any)

const result = await generateVideo({
  avatarId: 'avatar-123',
  script: 'Hello! Welcome to my channel.',
  videoPrompt: 'a person talking enthusiastically',
  voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel
})

console.log('Video URL:', result.videoUrl)
console.log('Duration:', result.durationSec)
```

## API Reference

### ElevenLabs Voices

| Voice ID | Name | Description |
|----------|------|-------------|
| `21m00Tcm4TlvDq8ikWAM` | Rachel | American, Female, Middle-aged |
| `JBFqnCBsd6RMkjVDRZzb` | George | British, Male, Mature |
| `pNInz6obpgDQGcFmaJgB` | Adam | American, Male, Deep |
| `EXAVITQu4vr4xnSDxMaL` | Sarah | American, Female, Soft |
| `MF3mGyEYCl7XYWbV9V6O` | Elli | American, Female, Young |

### RunComfy Input Parameters

- **Audio URL**: Presigned S3 URL to MP3 file
- **Image URL**: Presigned S3 URL to avatar image
- **Positive Prompt**: Description of desired video action

## File Structure

```
packages/sdk/src/adapters/
├── tts.ts              # ElevenLabs TTS adapter
└── video.ts            # RunComfy video adapter

packages/convex-schema/convex/
└── avatars.ts          # generateVideo mutation

apps/web/components/
└── video-generator.tsx # UI component

apps/web/app/(dashboard)/app/avatars/
└── page.tsx            # Updated with video generator
```

## Troubleshooting

### Common Issues

**Video generation timeout**
- Increase poll interval or max attempts in `video.ts`
- Check RunComfy service status

**Audio upload fails**
- Verify S3 credentials and bucket permissions
- Check CORS configuration

**Invalid voice ID**
- Use one of the supported ElevenLabs voice IDs
- Check ElevenLabs account status

**Type errors in UI**
- These are cosmetic and don't affect runtime
- Will be resolved when UI components are properly typed

## Future Enhancements

- [ ] AI-powered script generation using LLM
- [ ] Batch video generation
- [ ] Custom voice cloning
- [ ] Video editing (trim, add captions)
- [ ] Multiple avatar support in single video
- [ ] Background music and effects
- [ ] Direct Instagram/TikTok publishing
