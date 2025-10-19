# InfluencerStudio

InfluencerStudio is the AI-first Instagram creator workspace in the **StudioSuite**. It combines avatar generation, persona management, content scheduling, moderation, and analytics in a single TypeScript monorepo. The application is designed to integrate with the existing StoryStudio Convex backend, StoryStudio APIs, and AWS S3 unified storage while remaining fully runnable with local mocks.

## Table of contents

- [Architecture](#architecture)
- [Features](#features)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
  - [Install & run](#install--run)
  - [Seeding demo data](#seeding-demo-data)
- [Adapters & integrations](#adapters--integrations)
  - [StoryStudio SDK](#storystudio-sdk)
  - [Model adapters](#model-adapters)
  - [Instagram callbacks](#instagram-callbacks)
  - [Firebase Authentication](#firebase-authentication)
- [Storage conventions](#storage-conventions)
- [Testing & CI](#testing--ci)
- [Deployment](#deployment)
- [Extending the platform](#extending-the-platform)
  - [Connecting to StoryStudio Convex](#connecting-to-storystudio-convex)
  - [Replacing mocks with production services](#replacing-mocks-with-production-services)
- [Repository layout](#repository-layout)

## Architecture

- **Web**: Next.js 14 App Router app under `apps/web` using Tailwind, shadcn/ui primitives, React Query, and Firebase Authentication.
- **Convex schema & functions**: Lives in `packages/convex-schema`, exposing tables, queries, mutations, and guardrails.
- **Shared SDKs**: `packages/sdk` contains adapters for LLM, image, TTS, and video pipelines with mock implementations plus the StoryStudio REST client.
- **Shared UI kit**: `packages/ui` exposes typed React components reused across the app.
- **Configuration**: `packages/config` provides base tsconfig, eslint config, and OpenAPI schema.
- **Infrastructure samples**: Dockerfiles and Terraform snippets to bootstrap hosting on AWS S3 + CloudFront.
- **Tooling**: pnpm workspaces + turborepo orchestrate builds, linting, type-checking, unit tests, and Playwright e2e tests.

## Features

### AI Avatar Creator
- Generate avatars from prompts or stylize selfies.
- Customize outfits, backgrounds, and export photo sets or short video clips using mock adapters.
- Asset library surfaces generated media for reuse.

### AI Instagram Influencer
- Persona builder with tone, pillars, and target audience metadata.
- Post generator produces captions, hashtags, and CTAs via the LLM adapter.
- Scheduler provides calendar UI with conflict detection placeholders and webhook integrations.
- Engage assistant (mock) suggests replies for comments/DMs.

### Moderation & Safety
- Caption and media scanning with deny-list + mock NSFW heuristics.
- Admin override flow writes audit logs for compliance.

### Analytics
- Mocked metrics and recommended posting windows with heuristics that can be replaced by StoryStudio analytics feeds.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 8 (`corepack enable pnpm@8`)
- Convex CLI (`npm i -g convex`) for connecting to a real backend
- AWS credentials with permission to generate pre-signed URLs (for production use)

### Environment variables

Copy `.env.sample` to `.env.local` in the repo root and provide the required values:

```bash
cp .env.sample .env.local
```

Key variables:

- `STORYSTUDIO_CONVEX_URL` — base URL to the shared Convex deployment
- `STORYSTUDIO_API_BASE_URL` / `STORYSTUDIO_API_KEY` — REST integration endpoints
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` — unified media storage bucket
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment for InfluencerStudio (dedicated instance recommended)
- `NEXT_PUBLIC_FIREBASE_*` — Firebase web configuration for sign-in and Convex auth tokens
- `USE_MOCK_ADAPTERS=true` keeps all AI services offline-friendly. Set to `false` after wiring real adapters.

### Install & run

```bash
pnpm install
pnpm dev
```

This runs the Next.js web app. To attach a Convex dev instance, run `pnpm convex dev` from `packages/convex-schema` in another terminal.

### Seeding demo data

Generate a sample avatar asset and caption with the mock adapters:

```bash
pnpm seed
```

Check console output for mock S3 keys and captions.

## Adapters & integrations

### StoryStudio SDK

`packages/sdk/storystudio.ts` exposes helper methods (`createImagePrompt`, `createVideoPrompt`, `transcribeAudio`, `getCostsAndUsage`). When `USE_MOCK_ADAPTERS=true`, these methods return deterministic mocks. Clear TODO comments mark where to call the real StoryStudio APIs once credentials are provided.

### Model adapters

The `packages/sdk/src/adapters` directory defines adapter interfaces for captioning (LLM), image rendering, TTS, and video lip-sync. Each adapter:

- Reads provider selection via environment variables (`LLM_PROVIDER`, `IMAGE_PROVIDER`, etc.)
- Defaults to mock implementations that require no paid services
- Can be swapped with real providers by exporting a compatible implementation and setting `USE_MOCK_ADAPTERS=false`

### Instagram callbacks

`apps/web/app/api/callbacks/instagram/*` provide typed HTTP handlers that log publish and comment payloads. Replace the logging with Convex mutations or downstream processing when connecting to the real Instagram Business API.

### Firebase Authentication

InfluencerStudio authenticates creators with Firebase using the Story Factory project configuration provided above. The Firebase Web SDK runs entirely on the client while Convex trusts Firebase ID tokens via `convex.setAuth`. When running locally or on Vercel:

- Keep the default keys from `.env.sample` or supply your own Firebase project via the `NEXT_PUBLIC_FIREBASE_*` variables.
- Ensure the same credentials are configured in Vercel environment settings and any background Convex deployment.
- Extend `apps/web/components/providers.tsx` if you need additional auth providers (e.g., Apple, Facebook) by wiring the corresponding Firebase sign-in method and syncing extra metadata through the `auth:ensureUser` mutation.

## Storage conventions

Unified bucket layout:

```
s3://$S3_BUCKET/influencerstudio/
  users/{userId}/uploads/{uuid}/{filename}
  users/{userId}/avatars/{avatarId}/base.png
  users/{userId}/avatars/{avatarId}/assets/{assetId}.{png|mp4|json}
  users/{userId}/posts/{postId}/media.{png|mp4}
  users/{userId}/exports/{postId}/instagram-ready.{mp4|jpg}
```

Convex functions in `convex/s3.ts` expose helpers for generating upload/download URLs. For local development, route handlers return mock URLs when `USE_MOCK_ADAPTERS` is true.

## Testing & CI

- **Unit tests** (`pnpm test`) use Vitest. There are dedicated suites for adapter mocks and moderation heuristics.
- **End-to-end tests** (`pnpm e2e`) use Playwright to validate critical flows (marketing CTA, avatar dashboard).
- **CI** workflow (`infra/github/workflows/ci.yml`) runs lint, type-check, unit, and e2e suites on pushes and pull requests.

## Deployment

- `infra/docker/web.Dockerfile` builds a production image for the Next.js app.
- `infra/docker/convextasks.Dockerfile` prepares Convex tasks or cron workers.
- Terraform samples under `infra/iac` bootstrap AWS S3 with CORS, bucket policy, and an optional CloudFront distribution.
- Deploy the web app on **Vercel** for the smoothest CI/CD pipeline. Configure project environment variables with the Firebase web config, `NEXT_PUBLIC_CONVEX_URL`, and StoryStudio endpoints.
- Provision a **dedicated Convex instance** for InfluencerStudio instead of sharing the StoryStudio deployment to avoid cross-app coupling. Update `NEXT_PUBLIC_CONVEX_URL` (web) and `CONVEX_DEPLOYMENT` (server) accordingly.

## Extending the platform

### Connecting to StoryStudio Convex

1. Deploy the Convex schema in `packages/convex-schema/convex` to your StoryStudio environment.
2. Populate `.env.local` with the remote deployment URL.
3. Replace mock API calls (e.g., `/s3:getPresignedUploadUrl`) with real `fetchMutation`/`fetchQuery` calls using Convex generated clients.

### Replacing mocks with production services

- **LLM**: Implement `LLMAdapter` with your provider of choice (OpenAI, Anthropic). Export it from `adapters/llm.ts` when `LLM_PROVIDER` matches the provider name.
- **Image/TTS/Video**: Add new adapters in `packages/sdk/src/adapters` and wire credentials via environment variables.
- **Analytics**: Swap the mocked heuristics in `convex/analytics.ts` with data returned from StoryStudio’s analytics endpoints.
- **Scheduler**: Replace `instagramPublish` mock logic with real Graph API publishing. Use Next.js route handlers for webhook verification.

## Repository layout

```
influencerstudio/
  apps/web/                # Next.js application
  packages/                # Shared schema, UI kit, SDK, and config
  infra/                   # Dockerfiles, GitHub Actions, Terraform samples
  scripts/                 # Developer scripts (dev, seed, openapi export)
  tests/                   # Vitest + Playwright suites
```

For more details on each package, check the inline documentation within the respective directories.
